import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET() {
  const baseUrl = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID!;
  const returnTo = encodeURIComponent('https://chato-blendz.vercel.app'); //https://chato-blendz.vercel.app

  // Construct the Auth0 logout URL
  const logoutUrl = `${baseUrl}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;

  // Manually clear your application’s session cookie
  const response = NextResponse.redirect(logoutUrl);
  response.headers.append(
    'Set-Cookie',
    serialize('__session', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      sameSite: 'lax',
    }),
  );

  return response;
}
