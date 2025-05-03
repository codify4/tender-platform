import { NextRequest, NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const userType = requestUrl.searchParams.get('type') || ''
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?message=Could not authenticate`
      )
    }
    
    // Check which type of user has authenticated
    if (userType === 'vendor') {
      // Check if vendor already has a profile
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return NextResponse.redirect(
          `${requestUrl.origin}/signin?message=Authentication failed`
        )
      }
      
      const { data: vendorProfile } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        
      if (vendorProfile) {
        // Vendor has a profile, redirect to dashboard
        return NextResponse.redirect(`${requestUrl.origin}/vendor/dashboard`)
      } else {
        // Vendor needs to create a profile
        return NextResponse.redirect(`${requestUrl.origin}/vendor/profile`)
      }
    } else if (userType === 'staff') {
      // Check if staff already has a role
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return NextResponse.redirect(
          `${requestUrl.origin}/signin?message=Authentication failed`
        )
      }
      
      const { data: staffRole } = await supabase
        .from('staff_roles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (staffRole) {
        // Staff has a role, redirect to appropriate dashboard
        if (staffRole.role === 'procurement_officer') {
          return NextResponse.redirect(`${requestUrl.origin}/staff/procurement-dashboard`)
        } else {
          return NextResponse.redirect(`${requestUrl.origin}/staff/committee-dashboard`)
        }
      } else {
        // Staff needs to select a role
        return NextResponse.redirect(`${requestUrl.origin}/staff/role`)
      }
    } else {
      // Default redirect for unspecified user type
      return NextResponse.redirect(`${requestUrl.origin}/signin?message=Invalid user type`)
    }
  }
  
  // If there's no code, redirect to signin page
  return NextResponse.redirect(`${requestUrl.origin}/signin?message=No code provided`)
}