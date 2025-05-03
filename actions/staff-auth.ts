'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getURL } from '@/utils/helpers'

export async function staffGoogleSignIn() {
  const supabase = await createClient()
  
  // Get the full URL for callback including the origin
  const redirectUrl = getURL('/auth/callback?type=staff')
  
  console.log("Redirecting to:", redirectUrl)
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error("Google auth error:", error)
    return redirect('/signin?message=Could not authenticate')
  }

  // Redirect to Google's auth page
  console.log("Redirecting to Google:", data.url)
  return redirect(data.url)
}

export async function setStaffRole(role: 'procurement_officer' | 'committee_officer') {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return redirect('/signin?message=Not authenticated')
  }
  
  const { error } = await supabase
    .from('staff_roles')
    .upsert({
      id: user.id,
      role,
      updated_at: new Date().toISOString(),
    })
  
  if (error) {
    console.error('Error setting staff role:', error)
    return redirect('/staff/role?message=Could not set role')
  }
  
  if (role === 'procurement_officer') {
    return redirect('/staff/procurement-dashboard')
  } else {
    return redirect('/staff/committee-dashboard')
  }
}

export async function getStaffRole() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }
  
  const { data, error } = await supabase
    .from('staff_roles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (error) {
    console.error('Error getting staff role:', error)
    return null
  }
  
  return data.role
}

export async function checkStaffRoleExists() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }
  
  const { data, error } = await supabase
    .from('staff_roles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (error || !data) {
    return false
  }
  
  return true
} 