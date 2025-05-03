"use client"

import { useState, useEffect } from "react"
import { Loader2, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function EvaluationLoadingState() {
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState(0)
  
  const stages = [
    "Parsing submission documents...",
    "Analyzing technical specifications...",
    "Reviewing financial details...",
    "Checking compliance requirements...",
    "Generating evaluation report...",
    "Finalizing scores and recommendations..."
  ]
  
  useEffect(() => {
    // Simulate progress and stages
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        
        const increment = Math.random() * 10 + 5
        const newProgress = Math.min(prevProgress + increment, 100)
        
        // Update stage based on progress
        const newStage = Math.min(
          Math.floor((newProgress / 100) * stages.length),
          stages.length - 1
        )
        
        if (newStage !== currentStage) {
          setCurrentStage(newStage)
        }
        
        return newProgress
      })
    }, 600)
    
    return () => clearInterval(timer)
  }, [currentStage, stages.length])
  
  return (
    <div className="py-6 space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">AI Evaluation in Progress</p>
        <Progress value={progress} />
        <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
      </div>
      
      <div className="space-y-2">
        {stages.map((stage, index) => (
          <div key={index} className="flex items-center">
            {index < currentStage ? (
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <Check className="h-3 w-3 text-green-600" />
              </div>
            ) : index === currentStage ? (
              <Loader2 className="h-5 w-5 mr-2 text-muted-foreground animate-spin" />
            ) : (
              <div className="h-5 w-5 rounded-full border border-muted-foreground/20 mr-2" />
            )}
            <p className={`text-sm ${index <= currentStage ? "text-foreground" : "text-muted-foreground"}`}>
              {stage}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 