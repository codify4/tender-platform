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

export default function VendorDashboardPage() {
  redirect("/vendor");
} 