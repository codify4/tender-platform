import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeft, 
  FileText, 
  Download, 
  Calendar, 
  Building, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  BarChartHorizontal,
  FileBarChart,
  Users,
  Briefcase,
  FlaskConical
} from 'lucide-react'
import Link from 'next/link'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from '@/components/ui/separator'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EvaluationResultsPage({ params }: PageProps) {
  const supabase = await createClient()
  const submissionId = parseInt(params.id)
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin?message=Please sign in to continue')
  }
  
  // Verify role
  const role = await getStaffRole()
  
  if (role !== 'committee_officer') {
    redirect('/staff/role?message=You do not have access to this page')
  }

  // Mock evaluation data - in a real app, fetch this from the database
  const evaluation = {
    id: 101,
    submissionId: submissionId,
    tenderTitle: "IT Equipment Supply",
    tenderReference: "TEN2023-101",
    endDate: "2023-12-15",
    vendor: "TechCorp Ltd",
    evaluationDate: "2023-11-15",
    evaluationType: "AI",
    overallScore: 84,
    technicalScore: 80, // 65% weight
    financialScore: 92, // 35% weight
    technicalWeighting: 0.65,
    financialWeighting: 0.35,
    isLocked: false,
    recommendation: "This submission is recommended for the award due to its high technical specifications, competitive pricing, and strong compliance with requirements.",
    technicalEvaluation: {
      team: {
        score: 82,
        weight: 0.25,
        details: "Strong team with relevant qualifications and experience. Key personnel have demonstrated expertise in similar projects."
      },
      experience: {
        score: 78,
        weight: 0.30,
        details: "Extensive experience in delivering similar IT equipment projects. Has successfully completed 5 major deployments in the last 3 years."
      },
      trials: {
        score: 85,
        weight: 0.10,
        details: "Equipment performed well in trials. All test cases passed with minor issues in software configuration."
      },
      strengths: [
        "Highly qualified technical team with certifications",
        "Proven track record of similar deployments",
        "Excellent performance in equipment trials",
        "Extended warranty period of 3 years for all equipment",
        "Includes technical support plan and SLA"
      ],
      weaknesses: [
        "Delivery timeline slightly longer than optimal",
        "Some team members have less experience with specific equipment models"
      ]
    },
    financialEvaluation: {
      totalCost: "$245,780",
      value: "High value proposition considering technical specifications and cost",
      breakdown: [
        { item: "Laptops (50 units)", cost: "$75,000", comment: "Competitive pricing for high-spec models" },
        { item: "Desktops (30 units)", cost: "$42,000", comment: "Good value for specifications provided" },
        { item: "Servers (5 units)", cost: "$60,000", comment: "High-end configuration with good pricing" },
        { item: "Peripherals", cost: "$28,000", comment: "Standard market rates" },
        { item: "Software Licenses", cost: "$25,780", comment: "Includes volume discounts" },
        { item: "Support & Maintenance", cost: "$15,000", comment: "3-year comprehensive support package" }
      ],
      costEffectiveness: "High cost-effectiveness with optimal balance between price and quality. Total cost is within budget and represents good value for the specifications provided."
    },
    otherSubmissions: [
      { id: 2, vendor: "Compumax Solutions", score: 72 },
      { id: 3, vendor: "DigiTech Systems", score: 65 },
      { id: 4, vendor: "IT Providers Inc", score: 79 }
    ]
  }

  // Calculate weighted scores
  const technicalWeightedScore = Math.round(evaluation.technicalScore * evaluation.technicalWeighting * 100) / 100
  const financialWeightedScore = Math.round(evaluation.financialScore * evaluation.financialWeighting * 100) / 100
  const teamScore = Math.round(evaluation.technicalEvaluation.team.score * 100) / 100
  const experienceScore = Math.round(evaluation.technicalEvaluation.experience.score * 100) / 100
  const trialsScore = Math.round(evaluation.technicalEvaluation.trials.score * 100) / 100

  return (
    <div className="flex w-full flex-col p-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/staff/committee-dashboard/submissions">
            <ChevronLeft className="size-6 mr-1" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Evaluation Results</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Overview Card */}
        <Card className="lg:col-span-2  ">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{evaluation.tenderTitle}</CardTitle>
                <CardDescription>Vendor: {evaluation.vendor} | Reference: {evaluation.tenderReference}</CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant="outline">
                  Evaluated on {evaluation.evaluationDate}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">by AI Assistant</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-md">
                <p className="text-xs text-muted-foreground">Overall Score</p>
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-green-700">{evaluation.overallScore}</span>
                </div>
                <p className="text-xs text-muted-foreground">out of 100</p>
              </div>
              
              <div className="space-y-1 flex flex-col p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Technical (65%)</p>
                  <p className="text-xs font-medium">{technicalWeightedScore}</p>
                </div>
                <Progress value={evaluation.technicalScore} className="h-2" />
                <p className="text-xs font-medium mt-1">{evaluation.technicalScore}/100</p>
                
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-muted-foreground">Financial (35%)</p>
                  <p className="text-xs font-medium">{financialWeightedScore}</p>
                </div>
                <Progress value={evaluation.financialScore} className="h-2" />
                <p className="text-xs font-medium mt-1">{evaluation.financialScore}/100</p>
              </div>
              
              <div className="space-y-1 flex flex-col p-4 bg-gray-50 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Ranking</p>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <span className="text-lg font-bold text-green-700">1</span>
                  </div>
                  <p className="text-xs">of {evaluation.otherSubmissions.length + 1} submissions</p>
                </div>
                
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Decision</p>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Recommended</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
            <CardDescription>Review and approve evaluation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/staff/committee-dashboard/submissions/${evaluation.submissionId}`}>
                  View Submission Details
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full">
                Download Evaluation Report
              </Button>
              
              <Button variant="outline" className="w-full">
                Add Your Comments
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Validation</p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-50 flex justify-start gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve Evaluation</span>
                </Button>
                
                <Button variant="outline" className="w-full text-left flex justify-start gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Request Human Review</span>
                </Button>
                
                <Button variant="outline" className="w-full text-left flex justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="h-4 w-4" />
                  <span>Reject Evaluation</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Evaluation Tabs */}
      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="technical" className="flex items-center gap-1">
            <FileBarChart className="h-4 w-4" />
            Technical Evaluation (65%)
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-1">
            <BarChartHorizontal className="h-4 w-4" />
            Financial Evaluation (35%)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Evaluation</CardTitle>
              <CardDescription>
                Overall Technical Score: <Badge variant="outline">{evaluation.technicalScore}/100</Badge>
                <span className="ml-2 text-xs text-muted-foreground">(Weighted: {technicalWeightedScore} points)</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 p-4 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-medium">Team (25%)</h3>
                  </div>
                  <Progress value={evaluation.technicalEvaluation.team.score} className="h-2" />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Score: {teamScore}/100</p>
                    <p className="text-xs font-medium">Weight: 25%</p>
                  </div>
                  <p className="text-xs mt-2">{evaluation.technicalEvaluation.team.details}</p>
                </div>
                
                <div className="space-y-2 p-4 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-medium">Experience (30%)</h3>
                  </div>
                  <Progress value={evaluation.technicalEvaluation.experience.score} className="h-2" />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Score: {experienceScore}/100</p>
                    <p className="text-xs font-medium">Weight: 30%</p>
                  </div>
                  <p className="text-xs mt-2">{evaluation.technicalEvaluation.experience.details}</p>
                </div>
                
                <div className="space-y-2 p-4 border rounded-md">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-[#1a3c70]" />
                    <h3 className="text-sm font-medium">Trials (10%)</h3>
                  </div>
                  <Progress value={evaluation.technicalEvaluation.trials.score} className="h-2" />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Score: {trialsScore}/100</p>
                    <p className="text-xs font-medium">Weight: 10%</p>
                  </div>
                  <p className="text-xs mt-2">{evaluation.technicalEvaluation.trials.details}</p>
                </div>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                    Strengths
                  </h3>
                  <ul className="space-y-1">
                    {evaluation.technicalEvaluation.strengths.map((strength, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                    Weaknesses
                  </h3>
                  <ul className="space-y-1">
                    {evaluation.technicalEvaluation.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Evaluation</CardTitle>
              <CardDescription>
                Overall Financial Score: <Badge variant="outline">{evaluation.financialScore}/100</Badge>
                <span className="ml-2 text-xs text-muted-foreground">(Weighted: {financialWeightedScore} points)</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div>
                  <h3 className="text-sm font-medium">Total Cost</h3>
                  <p className="text-xs text-muted-foreground">All inclusive</p>
                </div>
                <div className="text-xl font-bold">{evaluation.financialEvaluation.totalCost}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Value Proposition</h3>
                <p className="text-sm text-muted-foreground">{evaluation.financialEvaluation.value}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Cost Breakdown</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluation.financialEvaluation.breakdown.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell>{item.cost}</TableCell>
                        <TableCell className="text-sm">{item.comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Cost Effectiveness Analysis</h3>
                <p className="text-sm text-muted-foreground">{evaluation.financialEvaluation.costEffectiveness}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 