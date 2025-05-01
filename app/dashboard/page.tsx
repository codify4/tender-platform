import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import React from 'react'
import Image from 'next/image';

async function DashboardPage() {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/signin');
    }

    return (
        <div>
            {user.email}
            <Image src={user.user_metadata.avatar_url} alt="avatar" width={100} height={100} />
        </div>
    )
}

export default DashboardPage