// Email notification service
// In production, integrate with SendGrid, Mailgun, or similar service

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface EmailRecipient {
  email: string
  name?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export class EmailService {
  // Mock email sending
  static async sendEmail(
    to: EmailRecipient,
    template: EmailTemplate,
    variables: Record<string, any> = {}
  ): Promise<EmailResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Replace variables in template
    let { subject, html, text } = template
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value))
      html = html.replace(new RegExp(placeholder, 'g'), String(value))
      text = text.replace(new RegExp(placeholder, 'g'), String(value))
    })

    // Mock email validation
    if (!to.email || !to.email.includes('@')) {
      return {
        success: false,
        error: 'Invalid email address'
      }
    }

    // Log email for development
    console.log('📧 Email sent:', {
      to: to.email,
      subject,
      timestamp: new Date().toISOString()
    })

    // Mock success
    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  // Order confirmation email
  static async sendOrderConfirmation(
    customerEmail: string,
    customerName: string,
    order: any
  ): Promise<EmailResult> {
    const template: EmailTemplate = {
      subject: 'Order Confirmation - EC Store #{{orderNumber}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Order Confirmation</h1>
          <p>Hi {{customerName}},</p>
          <p>Thank you for your order! We've received your order and are processing it now.</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> {{orderNumber}}</p>
            <p><strong>Order Date:</strong> {{orderDate}}</p>
            <p><strong>Total:</strong> $\{{total}}</p>
          </div>

          <h3>Items Ordered:</h3>
          <div style="border: 1px solid #ddd; padding: 15px;">
            {{itemsList}}
          </div>

          <div style="margin-top: 30px;">
            <h3>Shipping Address:</h3>
            <p>
              {{shippingName}}<br>
              {{shippingAddress1}}<br>
              {{shippingAddress2}}
              {{shippingCity}}, {{shippingState}} {{shippingZip}}<br>
              {{shippingCountry}}
            </p>
          </div>

          <p style="margin-top: 30px;">
            We'll send you another email when your order ships. If you have any questions, 
            please contact us at support@eliascharles.com.
          </p>

          <p>Thanks for shopping with EC!</p>
        </div>
      `,
      text: `
Order Confirmation - EC Store #{{orderNumber}}

Hi {{customerName}},

Thank you for your order! We've received your order and are processing it now.

Order Details:
- Order Number: {{orderNumber}}
- Order Date: {{orderDate}}
- Total: $\{{total}}

Items Ordered:
{{itemsListText}}

Shipping Address:
{{shippingName}}
{{shippingAddress1}}
{{shippingAddress2}}
{{shippingCity}}, {{shippingState}} {{shippingZip}}
{{shippingCountry}}

We'll send you another email when your order ships. If you have any questions, 
please contact us at support@eliascharles.com.

Thanks for shopping with EC!
      `
    }

    // Format items list
    const itemsList = order.items.map((item: any) => 
      `<div style="margin-bottom: 10px;">
        <strong>${item.title}</strong> - Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
      </div>`
    ).join('')

    const itemsListText = order.items.map((item: any) => 
      `- ${item.title} - Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')

    const variables = {
      customerName,
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      total: order.total.toFixed(2),
      itemsList,
      itemsListText,
      shippingName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      shippingAddress1: order.shippingAddress.address1,
      shippingAddress2: order.shippingAddress.address2 ? `${order.shippingAddress.address2}<br>` : '',
      shippingCity: order.shippingAddress.city,
      shippingState: order.shippingAddress.state,
      shippingZip: order.shippingAddress.zipCode,
      shippingCountry: order.shippingAddress.country
    }

    return this.sendEmail(
      { email: customerEmail, name: customerName },
      template,
      variables
    )
  }

  // Order shipped notification
  static async sendShippingNotification(
    customerEmail: string,
    customerName: string,
    order: any,
    trackingNumber?: string
  ): Promise<EmailResult> {
    const template: EmailTemplate = {
      subject: 'Your Order Has Shipped - EC Store #{{orderNumber}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Your Order Has Shipped!</h1>
          <p>Hi {{customerName}},</p>
          <p>Great news! Your order has been shipped and is on its way to you.</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h2>Shipping Details</h2>
            <p><strong>Order Number:</strong> {{orderNumber}}</p>
            <p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
            <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
          </div>

          <p>You can track your package using the tracking number above.</p>
          
          <p style="margin-top: 30px;">
            If you have any questions about your order, please contact us at support@eliascharles.com.
          </p>

          <p>Thanks for shopping with EC!</p>
        </div>
      `,
      text: `
Your Order Has Shipped - EC Store #{{orderNumber}}

Hi {{customerName}},

Great news! Your order has been shipped and is on its way to you.

Shipping Details:
- Order Number: {{orderNumber}}
- Tracking Number: {{trackingNumber}}
- Estimated Delivery: 3-5 business days

You can track your package using the tracking number above.

If you have any questions about your order, please contact us at support@eliascharles.com.

Thanks for shopping with EC!
      `
    }

    const variables = {
      customerName,
      orderNumber: order.orderNumber,
      trackingNumber: trackingNumber || 'Not available'
    }

    return this.sendEmail(
      { email: customerEmail, name: customerName },
      template,
      variables
    )
  }

  // Welcome email for new users
  static async sendWelcomeEmail(
    userEmail: string,
    userName: string
  ): Promise<EmailResult> {
    const template: EmailTemplate = {
      subject: 'Welcome to EC Store!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to EC Store!</h1>
          <p>Hi {{userName}},</p>
          <p>Welcome to the EC family! We're excited to have you join our community of surf and skate enthusiasts.</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
            <h2>What's Next?</h2>
            <ul>
              <li>Browse our latest collections</li>
              <li>Follow us on social media for updates</li>
              <li>Sign up for our newsletter for exclusive deals</li>
            </ul>
          </div>

          <p>If you have any questions, feel free to reach out to us at support@eliascharles.com.</p>

          <p>Welcome aboard!</p>
          <p>The EC Team</p>
        </div>
      `,
      text: `
Welcome to EC Store!

Hi {{userName}},

Welcome to the EC family! We're excited to have you join our community of surf and skate enthusiasts.

What's Next?
- Browse our latest collections
- Follow us on social media for updates
- Sign up for our newsletter for exclusive deals

If you have any questions, feel free to reach out to us at support@eliascharles.com.

Welcome aboard!
The EC Team
      `
    }

    const variables = {
      userName
    }

    return this.sendEmail(
      { email: userEmail, name: userName },
      template,
      variables
    )
  }

  // Password reset email
  static async sendPasswordResetEmail(
    userEmail: string,
    userName: string,
    resetToken: string
  ): Promise<EmailResult> {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    const template: EmailTemplate = {
      subject: 'Reset Your Password - EC Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reset Your Password</h1>
          <p>Hi {{userName}},</p>
          <p>We received a request to reset your password for your EC Store account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{resetUrl}}" style="background: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Reset Password
            </a>
          </div>

          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour for security reasons.</p>

          <p>If you have any questions, contact us at support@eliascharles.com.</p>
        </div>
      `,
      text: `
Reset Your Password - EC Store

Hi {{userName}},

We received a request to reset your password for your EC Store account.

Click the link below to reset your password:
{{resetUrl}}

If you didn't request this password reset, you can safely ignore this email.
This link will expire in 1 hour for security reasons.

If you have any questions, contact us at support@eliascharles.com.
      `
    }

    const variables = {
      userName,
      resetUrl
    }

    return this.sendEmail(
      { email: userEmail, name: userName },
      template,
      variables
    )
  }
}