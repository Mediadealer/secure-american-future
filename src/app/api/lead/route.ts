import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// Server-only credentials - never exposed to client
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const LIST_ID = process.env.LIST_ID;
const REDIRECT_URL = config.checkoutUrl || process.env.REDIRECT_URL;

interface LeadSubmission {
  fname: string;
  lname?: string;
  email: string;
  tid?: string;
  sub2?: string; // Publisher ID from affiliate network
  sub3?: string; // Additional tracking param from affiliate network
  mcid?: string; // ClickMagick ID for conversion tracking
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!API_URL || !API_KEY || !LIST_ID || !REDIRECT_URL) {
      console.error('Missing environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body: LeadSubmission = await request.json();

    // Validation
    if (!body.fname || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Build API request parameters
    const params = new URLSearchParams();
    params.append('apikey', API_KEY);
    params.append('list_id', LIST_ID);
    params.append('fname', body.fname);
    if (body.lname) {
      params.append('lname', body.lname);
    }
    params.append('email', body.email);
    params.append('ip', request.headers.get('x-forwarded-for') || 'unknown');
    params.append('date_subscribed', new Date().toISOString());
    params.append('offer', REDIRECT_URL);

    // Submit to lead API
    const apiUrl = `${API_URL}?${params.toString()}`;

    try {
      await fetch(apiUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
    } catch (fetchError) {
      // Log but don't fail - redirect anyway
      console.error('Lead API error:', fetchError);
    }

    // Build redirect URL with tracking parameters
    const redirectUrl = new URL(REDIRECT_URL);

    // Add tid (original tracking ID) as sub1
    if (body.tid) {
      redirectUrl.searchParams.set('sub1', body.tid);
    }

    // Pass through sub2 (publisher ID) and sub3
    if (body.sub2) {
      redirectUrl.searchParams.set('sub2', body.sub2);
    }
    if (body.sub3) {
      redirectUrl.searchParams.set('sub3', body.sub3);
    }

    // Add ClickMagick ID as sub5 for conversion postback
    if (body.mcid) {
      redirectUrl.searchParams.set('sub5', body.mcid);
    }

    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrl.toString(),
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
