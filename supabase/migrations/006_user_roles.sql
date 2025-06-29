-- User roles and permissions system

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'moderator', 'support')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- User roles policies
CREATE POLICY "Admins can view all user roles" ON user_roles 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin' 
      AND ur.active = true
    )
  );

CREATE POLICY "Users can view their own roles" ON user_roles 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles" ON user_roles 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin' 
      AND ur.active = true
    )
  );

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role permissions mapping
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(role, permission_id)
);

-- Enable RLS on permissions and role_permissions
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Permissions policies (read-only for most users)
CREATE POLICY "Anyone can view permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Anyone can view role permissions" ON role_permissions FOR SELECT USING (true);

-- Insert default permissions
INSERT INTO permissions (name, description, category) VALUES
  ('view_admin_dashboard', 'Access admin dashboard', 'admin'),
  ('manage_users', 'Create, update, delete users', 'user_management'),
  ('manage_roles', 'Assign and revoke user roles', 'user_management'),
  ('view_analytics', 'View platform analytics', 'analytics'),
  ('manage_products', 'Create, update, delete products', 'content'),
  ('manage_coupons', 'Create, update, delete coupons', 'sales'),
  ('view_purchases', 'View all user purchases', 'sales'),
  ('manage_notifications', 'Send system notifications', 'communication'),
  ('moderate_reviews', 'Moderate user reviews', 'content'),
  ('access_support_tools', 'Access customer support tools', 'support'),
  ('view_user_profiles', 'View detailed user profiles', 'user_management'),
  ('export_data', 'Export platform data', 'admin');

-- Assign permissions to roles
INSERT INTO role_permissions (role, permission_id) 
SELECT 'admin', id FROM permissions;

INSERT INTO role_permissions (role, permission_id) 
SELECT 'moderator', id FROM permissions 
WHERE name IN ('moderate_reviews', 'access_support_tools', 'view_user_profiles');

INSERT INTO role_permissions (role, permission_id) 
SELECT 'support', id FROM permissions 
WHERE name IN ('access_support_tools', 'view_user_profiles', 'view_purchases');

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(user_uuid UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role = rp.role
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = user_uuid
    AND p.name = permission_name
    AND ur.active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user roles
CREATE OR REPLACE FUNCTION get_user_roles(user_uuid UUID)
RETURNS TABLE(role TEXT, granted_at TIMESTAMP WITH TIME ZONE, expires_at TIMESTAMP WITH TIME ZONE) AS $$
BEGIN
  RETURN QUERY
  SELECT ur.role, ur.granted_at, ur.expires_at
  FROM user_roles ur
  WHERE ur.user_id = user_uuid
  AND ur.active = true
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign role to user
CREATE OR REPLACE FUNCTION assign_user_role(
  target_user_id UUID,
  new_role TEXT,
  granted_by_user_id UUID,
  expires_at_param TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if granter has admin permissions
  IF NOT user_has_permission(granted_by_user_id, 'manage_roles') THEN
    RAISE EXCEPTION 'Insufficient permissions to assign roles';
  END IF;

  -- Insert or update role
  INSERT INTO user_roles (user_id, role, granted_by, expires_at)
  VALUES (target_user_id, new_role, granted_by_user_id, expires_at_param)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET 
    granted_by = granted_by_user_id,
    granted_at = NOW(),
    expires_at = expires_at_param,
    active = true;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revoke role from user
CREATE OR REPLACE FUNCTION revoke_user_role(
  target_user_id UUID,
  role_to_revoke TEXT,
  revoked_by_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if revoker has admin permissions
  IF NOT user_has_permission(revoked_by_user_id, 'manage_roles') THEN
    RAISE EXCEPTION 'Insufficient permissions to revoke roles';
  END IF;

  -- Deactivate role
  UPDATE user_roles 
  SET active = false
  WHERE user_id = target_user_id 
  AND role = role_to_revoke;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create default admin user (replace with your actual admin email)
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find admin user by email
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@futurepathguides.com';

  -- If admin user exists, assign admin role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role, granted_by)
    VALUES (admin_user_id, 'admin', admin_user_id)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;

-- Update existing policies to use role-based permissions
-- Update admin dashboard policy
DROP POLICY IF EXISTS "Admins can view analytics events" ON analytics_events;
CREATE POLICY "Users with view_analytics permission can view analytics events" ON analytics_events 
  FOR SELECT USING (user_has_permission(auth.uid(), 'view_analytics'));

-- Update coupons policy
DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
CREATE POLICY "Users with manage_coupons permission can manage coupons" ON coupons 
  FOR ALL USING (user_has_permission(auth.uid(), 'manage_coupons'));

-- Update email templates policy
DROP POLICY IF EXISTS "Admins can manage email templates" ON email_templates;
CREATE POLICY "Users with admin permissions can manage email templates" ON email_templates 
  FOR ALL USING (user_has_permission(auth.uid(), 'view_admin_dashboard'));

-- Add audit log for role changes
CREATE TABLE IF NOT EXISTS role_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('granted', 'revoked', 'expired')),
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details JSONB
);

-- Enable RLS on audit log
ALTER TABLE role_audit_log ENABLE ROW LEVEL SECURITY;

-- Audit log policies
CREATE POLICY "Admins can view role audit log" ON role_audit_log 
  FOR SELECT USING (user_has_permission(auth.uid(), 'view_admin_dashboard'));

-- Function to log role changes
CREATE OR REPLACE FUNCTION log_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO role_audit_log (target_user_id, role, action, performed_by, details)
    VALUES (NEW.user_id, NEW.role, 'granted', NEW.granted_by, 
            jsonb_build_object('expires_at', NEW.expires_at));
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.active = true AND NEW.active = false THEN
      INSERT INTO role_audit_log (target_user_id, role, action, performed_by, details)
      VALUES (NEW.user_id, NEW.role, 'revoked', auth.uid(), 
              jsonb_build_object('reason', 'manual_revocation'));
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for role audit logging
DROP TRIGGER IF EXISTS role_change_audit_trigger ON user_roles;
CREATE TRIGGER role_change_audit_trigger
  AFTER INSERT OR UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION log_role_change();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON user_roles(active);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_role_audit_log_target_user ON role_audit_log(target_user_id);