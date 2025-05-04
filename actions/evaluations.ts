import { createClient } from "@/utils/supabase/server";
import { EvaluatedApplication } from "@/lib/db-schema";

/**
 * Save evaluation to the database
 */
export async function saveEvaluation(evaluation: Omit<EvaluatedApplication, 'id'>): Promise<EvaluatedApplication | null> {
  try {
    const supabase = await createClient();
    
    // Insert the evaluation into the evaluated_application table
    const { data, error } = await supabase
      .from('evaluated_applications')
      .upsert({
        application_id: evaluation.application_id,
        vendor_name: evaluation.vendor_name,
        tender_title: evaluation.tender_title,
        score: evaluation.score,
        technical_score: evaluation.technical_score,
        financial_score: evaluation.financial_score,
        recommendation: evaluation.recommendation,
        created_at: evaluation.created_at,
        evaluation_data: evaluation.evaluation_data
      }, {
        onConflict: 'application_id',
        ignoreDuplicates: false ,
      })
      .select();
    
    if (error) {
      console.log("Error saving evaluation to database:", error);
      return null;
    }
    
    // Update the submission status to evaluated
    const { error: updateError } = await supabase
      .from('submissions')
      .update({ 
        status: evaluation.recommendation === 'reject' ? 'rejected' : 'evaluated',
        score: evaluation.score
      })
      .eq('id', evaluation.application_id);
    
    if (updateError) {
      console.log("Error updating submission status:", updateError);
    }
    
    return data?.[0] as EvaluatedApplication || null;
  } catch (error) {
    console.log("Error in saveEvaluation:", error);
    return null;
  }
}

/**
 * Get all evaluations from the database
 */
export async function getEvaluations(): Promise<EvaluatedApplication[]> {
  try {
    
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('evaluated_applications')
      .select('*')
      .order('score', { ascending: false });
    
    if (error) {
      console.error("Error fetching evaluations:", error);
      return [];
    }
    
    return data as EvaluatedApplication[];
  } catch (error) {
    console.error("Error in getEvaluations:", error);
    return [];
  }
}

/**
 * Get evaluations by tender ID
 */
export async function getEvaluationsByTender(tenderId: string): Promise<EvaluatedApplication[]> {
  try {
    
    const supabase = await createClient();
    
    // First fetch submissions for this tender
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('id')
      .eq('tender_id', tenderId);
    
    if (submissionsError || !submissions.length) {
      console.error("Error fetching submissions for tender:", submissionsError);
      return [];
    }
    
    // Then get evaluations for these submissions
    const submissionIds = submissions.map(sub => sub.id);
    const { data, error } = await supabase
      .from('evaluated_applications')
      .select('*')
      .in('application_id', submissionIds)
      .order('score', { ascending: false });
    
    if (error) {
      console.error("Error fetching evaluations for tender:", error);
      return [];
    }
    
    return data as EvaluatedApplication[];
  } catch (error) {
    console.error("Error in getEvaluationsByTender:", error);
    return [];
  }
}

/**
 * Get a single evaluation by submission ID
 */
export async function getEvaluationBySubmission(submissionId: string): Promise<EvaluatedApplication | null> {
  try {
    
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('evaluated_applications')
      .select('*')
      .eq('application_id', submissionId)
      .single();
    
    if (error) {
      console.error("Error fetching evaluation:", error);
      return null;
    }
    
    return data as EvaluatedApplication;
  } catch (error) {
    console.error("Error in getEvaluationBySubmission:", error);
    return null;
  }
} 