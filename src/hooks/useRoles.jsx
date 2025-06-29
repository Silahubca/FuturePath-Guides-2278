import { useState, useEffect } from 'react'
import { useAuth } from './useAuth.jsx'
import { supabase } from '../lib/supabase'

export const useRoles = () => {
  const { user } = useAuth()
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserRoles()
      fetchUserPermissions()
    } else {
      setRoles([])
      setPermissions([])
      setLoading(false)
    }
  }, [user])

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, granted_at, expires_at')
        .eq('user_id', user.id)
        .eq('active', true)
        .gte('expires_at', new Date().toISOString())

      if (error) throw error
      setRoles(data || [])
    } catch (error) {
      console.error('Error fetching user roles:', error)
    }
  }

  const fetchUserPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          role,
          role_permissions!inner(
            permissions!inner(name, description, category)
          )
        `)
        .eq('user_id', user.id)
        .eq('active', true)
        .gte('expires_at', new Date().toISOString())

      if (error) throw error

      // Flatten permissions from all roles
      const allPermissions = []
      data?.forEach(roleData => {
        roleData.role_permissions?.forEach(rp => {
          if (rp.permissions && !allPermissions.find(p => p.name === rp.permissions.name)) {
            allPermissions.push(rp.permissions)
          }
        })
      })

      setPermissions(allPermissions)
    } catch (error) {
      console.error('Error fetching user permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasRole = (roleName) => {
    return roles.some(role => role.role === roleName)
  }

  const hasPermission = (permissionName) => {
    return permissions.some(permission => permission.name === permissionName)
  }

  const hasAnyRole = (roleNames) => {
    return roleNames.some(roleName => hasRole(roleName))
  }

  const hasAnyPermission = (permissionNames) => {
    return permissionNames.some(permissionName => hasPermission(permissionName))
  }

  const isAdmin = () => hasRole('admin')
  const isModerator = () => hasRole('moderator')
  const isSupport = () => hasRole('support')

  return {
    roles,
    permissions,
    loading,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    isAdmin,
    isModerator,
    isSupport,
    refetch: () => {
      fetchUserRoles()
      fetchUserPermissions()
    }
  }
}

// Hook for managing other users' roles (admin only)
export const useRoleManagement = () => {
  const { hasPermission } = useRoles()
  const [loading, setLoading] = useState(false)

  const assignRole = async (userId, role, expiresAt = null) => {
    if (!hasPermission('manage_roles')) {
      throw new Error('Insufficient permissions to assign roles')
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('assign_user_role', {
        target_user_id: userId,
        new_role: role,
        granted_by_user_id: (await supabase.auth.getUser()).data.user.id,
        expires_at_param: expiresAt
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error assigning role:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const revokeRole = async (userId, role) => {
    if (!hasPermission('manage_roles')) {
      throw new Error('Insufficient permissions to revoke roles')
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('revoke_user_role', {
        target_user_id: userId,
        role_to_revoke: role,
        revoked_by_user_id: (await supabase.auth.getUser()).data.user.id
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error revoking role:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getUserRoles = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, granted_at, expires_at, granted_by')
        .eq('user_id', userId)
        .eq('active', true)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user roles:', error)
      throw error
    }
  }

  const getAllUsers = async () => {
    if (!hasPermission('view_user_profiles')) {
      throw new Error('Insufficient permissions to view users')
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          first_name,
          last_name,
          created_at,
          user_roles!inner(role, granted_at, expires_at, active)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  const getRoleAuditLog = async (userId = null) => {
    if (!hasPermission('view_admin_dashboard')) {
      throw new Error('Insufficient permissions to view audit log')
    }

    try {
      let query = supabase
        .from('role_audit_log')
        .select(`
          *,
          target_user:user_profiles!target_user_id(first_name, last_name),
          performed_by_user:user_profiles!performed_by(first_name, last_name)
        `)
        .order('performed_at', { ascending: false })
        .limit(100)

      if (userId) {
        query = query.eq('target_user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching audit log:', error)
      throw error
    }
  }

  return {
    loading,
    assignRole,
    revokeRole,
    getUserRoles,
    getAllUsers,
    getRoleAuditLog
  }
}