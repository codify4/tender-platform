'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getURL } from '@/utils/helpers'

export async function vendorGoogleSignIn() {
  const supabase = await createClient()
  
  // Get the full URL for callback including the origin
  const redirectUrl = getURL('/auth/callback?type=vendor')
  
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

export async function saveVendorProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return redirect('/signin?message=Not authenticated')
  }
  
  const companyName = formData.get('companyName') as string
  const registrationNumber = formData.get('registrationNumber') as string
  const address = formData.get('address') as string
  const phoneNumber = formData.get('phoneNumber') as string
  
  const { error } = await supabase
    .from('vendor_profiles')
    .upsert({
      id: user.id,
      company_name: companyName,
      registration_number: registrationNumber,
      address,
      phone_number: phoneNumber,
      updated_at: new Date().toISOString(),
    })
  
  if (error) {
    console.error('Error saving vendor profile:', error)
    return redirect('/vendor/profile?message=Could not save profile')
  }
  
  return redirect('/vendor/dashboard')
}

export async function getVendorProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }
  
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error) {
    // Check if this is a "no rows returned" error which happens for new users
    if (error.code === 'PGRST116') {
      // Profile doesn't exist yet - this is expected for new users
      return null
    }
    
    console.error('Error getting vendor profile:', error)
    return null
  }
  
  return data
} 