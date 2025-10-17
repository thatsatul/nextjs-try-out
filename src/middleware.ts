import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Log the incoming request details
    console.log('--------------------------------');
    console.log('Incoming request:');
    console.log('URL:', request.url);
    console.log('Method:', request.method);
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    console.log('Origin:', request.headers.get('origin'));
    console.log('--------------------------------');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request');
        const response = new NextResponse(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
                'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': request.headers.get('access-control-request-headers') || '*',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Max-Age': '86400',
                'Content-Length': '0',
                'Vary': 'Origin, Access-Control-Request-Headers'
            },
        });
        console.log('OPTIONS response headers:', Object.fromEntries(response.headers.entries()));
        return response;
    }

    // Handle actual requests
    const response = NextResponse.next();
    
    // Set CORS headers for actual request
    const origin = request.headers.get('origin') || '*';
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Vary', 'Origin');
    
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    return response
}

export const config = {
    matcher: '/api/:path*',
}
