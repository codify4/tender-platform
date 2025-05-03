import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getVendorProfile } from '@/actions/vendor-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { logOut } from '@/actions/auth'

// Define types for the data structure
type TenderData = {
  id: string;
  title: string;
  deadline: string;
  status: string;
}

type ApplicationData = {
  id: string;
  status: string;
  submission_id: string | null;
  tenders: TenderData;
}

export default async function VendorDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin?message=Please sign in to continue')
  }
  
  // Get vendor profile
  const profile = await getVendorProfile()
  
  if (!profile) {
    redirect('/vendor/profile?message=Please complete your profile')
  }
  
  // Fetch vendor's applications
  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      id, 
      status, 
      submission_id,
      tenders!inner(id, title, deadline, status)
    `)
    .eq('vendor_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching applications:', error)
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <form action={logOut}>
          <Button variant="outline" type="submit">Log Out</Button>
        </form>
      </div>
      
      {message && (
        <p className="mt-4 p-4 bg-green-50 text-green-500 text-center rounded">
          {message}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>Your company information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Company Name</p>
              <p>{profile.company_name}</p>
            </div>
            
            {profile.phone_no && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p>{profile.phone_no}</p>
              </div>
            )}
            
            {profile.activity_country && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Country of Activity</p>
                <p>{profile.activity_country}</p>
              </div>
            )}
            
            {profile.residence_city && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">City of Residence</p>
                <p>{profile.residence_city}</p>
              </div>
            )}
            
            {profile.description && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p>{profile.description}</p>
              </div>
            )}
            
            <Button asChild className="w-full mt-4">
              <Link href="/vendor/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{user.email}</p>
            </div>
            
            {user.user_metadata?.name && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p>{user.user_metadata.name}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Applications you've submitted for tenders</CardDescription>
        </CardHeader>
        <CardContent>
          {applications && applications.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-4 p-4 font-medium border-b">
                <div>Tender</div>
                <div>Deadline</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              
              {applications ? (applications as unknown as ApplicationData[]).map((app) => (
                <div key={app.id} className="grid grid-cols-4 p-4 border-b last:border-0">
                  <div className="font-medium">{app.tenders.title}</div>
                  <div>{app.tenders.deadline ? new Date(app.tenders.deadline).toLocaleDateString() : 'N/A'}</div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      app.status === 'pending' || app.status === 'submitted'
                        ? 'bg-yellow-50 text-yellow-600'
                        : app.status === 'under_review'
                        ? 'bg-blue-50 text-blue-600'
                        : app.status === 'approved'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/vendor/applications/${app.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              )) : null}
            </div>
          ) : (
            <p className="text-muted-foreground text-center p-4">
              You haven't submitted any applications yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 