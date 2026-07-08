import { NextRequest, NextResponse } from 'next/server'
import { crypto } from 'crypto'
import { WebhookPayload, AuditLog } from '@/types/crypto-subscription'
import { SubscriptionService } from '@/lib/crypto/subscription-service'
import { PaymentService } from '@/lib/crypto/payment-service'
export const dynamic = 'force-dynamic'

const subscriptionService = SubscriptionService.getInstance()
const paymentService = PaymentService.getInstance()

// Webhook secret for signature verification
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret'

export async function POST(request: NextRequest) {
  try {
    // Get signature from header
    const signature = request.headers.get('x-webhook-signature')
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      )
    }

    // Get raw body for signature verification
    const body = await request.text()
    
    // Verify signature
    const isValidSignature = verifyWebhookSignature(body, signature)
    if (!isValidSignature) {
      await logWebhookEvent('webhook_verification_failed', {
        signature: signature.substring(0, 20) + '...',
        bodyLength: body.length,
        timestamp: new Date()
      }, 'high')
      
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    // Parse webhook payload
    const payload: WebhookPayload = JSON.parse(body)
    
    // Log webhook receipt
    await logWebhookEvent('webhook_received', {
      event: payload.event,
      subscriptionId: payload.data.subscriptionId,
      timestamp: new Date()
    }, 'low')

    // Process webhook based on event type
    const result = await processWebhookEvent(payload)

    // Log webhook processing result
    await logWebhookEvent('webhook_processed', {
      event: payload.event,
      subscriptionId: payload.data.subscriptionId,
      success: result.success,
      timestamp: new Date()
    }, 'low')

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    
    await logWebhookEvent('webhook_error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date()
    }, 'high')

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const subscriptionId = searchParams.get('subscriptionId')

    // This endpoint would be used to retrieve webhook logs for debugging
    // In a real implementation, this would query a database
    
    return NextResponse.json({
      success: true,
      message: 'Webhook endpoint is active',
      timestamp: new Date()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get webhook status' },
      { status: 500 }
    )
  }
}

function verifyWebhookSignature(body: string, signature: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
    const expectedSignature = hmac.update(body).digest('hex')
    
    // Compare signatures securely
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

async function processWebhookEvent(payload: WebhookPayload): Promise<{ success: boolean; message: string }> {
  switch (payload.event) {
    case 'payment.confirmed':
      return await handlePaymentConfirmed(payload)
    
    case 'payment.failed':
      return await handlePaymentFailed(payload)
    
    case 'subscription.created':
      return await handleSubscriptionCreated(payload)
    
    case 'subscription.activated':
      return await handleSubscriptionActivated(payload)
    
    case 'subscription.cancelled':
      return await handleSubscriptionCancelled(payload)
    
    case 'subscription.expired':
      return await handleSubscriptionExpired(payload)
    
    case 'subscription.renewed':
      return await handleSubscriptionRenewed(payload)
    
    default:
      return { success: false, message: `Unknown event type: ${payload.event}` }
  }
}

async function handlePaymentConfirmed(payload: WebhookPayload): Promise<{ success: boolean; message: string }> {
  try {
    const { subscriptionId, transactionId, walletAddress, amount, currency, status } = payload.data

    // Get subscription
    const subscription = await subscriptionService.getSubscription(subscriptionId)
    if (!subscription) {
      return { success: false, message: 'Subscription not found' }
    }

    // Update transaction status
    const transaction = subscription.transactions.find(t => t.id === transactionId)
    if (transaction) {
      transaction.status = status as any
      
      // Activate subscription if payment is confirmed
      if (status === 'confirmed') {
        await subscriptionService.activateSubscription(subscriptionId, transaction.transactionHash)
      }
    }

    return { success: true, message: 'Payment confirmation processed' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

async function handlePaymentFailed(payload: WebhookPayload): Promise<{ success: boolean; message: string }> {
  try {
    const { subscriptionId, transactionId, walletAddress, amount, currency, status } = payload.data

    const subscription = await subscriptionService.getSubscription(subscriptionId)
    if (!subscription) {
      return { success: false, message: 'Subscription not found' }
    }

    // Update transaction status
    const transaction = subscription.transactions.find(t => t.id === transactionId)
    if (transaction) {
      transaction.status = 'expired'
    }

    // Mark subscription as expired if all payments failed
    const allTransactionsFailed = subscription.transactions.every(t => t.status === 'expired')
    if (allTransactionsFailed) {
      subscription.status = 'expired'
    }

    return { success: true, message: 'Payment failure processed' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

async function handleSubscriptionCreated(payload: WebhookPayload): Promise<{ success: boolean; message: string }> {
  try {
    const { subscriptionId, walletAddress } = payload.data
    
    // Log subscription creation
    await logWebhookEvent('subscription_created_log', {
      subscriptionId,
      walletAddress,
      timestamp: new Date()
    }, 'medium')

    return { success: true, message: 'Subscription creation logged' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

async function handleSubscriptionActivated(payload: WebhookPayload): Promise<{ success: boolean; message: string }> {
  try {
    const { subscriptionId, walletAddress } = payload.data
    
    // Send activation notification (in real implementation, would send email/push)
    await logWebhookEvent('subscription_activated', {
      subscriptionId,
      walletAddress,
      timestamp: new Date()
    }, 'medium')

    return { success: true, message: 'Subscription activation processed' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

async function handleSubscriptionCancelled(payload: WebhookPayload): Promise<{ success: boolean; message: string }> {
  try {
    const { subscriptionId, walletAddress } = payload.data
    
    // Log cancellation
    await logWebhookEvent('subscription_cancelled', {
      subscriptionId,
      walletAddress,
      timestamp: new Date()
    }, 'medium')

    return { success: true, message: 'Subscription cancellation processed' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

async function handleSubscriptionExpired(payload: WebhookPayload): Promise<{ success: boolean; message: string }> {
  try {
    const { subscriptionId, walletAddress } = payload.data
    
    // Log expiration
    await logWebhookEvent('subscription_expired', {
      subscriptionId,
      walletAddress,
      timestamp: new Date()
    }, 'medium')

    return { success: true, message: 'Subscription expiration processed' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

async function handleSubscriptionRenewed(payload: WebhookPayload): Promise<{ success: boolean; message: string }> {
  try {
    const { subscriptionId, walletAddress } = payload.data
    
    // Process renewal
    await subscriptionService.renewSubscription(subscriptionId)
    
    await logWebhookEvent('subscription_renewed', {
      subscriptionId,
      walletAddress,
      timestamp: new Date()
    }, 'medium')

    return { success: true, message: 'Subscription renewal processed' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

async function logWebhookEvent(action: string, details: Record<string, any>, severity: 'low' | 'medium' | 'high' | 'critical'): Promise<void> {
  // In a real implementation, this would save to a database or logging service
  const auditLog: AuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    resource: 'webhook',
    details,
    ipAddress: '0.0.0.0', // Would get from request
    userAgent: 'webhook-system',
    timestamp: new Date(),
    severity
  }

  console.log('Audit Log:', auditLog)
  
  // In production, you would:
  // 1. Save to database with proper indexing
  // 2. Send to logging service (e.g., ELK stack, Datadog)
  // 3. Set up alerts for high-severity events
  // 4. Implement log retention policies
}
