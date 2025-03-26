import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userid = request.headers.get('userid');

  if (!userid) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  // Add the userid to the request headers for downstream usage
  const response = NextResponse.next();
  response.headers.set('userid', userid);
  return response;
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/api/expenses/:path*'], // Apply to all routes under /api/expenses
};