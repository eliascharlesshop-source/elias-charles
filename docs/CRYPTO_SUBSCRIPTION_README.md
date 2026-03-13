# IE Crypto Subscription System

A comprehensive cryptocurrency subscription platform built with Next.js, TypeScript, and Web3 technologies. This system replaces traditional fiat payment methods with blockchain-based transactions, supporting multiple wallets and networks.

## 🚀 Features

### Wallet Integration
- **MetaMask** - Ethereum, Polygon, Arbitrum support
- **Phantom** - Solana support  
- **Solflare** - Solana support
- Auto-detection of installed wallets
- Secure wallet connection and authentication

### Cryptocurrency Support
- **Ethereum (ETH)** - Mainnet, Polygon, Arbitrum
- **Solana (SOL)** - Mainnet-beta
- **Stablecoins** - USDC, USDT on all supported networks
- **MATIC** - Polygon native token

### Subscription Management
- Tier-based subscription plans (Starter, Street, Complete)
- Monthly and quarterly billing cycles
- Real-time subscription status tracking
- Automatic renewal with blockchain confirmations
- Subscription pause, upgrade, downgrade, and cancellation

### Payment Processing
- Gas estimation and optimization
- Transaction confirmation monitoring
- Automatic retry mechanisms with exponential backoff
- Multi-network transaction routing
- Real-time payment status updates

### Security & Compliance
- Wallet signature-based authentication
- Rate limiting and DDoS protection
- Input validation and sanitization
- Audit logging for all transactions
- Suspicious activity detection
- Webhook signature verification

### Admin Dashboard
- Real-time subscription metrics
- Transaction monitoring and analytics
- Network usage statistics
- Wallet distribution analytics
- Revenue tracking with USD conversions
- Export functionality for compliance

## 🏗️ Architecture

### Frontend Components
```
src/components/crypto/
├── wallet-connector.tsx          # Wallet connection UI
├── crypto-subscription-plans.tsx # Subscription plans display
├── crypto-payment-flow.tsx        # Payment processing UI
└── crypto-admin-dashboard.tsx     # Admin monitoring panel
```

### Services
```
lib/crypto/
├── wallet-service.ts              # Wallet connection management
├── payment-service.ts            # Transaction processing
├── subscription-service.ts       # Subscription lifecycle
├── wallet-auth-service.ts        # Authentication
└── security-service.ts         # Security & audit logging
```

### API Routes
```
app/api/crypto/
├── auth/route.ts               # Wallet authentication
├── subscriptions/route.ts       # Subscription management
├── payments/route.ts           # Payment processing
└── webhooks/route.ts          # External integrations
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask, Phantom, or Solflare wallet installed

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd elias-charles

# Install dependencies
npm install

# Environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables
```env
# Network RPC URLs
NEXT_PUBLIC_ETHEREUM_RPC=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_POLYGON_RPC=https://polygon-rpc.com
NEXT_PUBLIC_ARBITRUM_RPC=https://arb1.arbitrum.io/rpc
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com

# Contract Addresses
NEXT_PUBLIC_ETH_SUBSCRIPTION_CONTRACT=0x...
NEXT_PUBLIC_POLYGON_SUBSCRIPTION_CONTRACT=0x...
NEXT_PUBLIC_ARBITRUM_SUBSCRIPTION_CONTRACT=0x...
NEXT_PUBLIC_SOLANA_SUBSCRIPTION_PROGRAM=...

