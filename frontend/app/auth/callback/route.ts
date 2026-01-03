import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTY4MDAsImV4cCI6MTk2MDc3MjgwMH0.placeholder';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get('token');
  const type = requestUrl.searchParams.get('type');
  const jamId = requestUrl.searchParams.get('jamId');

  // Only handle magic link callbacks
  if (type !== 'magiclink' || !token) {
    console.log('[Auth Callback] Missing token or wrong type, redirecting');
    // If no token/type, but we have jamId, redirect to jam page
    if (jamId) {
      return NextResponse.redirect(new URL(`/jams/${jamId}`, requestUrl.origin));
    }
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Exchange the token for a session to check admin status
    // For magic links, Supabase sends token_hash in the URL
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'magiclink',
    });

    if (error || !data.session) {
      console.error('Error verifying token:', error);
      // Redirect to jam page with error, or home if no jamId
      const redirectUrl = jamId
        ? new URL(`/jams/${jamId}?error=auth_failed`, requestUrl.origin)
        : new URL('/?error=auth_failed', requestUrl.origin);
      return NextResponse.redirect(redirectUrl);
    }

    // Check if user is admin
    const userId = data.session.user.id;
    const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin', {
      user_id: userId,
    });

    if (adminError) {
      console.error('Error checking admin status:', adminError);
    }

    const isAdmin = isAdminData === true;

    // Build redirect URL - preserve jamId and add edit param if admin
    let redirectPath = '/';
    if (jamId) {
      redirectPath = isAdmin ? `/jams/${jamId}?edit=true` : `/jams/${jamId}`;
    } else {
      console.warn('[Auth Callback] No jamId provided, redirecting to home');
    }

    const redirectUrl = new URL(redirectPath, requestUrl.origin);
    // Preserve token and type for client SDK to verify and establish session
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('type', type);
    // Preserve jamId in query params as backup (even though it's in the path)
    if (jamId) {
      redirectUrl.searchParams.set('jamId', jamId);
    }
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    const redirectUrl = jamId
      ? new URL(`/jams/${jamId}?error=auth_failed`, requestUrl.origin)
      : new URL('/?error=auth_failed', requestUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }
}

