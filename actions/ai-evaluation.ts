"use server"

import { mockEvaluations } from "@/lib/evaluations"
import { revalidatePath } from "next/cache"

// This file is kept for reference but is no longer used in the direct link approach
// The evaluation is now accessed directly without server-side processing

export async function generateAIEvaluation(submissionId: string) {
  // In a real application, this would call an AI service
  // For this demo, we'll return a pre-generated evaluation

  // Find the pre-generated evaluation for this submission
  const aiEvaluation = mockEvaluations.find((evalItem) => evalItem.application_id === submissionId)

  if (!aiEvaluation) {
    throw new Error("Failed to generate evaluation")
  }

  return aiEvaluation
}

export async function saveEvaluation(evaluation: any, submissionId: string) {
  // In a real application, this would save to the database
  // For this demo, we'll just simulate a successful save

  // Revalidate the submissions page to reflect changes
  revalidatePath("/staff/committee-dashboard/submissions")
  revalidatePath(`/staff/committee-dashboard/submissions/${submissionId}`)

  return { success: true }
}
