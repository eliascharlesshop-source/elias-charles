/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    dataCache: 'force-disable',
  },
  serverExternalPackages: [
    'shopify-buy',
    'bcryptjs',
    'jsonwebtoken',
    '@stellar/stellar-sdk',
    'secp256k1',
    'ethers',
  ],
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
}

export default nextConfig
