import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TenderTable, type Tender } from './components/tender-table'

export default async function TendersPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin?message=Please sign in to continue')
  }
  
  // Verify role
  const role = await getStaffRole()
  
  if (role !== 'procurement_officer') {
    redirect('/staff/role?message=You do not have access to this page')
  }

  // Mock data for tenders - in a real application, fetch from Supabase
  const tenders: Tender[] = [
    { 
      id: 1, 
      reference: "TEN-2024-001", 
      title: "IT Equipment Supply", 
      category: "Goods",
      startDate: "2024-05-01", 
      endDate: "2024-06-01", 
      status: "active",
      submissionCount: 4,
      hasEvaluation: true,
    },
    { 
      id: 2, 
      reference: "TEN-2024-002", 
      title: "Office Renovation", 
      category: "Works",
      startDate: "2024-05-10", 
      endDate: "2024-06-10", 
      status: "active",
      submissionCount: 2,
      hasEvaluation: true,
    },
    { 
      id: 3, 
      reference: "TEN-2024-003", 
      title: "Consulting Services", 
      category: "Consultancy",
      startDate: "2024-06-01", 
      endDate: "2024-07-01", 
      status: "draft",
      submissionCount: 0,
      hasEvaluation: false,
    },
    { 
      id: 4, 
      reference: "TEN-2024-004", 
      title: "Software Licenses", 
      category: "Services",
      startDate: "2024-04-15", 
      endDate: "2024-05-15", 
      status: "completed",
      submissionCount: 5,
      hasEvaluation: true,
    },
    { 
      id: 5, 
      reference: "TEN-2024-005", 
      title: "Vehicle Fleet", 
      category: "Goods",
      startDate: "2024-04-01", 
      endDate: "2024-05-01", 
      status: "completed",
      submissionCount: 3,
      hasEvaluation: true,
    }
  ]

  // Filter tenders by status
  const activeTenders = tenders.filter(tender => tender.status === "active")
  const completedTenders = tenders.filter(tender => tender.status === "completed")
  const draftTenders = tenders.filter(tender => tender.status === "draft")

  return (
    <div className="flex w-full flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Tenders</h1>
        <Button asChild className="flex items-center gap-1">
          <Link href="/staff/procurement-dashboard/tenders/new">
            <Plus className="size-4 mr-1" />
            Create New Tender
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeTenders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedTenders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{draftTenders.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Tenders</CardTitle>
          <CardDescription>
            Manage your tenders and view their status and evaluation results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TenderTable tenders={tenders} />
            </TabsContent>
            
            <TabsContent value="active">
              <TenderTable tenders={activeTenders} />
            </TabsContent>
            
            <TabsContent value="completed">
              <TenderTable tenders={completedTenders} />
            </TabsContent>
            
            <TabsContent value="draft">
              <TenderTable tenders={draftTenders} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 