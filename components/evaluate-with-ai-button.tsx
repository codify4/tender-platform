'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'
import { evaluateSubmission } from '@/actions/evaluate-submission'

interface EvaluateWithAIButtonProps {
  submissionId: number
}

export function EvaluateWithAIButton({ submissionId }: EvaluateWithAIButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEvaluate = async () => {
    try {
      setIsLoading(true)
      await evaluateSubmission(submissionId)
      router.push(`/staff/committee-dashboard/evaluation/${submissionId}`)
    } catch (error) {
      console.error('Error evaluating submission:', error)
      alert('Failed to evaluate submission. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      className="flex items-center gap-1"
      onClick={handleEvaluate}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Evaluating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Evaluate with AI
        </>
      )}
    </Button>
  )
} 