'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

async function checkAdminStatus(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
  return data === true;
}

export default function HomePage() {
  const router = useRouter();
  const [handled, setHandled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || handled) return;
    
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    
    // Check if we have auth tokens in hash fragment (Supabase redirect)
    if (hashParams.has('access_token')) {
      const jamId = localStorage.getItem('pendingAuthJamId');
      
      if (jamId) {
        setHandled(true);
        
        // Wait for Supabase to process the hash and establish session
        const checkSession = async (retries = 0) => {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            const adminStatus = await checkAdminStatus(session.user.id);
            const redirectPath = adminStatus 
              ? `/jams/${jamId}?edit=true`
              : `/jams/${jamId}`;
            localStorage.removeItem('pendingAuthJamId');
            router.replace(redirectPath);
          } else if (retries < 5) {
            setTimeout(() => checkSession(retries + 1), 300);
          } else {
            localStorage.removeItem('pendingAuthJamId');
            router.replace('/london/jazz-jams');
          }
        };
        
        checkSession();
        return;
      }
    }
    
    // Default redirect to London
    setHandled(true);
    router.replace('/london/jazz-jams');
  }, [router, handled]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
