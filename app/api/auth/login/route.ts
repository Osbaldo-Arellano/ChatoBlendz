import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const returnTo = '/admin'; // Redirect after login
  const loginUrl = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
  return NextResponse.redirect('/admin');
  
}
