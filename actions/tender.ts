'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTender(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const ceiling_fund = parseFloat(formData.get('ceiling_fund') as string)
    const published_at = formData.get('published_at') as string
    const deadline = formData.get('deadline') as string
    
    // Get current user for created_by
    const { data: { user } } = await supabase.auth.getUser()
    
    // Determine status based on publish date
    const now = new Date()
    const publishDate = new Date(published_at)
    const deadlineDate = new Date(deadline)
    
    let status = 'draft'
    if (publishDate <= now && now <= deadlineDate) {
      status = 'published'
    } else if (now > deadlineDate) {
      status = 'closed'
    }
    
    // Generate a reference number (if needed)
    const reference = `TEN-${Date.now().toString().slice(-6)}`
    
    // Insert tender into database
    const { error } = await supabase
      .from('tenders')
      .insert({
        title,
        description,
        type,
        ceiling_fund,
        published_at,
        deadline,
        status,
        created_by: user?.id
      })
    
    if (error) {
      console.error('Error creating tender:', error)
      return { success: false, error: error.message, redirect: '/staff/procurement-dashboard/tenders/new?error=' + encodeURIComponent(error.message) }
    }
    
    // Revalidate the tenders page
    revalidatePath('/staff/procurement-dashboard/tenders')
    
    // Return success with redirect path
    return { success: true, redirect: '/staff/procurement-dashboard/tenders' }
  } catch (error) {
    console.error('Error in createTender:', error)
    return { success: false, error: 'Failed to create tender', redirect: '/staff/procurement-dashboard/tenders/new?error=' + encodeURIComponent('Failed to create tender') }
  }
}

export async function deleteTender(tenderId: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('tenders')
      .delete()
      .eq('id', tenderId)
    
    if (error) {
      console.error('Error deleting tender:', error)
      return { success: false, error: error.message }
    }
    
    // Revalidate the tenders page
    revalidatePath('/staff/procurement-dashboard/tenders')
    
    return { success: true }
  } catch (error) {
    console.error('Error in deleteTender:', error)
    return { success: false, error: 'Failed to delete tender' }
  }
} 