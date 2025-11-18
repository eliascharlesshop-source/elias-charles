export async function GET() {
  return Response.json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    features: [
      'Store Theme ✅',
      'Admin Dashboard ✅',
      'Wearable Integration ✅',
      'Environmental Sampling ✅',
      'Data Sharing ✅',
      'Personal Catalog ✅'
    ]
  })
}
