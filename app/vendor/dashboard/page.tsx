import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getVendorProfile } from '@/actions/vendor-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { logOut } from '@/actions/auth'

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            {profile.registration_number && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
                <p>{profile.registration_number}</p>
              </div>
            )}
            
            {profile.address && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{profile.address}</p>
              </div>
            )}
            
            {profile.phone_number && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p>{profile.phone_number}</p>
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
    </div>
  )
} 