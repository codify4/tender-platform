import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { vendorGoogleSignIn } from '@/actions/vendor-auth'
import { staffGoogleSignIn } from '@/actions/staff-auth'
import GoogleSignInButton from '@/components/ui/google-signin-button'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  // Await searchParams to access its properties
  const { message } = await searchParams
  
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Choose your account type to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vendor" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vendor" className='cursor-pointer'>Vendor</TabsTrigger>
              <TabsTrigger value="staff" className='cursor-pointer'>Staff</TabsTrigger>
            </TabsList>
            <TabsContent value="vendor" className="py-4">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in as a vendor to manage your company profile and tenders.
                </p>
                <GoogleSignInButton action={vendorGoogleSignIn} type="vendor" />
              </div>
            </TabsContent>
            <TabsContent value="staff" className="py-4">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in as staff to access procurement or committee dashboards.
                </p>
                <GoogleSignInButton action={staffGoogleSignIn} type="staff" />
              </div>
            </TabsContent>
          </Tabs>
          
          {message && (
            <p className="mt-4 p-4 bg-red-50 text-red-500 text-center rounded">
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}