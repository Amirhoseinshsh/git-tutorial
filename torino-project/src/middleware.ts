import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasSession =
    request.cookies.has('refreshToken') || request.cookies.has('accessToken');

  if (!hasSession) {
    const url = request.nextUrl.clone();
    const next = request.nextUrl.pathname;
    url.pathname = '/';
    url.search = `?login=1&next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/checkout'],
};
