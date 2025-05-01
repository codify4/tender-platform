import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'
import { SigninForm } from './components/signin-form';

async function SignInPage() {

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) redirect('/dashboard')
    return (
        <div className="flex justify-center items-center h-screen">
            <SigninForm className="w-11/12 md:w-1/2 lg:w-1/3" />
        </div>
    )
}

export default SignInPage