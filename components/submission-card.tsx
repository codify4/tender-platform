import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Star } from "lucide-react"
import Link from "next/link"

interface SubmissionCardProps {
  submission: {
    id: string
    vendor: string
    tenderTitle: string
    submittedAt: string
    status: string
    score: number | null
    rank?: number
    isLocked?: boolean
  }
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{submission.tenderTitle}</CardTitle>
        <div className="text-sm text-muted-foreground">{submission.vendor}</div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm">Submitted: {submission.submittedAt}</div>
          <Badge
            className={
              submission.status === "pending"
                ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                : submission.status === "evaluated"
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                  : submission.status === "recommended"
                    ? "bg-green-50 text-green-700 hover:bg-green-50"
                    : "bg-red-50 text-red-700 hover:bg-red-50"
            }
          >
            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
          </Badge>
        </div>
        {submission.score !== null && (
          <div className="flex items-center justify-between">
            <div className="text-sm">Score:</div>
            <div className="font-medium">{submission.score}/100</div>
          </div>
        )}
        {submission.rank && (
          <div className="flex items-center justify-between">
            <div className="text-sm">Rank:</div>
            <div className="font-medium">#{submission.rank}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 pt-2">
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/staff/committee-dashboard/submissions/${submission.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
          {submission.status === "pending" && (
            <Button size="sm" asChild>
              <Link href={`/staff/committee-dashboard/submissions/${submission.id}`}>
                <Star className="h-4 w-4 mr-1" />
                Evaluate
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
