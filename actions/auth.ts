'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server';
import { getURL } from '@/utils/helpers';

export async function googleSignIn() {
    const supabase = await createClient();
    const redirectUrl = getURL('/auth/callback');
  
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
        },
    });
  
    if(error){
        return redirect('/signin?message=Could not authenticate');
    }

    console.log(data.url);

    redirect(data.url);
}

export async function logOut() {
    const supabase = await createClient();
    let { error } = await supabase.auth.signOut();

    if(error){
        return redirect('/dashboard?message=Could not log out');
    }
    
    redirect('/signin');
}