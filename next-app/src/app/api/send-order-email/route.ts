import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter (persists per serverless container)
const rateLimit = new Map<string, { count: number, resetTime: number }>();
const MAX_REQUESTS = 5; // 5 requests
const WINDOW_MS = 60 * 1000; // per minute

export async function POST(request: Request) {
  try {
    // 1. IP-based Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const limit = rateLimit.get(ip);
    
    if (limit && now < limit.resetTime) {
      if (limit.count >= MAX_REQUESTS) {
        return NextResponse.json({ success: false, error: 'Too many requests. Please wait a minute.' }, { status: 429 });
      }
      limit.count++;
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    }

    const orderData = await request.json();
    
    // Extract variables from the request
    const { 
      transactionID, 
      game, 
      productName, 
      price, 
      playerData, 
      paymentMethod, 
      username,
      coinsEarned 
    } = orderData;

    // Destructure playerData for specific fields (depends on the game)
    const playerID = playerData?.id || '—';
    const zoneID = playerData?.zone || '—';
    const ign = playerData?.ign || '—';

    // Format the email body
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #4F46E5;">🛒 New Order: ${transactionID} — ${game}</h2>
        <p>A new order has been received on Mark's Game Shop!</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Transaction ID</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${transactionID}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Date</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleString('en-PH', {timeZone:'Asia/Manila'})}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Game</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${game}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Product</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${productName}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Player ID</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${playerID}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Zone ID</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${zoneID}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">IGN</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${ign}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Payment Method</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${paymentMethod}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Amount Paid</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${price}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Username</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${username || 'guest'}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Coins Earned</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${coinsEarned || 0}</td>
          </tr>
        </table>
        
        <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
          Reply to this email or message the customer on Facebook to process the order.
        </p>
      </div>
    `;

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Mark Shop Orders <onboarding@resend.dev>', // Replace with verified domain later if available
      to: ['marcangelguevarra@gmail.com'],
      subject: `🛒 New Order: ${transactionID} — ${game}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
