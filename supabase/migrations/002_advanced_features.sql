-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on wishlist
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Wishlist policies
CREATE POLICY "Users can view their own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist" ON wishlist
  FOR ALL USING (auth.uid() = user_id);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_path TEXT,
  user_agent TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on analytics_events (admin only for reading)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Analytics policies
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view analytics events" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND (email = 'admin@futurepathguides.com' OR raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_discount DECIMAL(10,2),
  min_purchase_amount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on coupons
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Coupons policies
CREATE POLICY "Anyone can view active coupons" ON coupons
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage coupons" ON coupons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND (email = 'admin@futurepathguides.com' OR raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on email_templates (admin only)
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email templates" ON email_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND (email = 'admin@futurepathguides.com' OR raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Insert some default email templates
INSERT INTO email_templates (name, subject, html_content, text_content, variables) VALUES 
(
  'purchase_confirmation',
  'Thank you for your purchase!',
  '<h1>Thank you for your purchase!</h1><p>Hi {{customer_name}},</p><p>Your purchase of {{product_name}} has been confirmed.</p><p>You can download your files from your dashboard.</p>',
  'Thank you for your purchase! Hi {{customer_name}}, Your purchase of {{product_name}} has been confirmed. You can download your files from your dashboard.',
  '["customer_name", "product_name", "download_link"]'
),
(
  'welcome_email',
  'Welcome to FuturePath Guides!',
  '<h1>Welcome to FuturePath Guides!</h1><p>Hi {{customer_name}},</p><p>Welcome to our community of success-driven individuals!</p>',
  'Welcome to FuturePath Guides! Hi {{customer_name}}, Welcome to our community of success-driven individuals!',
  '["customer_name"]'
);

-- Function to send welcome notification
CREATE OR REPLACE FUNCTION send_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (
    NEW.id,
    'Welcome to FuturePath Guides!',
    'Thank you for joining our community. Explore our blueprints to start your success journey.',
    'success'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for welcome notification
DROP TRIGGER IF EXISTS on_user_welcome_notification ON auth.users;
CREATE TRIGGER on_user_welcome_notification
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION send_welcome_notification();

-- Function to send purchase notification
CREATE OR REPLACE FUNCTION send_purchase_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (
    NEW.user_id,
    'Purchase Confirmed!',
    'Your purchase of ' || NEW.product_name || ' has been confirmed. You can now download your files from the dashboard.',
    'success'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for purchase notification
DROP TRIGGER IF EXISTS on_purchase_notification ON purchases;
CREATE TRIGGER on_purchase_notification
  AFTER INSERT ON purchases
  FOR EACH ROW EXECUTE FUNCTION send_purchase_notification();

-- Function to update coupon usage
CREATE OR REPLACE FUNCTION update_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.coupon_id IS NOT NULL THEN
    UPDATE coupons 
    SET usage_count = usage_count + 1 
    WHERE id = NEW.coupon_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add coupon_id to purchases table
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id);
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- Trigger for coupon usage
DROP TRIGGER IF EXISTS on_coupon_usage ON purchases;
CREATE TRIGGER on_coupon_usage
  AFTER INSERT ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_coupon_usage();