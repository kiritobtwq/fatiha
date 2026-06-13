import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHmac } from 'crypto';

// YooKassa IP whitelist (from official docs)
const YOOKASSA_IPS = [
  '185.32.186.0/24',
  '185.32.187.0/24',
  '185.32.188.0/24',
  '185.32.189.0/24',
  '185.32.190.0/24',
  '185.32.191.0/24',
];

function isIPInWhitelist(ip: string): boolean {
  // Simple IP check - in production, use proper CIDR matching library
  const ipParts = ip.split('.').map(Number);
  for (const cidr of YOOKASSA_IPS) {
    const [base, mask] = cidr.split('/');
    const baseParts = base.split('.').map(Number);
    if (mask === '24') {
      if (ipParts[0] === baseParts[0] && ipParts[1] === baseParts[1] && ipParts[2] === baseParts[2]) {
        return true;
      }
    }
  }
  return false;
}

function verifyHMAC(payload: string, signature: string): boolean {
  const secret = process.env.YOOKASSA_SECRET_KEY;
  if (!secret) return false;
  
  const hmac = createHmac('sha256', secret).update(payload).digest('base64');
  return hmac === signature;
}

export async function POST(request: Request) {
  try {
    // Check IP whitelist
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!isIPInWhitelist(ip)) {
      console.error('Webhook from unauthorized IP:', ip);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get raw body for HMAC verification
    const rawBody = await request.text();
    const signature = request.headers.get('sha256-hash');
    
    if (!signature || !verifyHMAC(rawBody, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    
    // Log the webhook
    await prisma.webhookLog.create({
      data: {
        payload: payload,
      },
    });

    const { event, object } = payload;

    // Idempotency check - prevent duplicate processing
    const existingDonation = await prisma.donation.findUnique({
      where: { yookassaPaymentId: object.id },
    });

    if (!existingDonation) {
      console.error('Donation not found for payment:', object.id);
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    if (event === 'payment.succeeded') {
      if (existingDonation.status === 'succeeded') {
        // Already processed, return success
        return NextResponse.json({ status: 'ok' });
      }
      await prisma.donation.update({
        where: { yookassaPaymentId: object.id },
        data: { status: 'succeeded' },
      });
    } else if (event === 'payment.canceled') {
      if (existingDonation.status === 'canceled') {
        return NextResponse.json({ status: 'ok' });
      }
      await prisma.donation.update({
        where: { yookassaPaymentId: object.id },
        data: { status: 'canceled' },
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
