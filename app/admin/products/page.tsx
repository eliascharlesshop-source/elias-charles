'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProductGenerationService, CreateProductRequest } from '@/lib/product-generation-service'
import { getAllProducts } from '@/data/tiktok-products'

interface ProductFormData extends CreateProductRequest {
  // Additional form-specific fields
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [products, setProducts] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    productType: '',
    status: 'DRAFT',
    variants: [{
      id: '',
      title: 'Default',
      price: 0,
      inventory: 0
    }],
    tags: [],
    images: []
  })
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])
  const [tiktokProducts, setTiktokProducts] = useState<any[]>([])
  const [syncingTikTok, setSyncingTikTok] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string>('')

  useEffect(() => {
    // Check authentication on client side
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/dashboard')
        if (!response.ok) {
          router.push('/login')
          return
        }
        await fetchProducts()
        loadTikTokProducts()
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const loadTikTokProducts = () => {
    const products = getAllProducts()
    setTiktokProducts(products)
  }

  const handleSyncAllToTikTok = async () => {
    setSyncingTikTok(true)
    setSyncStatus('Syncing products to TikTok Shop...')
    
    try {
      const response = await fetch('/api/admin/tiktok/sync-all', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSyncStatus(`✓ Successfully synced ${data.synced} products to TikTok Shop`)
      } else {
        setSyncStatus(`✗ Sync failed: ${data.error}`)
      }
    } catch (error) {
      setSyncStatus(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSyncingTikTok(false)
    }
  }

  const handleSyncProductToTikTok = async (sku: string) => {
    try {
      const response = await fetch(`/api/admin/tiktok/sync?sku=${sku}`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSyncStatus(`✓ Product ${sku} synced to TikTok Shop`)
      } else {
        setSyncStatus(`✗ Failed to sync ${sku}`)
      }
    } catch (error) {
      setSyncStatus(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const validateProduct = async () => {
    try {
      const response = await fetch('/api/admin/products/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      if (data.success) {
        setValidationErrors([])
        setValidationWarnings(data.data.warnings || [])
        return true
      } else {
        setValidationErrors(data.data.errors || [])
        setValidationWarnings([])
        return false
      }
    } catch (error) {
      console.error('Validation failed:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate first
    const isValid = await validateProduct()
    if (!isValid) {
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          productType: '',
          status: 'DRAFT',
          variants: [{
            id: '',
            title: 'Default',
            price: 0,
            inventory: 0
          }],
          tags: [],
          images: []
        })
        setShowCreateForm(false)
        setValidationErrors([])
        setValidationWarnings([])
        await fetchProducts()
        
        // Show success message
        alert('Product created successfully!')
      } else {
        setValidationErrors(data.details ? [data.details] as string[] : [data.error])
      }
    } catch (error) {
      console.error('Failed to create product:', error)
      setValidationErrors(['Failed to create product. Please try again.'])
    } finally {
      setIsCreating(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleVariantChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }))
  }

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        id: '',
        title: `Variant ${prev.variants.length + 1}`,
        price: 0,
        inventory: 0
      }]
    }))
  }

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="mt-2 text-sm text-gray-600">Create and manage your products</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showCreateForm ? 'Cancel' : 'Add New Product'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TikTok Shop Integration Section */}
        <div className="bg-white rounded-lg shadow mb-8 p-6 border-l-4 border-black">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">TikTok Shop Integration</h2>
              <p className="text-sm text-gray-600 mt-1">Sync your product catalog with TikTok Shop Feed</p>
            </div>
            <button
              onClick={handleSyncAllToTikTok}
              disabled={syncingTikTok}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {syncingTikTok ? 'Syncing...' : 'Sync All to TikTok'}
            </button>
          </div>

          {syncStatus && (
            <div className={`p-3 rounded-md mb-4 text-sm ${
              syncStatus.includes('✓') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {syncStatus}
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Product Catalog ({tiktokProducts.length} products)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Collections</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tiktokProducts.slice(0, 10).map((product: any) => (
                    <tr key={product.sku} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs font-mono text-gray-700">{product.sku}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{product.category}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">${product.price}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{product.inventory}</td>
                      <td className="px-4 py-2 text-xs">
                        {product.collections.length > 0 ? (
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {product.collections.length} collections
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleSyncProductToTikTok(product.sku)}
                          className="text-blue-600 hover:text-blue-900 text-xs font-medium"
                        >
                          Sync
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tiktokProducts.length > 10 && (
              <p className="text-xs text-gray-500 mt-2">Showing 10 of {tiktokProducts.length} products</p>
            )}
          </div>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-xl font-semibold mb-6">Create New Product</h2>
            
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <h3 className="text-red-800 font-medium mb-2">Validation Errors:</h3>
                <ul className="text-red-700 text-sm list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationWarnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <h3 className="text-yellow-800 font-medium mb-2">Warnings:</h3>
                <ul className="text-yellow-700 text-sm list-disc list-inside">
                  {validationWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type *
                  </label>
                  <input
                    type="text"
                    value={formData.productType}
                    onChange={(e) => handleInputChange('productType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags?.join(', ')}
                    onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    Add Variant
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Variant Title
                          </label>
                          <input
                            type="text"
                            value={variant.title}
                            onChange={(e) => handleVariantChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Inventory *
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={variant.inventory}
                            onChange={(e) => handleVariantChange(index, 'inventory', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div className="flex items-end">
                          {formData.variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Existing Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product: any) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.productType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        product.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.variants?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
