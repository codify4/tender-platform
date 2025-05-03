"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Calendar, LockIcon } from "lucide-react"
import Link from "next/link"
import { AIEvaluationButton } from "./ai-evaluation-button"

interface SubmissionCardProps {
  submission: {
    id: number
    tenderId: number
    tenderTitle: string
    vendor: string
    submissionDate: string
    documents: number
    status: "pending_review" | "under_evaluation" | "evaluated"
    score?: number
    isLocked?: boolean
    endDate?: string
  }
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const isEvaluated = submission.status === "evaluated"
  const canEvaluate = !submission.isLocked && submission.status !== "evaluated"
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{submission.tenderTitle}</CardTitle>
          <Badge 
            variant={
              submission.status === "pending_review" 
                ? "secondary" 
                : submission.status === "under_evaluation" 
                ? "outline" 
                : "default"
            }
          >
            {submission.status === "pending_review" 
              ? "Pending Review" 
              : submission.status === "under_evaluation" 
              ? "Under Evaluation" 
              : "Evaluated"}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground mt-1">{submission.vendor}</div>
        
        {submission.isLocked && (
          <div className="flex items-center text-xs text-amber-600 mt-2">
            <LockIcon className="h-3 w-3 mr-1" />
            <span>Locked until {submission.endDate}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <FileText className="h-4 w-4 mr-1" /> 
          <span>{submission.documents} document{submission.documents !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="text-sm text-muted-foreground mt-1">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Submitted on: {submission.submissionDate}</span>
          </div>
          {submission.endDate && (
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>End date: {submission.endDate}</span>
            </div>
          )}
        </div>
        
        {isEvaluated && submission.score !== undefined && (
          <div className="mt-4">
            <div className="text-sm font-medium">AI Evaluation Score</div>
            <div className="flex items-center mt-1">
              <div className={`h-8 rounded-md flex items-center justify-center px-2 text-white font-medium ${
                submission.score >= 80 
                  ? "bg-green-500" 
                  : submission.score >= 60 
                  ? "bg-amber-500" 
                  : "bg-red-500"
              }`}>
                {submission.score}/100
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/staff/committee-dashboard/submissions/${submission.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Link>
        </Button>
        
        <AIEvaluationButton 
          submissionId={submission.id} 
          tenderTitle={submission.tenderTitle}
          disabled={submission.isLocked}
          isEvaluated={isEvaluated}
        />
      </CardFooter>
    </Card>
  )
} 