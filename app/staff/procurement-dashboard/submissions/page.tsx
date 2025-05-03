import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getStaffRole } from '@/actions/staff-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default async function SubmissionsPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin?message=Please sign in to continue')
  }
  
  // Verify role
  const role = await getStaffRole()
  
  if (role !== 'procurement_officer' && role !== 'committee_officer') {
    redirect('/staff/role?message=You do not have access to this page')
  }

  // Mock data for submissions
  const submissions = [
    { id: 1, vendor: "TechCorp Solutions", tender: "IT Equipment Supply", date: "2023-11-15", status: "pending", score: "-" },
    { id: 2, vendor: "Buildex Construction", tender: "Office Renovation", date: "2023-11-20", status: "under_review", score: "75/100" },
    { id: 3, vendor: "Agile Consulting Group", tender: "Consulting Services", date: "2023-11-22", status: "approved", score: "92/100" },
    { id: 4, vendor: "SoftTech Ltd", tender: "Software Licenses", date: "2023-11-10", status: "rejected", score: "45/100" },
    { id: 5, vendor: "CloudSystems Inc", tender: "IT Equipment Supply", date: "2023-11-14", status: "pending", score: "-" },
  ]

  return (
    <div className="flex w-full flex-col p-8">
      <h1 className="text-3xl font-bold mb-6">Tender Submissions</h1>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Manage Submissions</CardTitle>
              <CardDescription>Review and evaluate vendor submissions</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search submissions..."
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Submissions</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="rounded-md border">
                <div className="grid grid-cols-6 p-4 font-medium border-b">
                  <div>Vendor</div>
                  <div>Tender</div>
                  <div>Submission Date</div>
                  <div>Status</div>
                  <div>Score</div>
                  <div>Actions</div>
                </div>
                {submissions.map((submission) => (
                  <div key={submission.id} className="grid grid-cols-6 p-4 border-b last:border-0">
                    <div className="font-medium">{submission.vendor}</div>
                    <div>{submission.tender}</div>
                    <div>{submission.date}</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        submission.status === 'pending' 
                          ? 'bg-yellow-50 text-yellow-700' 
                          : submission.status === 'under_review'
                          ? 'bg-blue-50 text-blue-700'
                          : submission.status === 'approved'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {submission.status.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </div>
                    <div>{submission.score}</div>
                    <div>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pending">
              <div className="rounded-md border">
                <div className="grid grid-cols-6 p-4 font-medium border-b">
                  <div>Vendor</div>
                  <div>Tender</div>
                  <div>Submission Date</div>
                  <div>Status</div>
                  <div>Score</div>
                  <div>Actions</div>
                </div>
                {submissions
                  .filter(submission => submission.status === 'pending')
                  .map((submission) => (
                    <div key={submission.id} className="grid grid-cols-6 p-4 border-b last:border-0">
                      <div className="font-medium">{submission.vendor}</div>
                      <div>{submission.tender}</div>
                      <div>{submission.date}</div>
                      <div>
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-semibold text-yellow-700">
                          Pending
                        </span>
                      </div>
                      <div>{submission.score}</div>
                      <div>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviewed">
              <div className="rounded-md border">
                <div className="grid grid-cols-6 p-4 font-medium border-b">
                  <div>Vendor</div>
                  <div>Tender</div>
                  <div>Submission Date</div>
                  <div>Status</div>
                  <div>Score</div>
                  <div>Actions</div>
                </div>
                {submissions
                  .filter(submission => submission.status !== 'pending')
                  .map((submission) => (
                    <div key={submission.id} className="grid grid-cols-6 p-4 border-b last:border-0">
                      <div className="font-medium">{submission.vendor}</div>
                      <div>{submission.tender}</div>
                      <div>{submission.date}</div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          submission.status === 'under_review'
                            ? 'bg-blue-50 text-blue-700'
                            : submission.status === 'approved'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {submission.status.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </div>
                      <div>{submission.score}</div>
                      <div>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Showing {submissions.length} submissions
          </div>
          <Button>Create New Submission</Button>
        </CardFooter>
      </Card>
    </div>
  )
}