'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getStaffRole } from './staff-auth'

/**
 * Create a new tender with optional document uploads
 */
export async function createTender(formData: FormData) {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin?message=Please sign in to continue')
  }
  
  // Check role permission
  const role = await getStaffRole()
  
  if (role !== 'procurement_officer') {
    redirect('/staff/role?message=You do not have permission to create tenders')
  }
  
  try {
    // Extract form data
    const title = formData.get('title') as string
    const reference = formData.get('reference') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const eligibility = formData.get('eligibility') as string
    const status = formData.get('status') as string
    const documents = formData.getAll('documents')
    
    // Validate required fields
    if (!title || !reference || !startDate || !endDate || !category || !description || !eligibility || !status) {
      return { error: 'All required fields must be provided' }
    }
    
    // Insert tender into database
    const { data: tenderData, error: tenderError } = await supabase
      .from('tenders')
      .insert({
        title,
        reference,
        start_date: startDate,
        end_date: endDate,
        category,
        description,
        eligibility_criteria: eligibility,
        status,
        created_by: user.id
      })
      .select('id')
      .single()
    
    if (tenderError) {
      console.error('Error creating tender:', tenderError)
      return { error: 'Failed to create tender' }
    }
    
    const tenderId = tenderData.id
    
    // Upload documents if any
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        if (doc instanceof File && doc.size > 0) {
          const fileName = `${tenderId}/${Date.now()}-${doc.name}`
          
          const { error: uploadError } = await supabase
            .storage
            .from('tender_documents')
            .upload(fileName, doc, {
              cacheControl: '3600',
              upsert: false
            })
          
          if (uploadError) {
            console.error('Error uploading document:', uploadError)
            return { error: 'Tender created but some documents failed to upload' }
          }
          
          // Record the document in the database
          await supabase
            .from('tender_documents')
            .insert({
              tender_id: tenderId,
              file_name: doc.name,
              file_path: fileName,
              file_type: doc.type,
              file_size: doc.size,
              uploaded_by: user.id
            })
        }
      }
    }
    
    // Revalidate paths and redirect
    revalidatePath('/staff/procurement-dashboard/tenders')
    redirect('/staff/procurement-dashboard/tenders?message=Tender created successfully')
    
  } catch (error) {
    console.error('Error in createTender:', error)
    return { error: 'An unexpected error occurred' }
  }
} 