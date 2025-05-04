"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Download,
  Medal,
  Filter
} from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EvaluationRankingProps {
  tenderId: number
  tenderTitle: string
  submissionCount: number
  submissions: {
    id: number
    rank: number
    vendor: string
    score: number
    technicalScore: number
    financialScore: number
    complianceScore: number
    status: "pending" | "evaluated" | "recommended" | "rejected"
    evaluationDate?: string
  }[]
}

export function EvaluationRanking({
  tenderId,
  tenderTitle,
  submissionCount,
  submissions
}: EvaluationRankingProps) {
  const sortedSubmissions = [...submissions].sort((a, b) => a.rank - b.rank)
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{tenderTitle}</CardTitle>
            <CardDescription>{submissionCount} submissions ranked by AI evaluation</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead className="text-center">Overall Score</TableHead>
              <TableHead className="text-center">Technical</TableHead>
              <TableHead className="text-center">Financial</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {submission.rank === 1 ? (
                      <div className="h-7 w-7 rounded-full bg-yellow-100 flex items-center justify-center mr-1">
                        <Medal className="h-4 w-4 text-yellow-600" />
                      </div>
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                        {submission.rank}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{submission.vendor}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <div className={`h-8 rounded-md flex items-center justify-center px-3 font-medium text-white ${
                      submission.score >= 75 
                        ? "bg-green-500" 
                        : submission.score >= 60 
                        ? "bg-amber-500" 
                        : "bg-red-500"
                    }`}>
                      {submission.score}/100
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={
                    submission.technicalScore >= 80 
                      ? "bg-green-50 text-green-700" 
                      : submission.technicalScore >= 60 
                      ? "bg-amber-50 text-amber-700" 
                      : "bg-red-50 text-red-700"
                  }>
                    {submission.technicalScore}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={
                    submission.financialScore >= 80 
                      ? "bg-green-50 text-green-700" 
                      : submission.financialScore >= 60 
                      ? "bg-amber-50 text-amber-700" 
                      : "bg-red-50 text-red-700"
                  }>
                    {submission.financialScore}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {submission.status === "pending" ? (
                    <Badge variant="secondary">Pending</Badge>
                  ) : submission.status === "evaluated" ? (
                    <Badge variant="outline">Evaluated</Badge>
                  ) : submission.status === "recommended" ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Recommended</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/staff/committee-dashboard/evaluation/${submission.id}`} className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          View Evaluation
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/staff/committee-dashboard/submissions/${submission.id}`} className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          View Submission
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 