# Security
WEBHOOK_SECRET=your-secure-webhook-secret
JWT_SECRET=your-jwt-secret
```

## 📱 Usage

### Connecting a Wallet
1. Visit the subscription page
2. Click "Connect Wallet"
3. Select your wallet provider
4. Choose your preferred network
5. Approve the connection request

### Subscribing to a Plan
1. Select a subscription tier
2. Choose your payment currency (ETH, SOL, USDC, etc.)
3. Select the network
4. Click "Subscribe Now"
5. Confirm the transaction in your wallet
6. Wait for blockchain confirmation
7. Subscription activated!

### Managing Subscriptions
- View active subscriptions in your dashboard
- Pause, upgrade, or cancel subscriptions
- View transaction history
- Manage auto-renewal settings

## 🔧 Configuration

### Subscription Plans
Edit `lib/crypto-config.ts` to customize:
- Plan pricing and features
- Supported networks and currencies
- Gas configuration
- Retry mechanisms

### Security Settings
Configure in `lib/crypto/security-service.ts`:
- Rate limiting thresholds
- Input validation patterns
- Audit log retention
- Alert triggers

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test wallet-service.test.ts

# Run with coverage
npm run test:coverage
```

### Integration Tests
```bash
# Test wallet connections
npm run test:wallets

# Test payment flows
npm run test:payments

# Test webhooks
npm run test:webhooks
```

## 📊 Monitoring

### Metrics Tracked
- Total subscriptions and active users
- Revenue by currency and network
- Transaction success rates
- Gas usage and costs
- Wallet distribution
- Security events and alerts

### Logs
- All wallet connections and disconnections
- Subscription lifecycle events
- Payment processing attempts
- Security violations and suspicious activities
- API access and errors

## 🔒 Security Considerations

### Wallet Security
- Never store private keys
- Use secure signature verification
- Implement session management
- Rate limit authentication attempts

### Transaction Security
- Validate all transaction parameters
- Implement proper gas estimation
- Monitor for suspicious patterns
- Use secure contract interactions

### Data Protection
- Encrypt sensitive data at rest
- Sanitize all user inputs
- Implement proper audit trails
- Follow GDPR compliance guidelines

## 🚀 Deployment

### Production Setup
1. Configure production environment variables
2. Set up monitoring and alerting
3. Configure webhook endpoints
4. Enable security headers and CSP
5. Set up database backups
6. Test all wallet connections
7. Verify contract deployments

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker Deployment
```bash
# Build image
docker build -t ie-crypto-subscriptions .

# Run container
docker run -p 3000:3000 ie-crypto-subscriptions
```

## 🤝 Integrations

### Webhooks
Configure external services to receive:
- Payment confirmations
- Subscription activations
- Cancellation events
- Security alerts

### Third-party Services
- **Coingecko API** - Price feeds
- **Infura/Alchemy** - RPC endpoints
- **Block explorers** - Transaction verification
- **Logging services** - Audit trails

## 🐛 Troubleshooting

### Common Issues

**Wallet not detected**
- Ensure wallet extension is installed and enabled
- Check browser compatibility
- Try refreshing the page

**Transaction failed**
- Check wallet balance
- Verify network settings
- Check gas fees
- Review transaction details

**Subscription not activating**
- Wait for blockchain confirmation
- Check transaction status on block explorer
- Verify contract addresses
- Contact support if issue persists

### Debug Mode
Enable debug logging:
```env
DEBUG=ie-crypto:*
LOG_LEVEL=debug
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/crypto/auth` - Authenticate wallet
- `GET /api/crypto/auth?sessionId=xxx` - Validate session
- `DELETE /api/crypto/auth?sessionId=xxx` - Invalidate session

### Subscription Endpoints
- `POST /api/crypto/subscriptions` - Create subscription
- `GET /api/crypto/subscriptions?sessionId=xxx` - Get user subscriptions
- `GET /api/crypto/subscriptions/all` - Get all subscriptions (admin)

### Payment Endpoints
- `POST /api/crypto/payments` - Process payment
- `GET /api/crypto/payments?hash=xxx&network=xxx` - Get transaction status

### Webhook Endpoints
- `POST /api/webhooks/crypto` - Receive external notifications
- `GET /api/webhooks/crypto` - Webhook status and logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and support:
- Create an issue on GitHub
- Contact the development team
- Check the documentation
- Review the FAQ section

---

**Built with ❤️ for the Web3 community**
