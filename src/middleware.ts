import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isValidLocale, getPreferredLocale } from './utils/locale'

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    
    // Handle API routes with CORS
    if (pathname.startsWith('/api')) {
        console.log('API request:', pathname);

        // Handle preflight requests
        if (request.method === 'OPTIONS') {
            const response = new NextResponse(null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
                    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
                    'Access-Control-Allow-Headers': request.headers.get('access-control-request-headers') || '*',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Max-Age': '86400',
                },
            });
            return response;
        }

        // Set CORS headers for actual API requests
        const response = NextResponse.next();
        response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', '*');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        
        return response;
    }

    // Handle language routing for non-API routes
    const segments = pathname.split('/');
    const potentialLocale = segments[1];
    const hasLocale = potentialLocale && isValidLocale(potentialLocale);

    // Don't redirect static files and Next.js internals
    if (pathname.includes('.') || pathname.startsWith('/_next')) {
        return NextResponse.next();
    }

    // Redirect if pathname doesn't have a valid locale
    if (!hasLocale) {
        const acceptLanguage = request.headers.get('Accept-Language') || undefined;
        const locale = getPreferredLocale(acceptLanguage);
        
        console.log(`Redirecting to /${locale}${pathname}`);
        return NextResponse.redirect(
            new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - api, _next/static, _next/image, favicon.ico
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
