"use client"

import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import EvaluationLoadingState from "@/components/evaluation/evaluation-loading-state"

interface AIEvaluationButtonProps {
  submissionId: number
  tenderTitle: string
  disabled?: boolean
  isEvaluated?: boolean
}

export function AIEvaluationButton({ 
  submissionId, 
  tenderTitle, 
  disabled = false,
  isEvaluated = false 
}: AIEvaluationButtonProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEvaluation = async () => {
    setIsLoading(true)
    
    // Simulate API call for AI evaluation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsLoading(false)
    setOpen(false)
    
    // Navigate to the evaluation results page
    router.push(`/staff/committee-dashboard/evaluation/${submissionId}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={isEvaluated ? "outline" : "default"} 
          size="sm" 
          disabled={disabled}
          className="flex items-center gap-1"
        >
          <Sparkles className="h-4 w-4" />
          {isEvaluated ? "View AI Evaluation" : "Evaluate with AI"}
        </Button>
      </DialogTrigger>
      
      {!isEvaluated && (
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>AI Evaluation</DialogTitle>
            <DialogDescription>
              Perform an AI-powered evaluation of this tender submission.
            </DialogDescription>
          </DialogHeader>
          
          {isLoading ? (
            <EvaluationLoadingState />
          ) : (
            <>
              <div className="py-4">
                <p>You are about to evaluate the submission for:</p>
                <p className="font-medium mt-1">{tenderTitle}</p>
                <p className="text-sm text-muted-foreground mt-4">
                  The AI will analyze all documents and provide a comprehensive evaluation including:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                  <li>Overall score</li>
                  <li>Technical analysis</li>
                  <li>Financial analysis</li>
                  <li>Compliance report</li>
                </ul>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleEvaluation} className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Start AI Evaluation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      )}
    </Dialog>
  )
} 