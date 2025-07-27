// Mock payment processing service
// In production, integrate with Stripe, PayPal, or other payment processors

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'stripe'
  token: string
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  amount?: number
  currency?: string
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
}

export interface RefundResult {
  success: boolean
  refundId?: string
  error?: string
  amount?: number
  status?: 'pending' | 'completed' | 'failed'
}

export class PaymentService {
  // Mock payment processing
  static async processPayment(
    amount: number,
    currency: string = 'USD',
    paymentMethod: PaymentMethod,
    orderId: string
  ): Promise<PaymentResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock validation
    if (amount <= 0) {
      return {
        success: false,
        error: 'Invalid amount'
      }
    }

    if (!paymentMethod.token) {
      return {
        success: false,
        error: 'Invalid payment method'
      }
    }

    // Simulate different payment outcomes based on token
    if (paymentMethod.token === 'test_fail') {
      return {
        success: false,
        error: 'Payment declined',
        status: 'failed'
      }
    }

    if (paymentMethod.token === 'test_pending') {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_pending`,
        amount,
        currency,
        status: 'pending'
      }
    }

    // Default success case
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${orderId}`,
      amount,
      currency,
      status: 'completed'
    }
  }

  // Mock refund processing
  static async processRefund(
    transactionId: string,
    amount: number,
    reason?: string
  ): Promise<RefundResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!transactionId) {
      return {
        success: false,
        error: 'Invalid transaction ID'
      }
    }

    if (amount <= 0) {
      return {
        success: false,
        error: 'Invalid refund amount'
      }
    }

    // Mock refund success
    return {
      success: true,
      refundId: `ref_${Date.now()}_${transactionId}`,
      amount,
      status: 'completed'
    }
  }

  // Validate payment method token (mock)
  static async validatePaymentMethod(paymentMethod: PaymentMethod): Promise<boolean> {
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 200))

    // Basic validation
    if (!paymentMethod.token || paymentMethod.token.length < 10) {
      return false
    }

    // Mock invalid tokens
    const invalidTokens = ['invalid', 'expired', 'blocked']
    if (invalidTokens.includes(paymentMethod.token)) {
      return false
    }

    return true
  }

  // Calculate processing fee (mock)
  static calculateProcessingFee(amount: number, paymentType: string): number {
    const feeRates = {
      card: 0.029, // 2.9%
      paypal: 0.034, // 3.4%
      stripe: 0.029 // 2.9%
    }

    const rate = feeRates[paymentType as keyof typeof feeRates] || 0.029
    const fee = amount * rate + 0.30 // Base fee + percentage
    return Math.round(fee * 100) / 100 // Round to 2 decimal places
  }

  // Get supported payment methods
  static getSupportedPaymentMethods(): string[] {
    return ['card', 'paypal', 'stripe']
  }

  // Mock webhook verification
  static verifyWebhook(payload: string, signature: string, secret: string): boolean {
    // In production, implement proper webhook signature verification
    return signature === `mock_signature_${secret}`
  }
}

// Test payment tokens for development
export const TEST_PAYMENT_TOKENS = {
  SUCCESS: 'test_success_4242424242424242',
  FAIL: 'test_fail',
  PENDING: 'test_pending',
  INVALID: 'invalid'
}