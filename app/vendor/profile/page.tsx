import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { saveVendorProfile, getVendorProfile } from '@/actions/vendor-auth'
import { Textarea } from '@/components/ui/textarea'

export default async function VendorProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin?message=Please sign in to continue')
  }
  
  // Get existing profile if available
  const profile = await getVendorProfile()
  
  // Use await to access searchParams properties
  const { message } = await searchParams
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Company Profile</CardTitle>
          <CardDescription>
            Please provide your company information to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveVendorProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name*</Label>
              <Input 
                id="companyName" 
                name="companyName" 
                placeholder="Enter company name" 
                required 
                defaultValue={profile?.company_name || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNo">Phone Number</Label>
              <Input 
                id="phoneNo" 
                name="phoneNo" 
                placeholder="Enter phone number" 
                defaultValue={profile?.phone_no || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activityCountry">Country of Activity</Label>
              <Input 
                id="activityCountry" 
                name="activityCountry" 
                placeholder="Enter country of business activity" 
                defaultValue={profile?.activity_country || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residenceCity">City of Residence</Label>
              <Input 
                id="residenceCity" 
                name="residenceCity" 
                placeholder="Enter city of residence" 
                defaultValue={profile?.residence_city || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Enter a brief description of your company" 
                defaultValue={profile?.description || ''}
                rows={4}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Save Profile
            </Button>
          </form>
          
          {message && (
            <p className="mt-4 p-4 bg-red-50 text-red-500 text-center rounded">
              {message}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Fields marked with * are required
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 