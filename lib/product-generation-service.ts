import getShopifyService from '@/lib/shopify-service'
import { AuthService, JWTPayload } from '@/src/lib/auth'
import { ApiResponse } from '@/src/lib/types'

export interface ProductVariant {
  id: string
  title: string
  price: number
  sku?: string
  inventory: number
  weight?: number
  image?: string
  options?: Record<string, string>
}

export interface ProductImage {
  url: string
  altText?: string
  position?: number
}

export interface ProductOption {
  name: string
  values: string[]
  position: number
}

export interface CreateProductRequest {
  title: string
  description: string
  handle?: string
  productType: string
  vendor?: string
  tags?: string[]
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  images?: ProductImage[]
  options?: ProductOption[]
  variants: ProductVariant[]
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  metadata?: Record<string, any>
}

export interface ProductValidationRule {
  field: string
  required: boolean
  type: 'string' | 'number' | 'array' | 'object'
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ProductValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export class ProductGenerationService {
  private shopifyService: any
  private validationRules: ProductValidationRule[]

  constructor() {
    this.shopifyService = getShopifyService()
    this.initializeValidationRules()
  }

  private initializeValidationRules() {
    this.validationRules = [
      {
        field: 'title',
        required: true,
        type: 'string',
        minLength: 3,
        maxLength: 200,
        pattern: /^[a-zA-Z0-9\s\-_&()]+$/,
        custom: (value: string) => {
          if (value.toLowerCase().includes('test')) {
            return 'Product title should not contain "test"'
          }
          return null
        }
      },
      {
        field: 'description',
        required: true,
        type: 'string',
        minLength: 10,
        maxLength: 5000
      },
      {
        field: 'productType',
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 50
      },
      {
        field: 'variants',
        required: true,
        type: 'array',
        min: 1,
        max: 100,
        custom: (variants: ProductVariant[]) => {
          const duplicateSkus = variants
            .filter(v => v.sku)
            .map(v => v.sku!)
            .filter((sku, index, arr) => arr.indexOf(sku) !== index)
          
          if (duplicateSkus.length > 0) {
            return `Duplicate SKUs found: ${duplicateSkus.join(', ')}`
          }
          return null
        }
      },
      {
        field: 'variants.*.price',
        required: true,
        type: 'number',
        min: 0.01,
        max: 100000
      },
      {
        field: 'variants.*.inventory',
        required: true,
        type: 'number',
        min: 0,
        max: 1000000
      },
      {
        field: 'tags',
        required: false,
        type: 'array',
        max: 10,
        custom: (tags: string[]) => {
          const invalidTags = tags.filter(tag => 
            tag.length > 50 || /[^a-zA-Z0-9\-_\s]/.test(tag)
          )
          if (invalidTags.length > 0) {
            return `Invalid tags: ${invalidTags.join(', ')}`
          }
          return null
        }
      }
    ]
  }

  async validateProduct(productData: CreateProductRequest): Promise<ProductValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    for (const rule of this.validationRules) {
      const value = this.getNestedValue(productData, rule.field)
      
      // Check if required field is missing
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`)
        continue
      }

      // Skip validation if field is not provided and not required
      if (value === undefined || value === null) {
        continue
      }

      // Type validation
      if (!this.validateType(value, rule.type)) {
        errors.push(`${rule.field} must be of type ${rule.type}`)
        continue
      }

      // String validations
      if (rule.type === 'string') {
        const str = value as string
        if (rule.minLength && str.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters`)
        }
        if (rule.maxLength && str.length > rule.maxLength) {
          errors.push(`${rule.field} must not exceed ${rule.maxLength} characters`)
        }
        if (rule.pattern && !rule.pattern.test(str)) {
          errors.push(`${rule.field} contains invalid characters`)
        }
      }

      // Number validations
      if (rule.type === 'number') {
        const num = value as number
        if (rule.min !== undefined && num < rule.min) {
          errors.push(`${rule.field} must be at least ${rule.min}`)
        }
        if (rule.max !== undefined && num > rule.max) {
          errors.push(`${rule.field} must not exceed ${rule.max}`)
        }
      }

      // Array validations
      if (rule.type === 'array') {
        const arr = value as any[]
        if (rule.min !== undefined && arr.length < rule.min) {
          errors.push(`${rule.field} must have at least ${rule.min} items`)
        }
        if (rule.max !== undefined && arr.length > rule.max) {
          errors.push(`${rule.field} must not exceed ${rule.max} items`)
        }
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(value)
        if (customError) {
          errors.push(customError)
        }
      }
    }

    // Business logic validations
    await this.performBusinessValidations(productData, errors, warnings)

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  private async performBusinessValidations(
    productData: CreateProductRequest, 
    errors: string[], 
    warnings: string[]
  ) {
    // Check for duplicate handle
    if (productData.handle) {
      try {
        const existingProduct = await this.shopifyService.getProduct(productData.handle)
        if (existingProduct) {
          errors.push(`Product with handle "${productData.handle}" already exists`)
        }
      } catch (error) {
        // Product doesn't exist, which is good
      }
    }

    // Validate variant consistency
    if (productData.variants && productData.options) {
      const optionCombinations = this.generateOptionCombinations(productData.options)
      
      if (optionCombinations.length !== productData.variants.length) {
        warnings.push(`Number of variants (${productData.variants.length}) doesn't match expected combinations (${optionCombinations.length})`)
      }
    }

    // Price consistency check
    if (productData.variants && productData.variants.length > 1) {
      const prices = productData.variants.map(v => v.price)
      const maxPrice = Math.max(...prices)
      const minPrice = Math.min(...prices)
      
      if (maxPrice / minPrice > 10) {
        warnings.push('Large price variation detected between variants')
      }
    }

    // SEO recommendations
    if (!productData.seo?.title && productData.title) {
      warnings.push('Consider adding SEO title for better search visibility')
    }
    
    if (!productData.tags || productData.tags.length === 0) {
      warnings.push('Consider adding tags for better product categorization')
    }
  }

  private getNestedValue(obj: any, path: string): any {
    const parts = path.split('.')
    let current = obj
    
    for (const part of parts) {
      if (part === '*' && Array.isArray(current)) {
        return current
      }
      if (current === null || current === undefined) {
        return undefined
      }
      current = current[part]
    }
    
    return current
  }

  private validateType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string'
      case 'number':
        return typeof value === 'number' && !isNaN(value)
      case 'array':
        return Array.isArray(value)
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value)
      default:
        return true
    }
  }

  private generateOptionCombinations(options: ProductOption[]): string[] {
    if (options.length === 0) return ['']
    
    const combinations: string[] = []
    const generate = (current: string[], optionIndex: number) => {
      if (optionIndex === options.length) {
        combinations.push(current.join(' / '))
        return
      }
      
      for (const value of options[optionIndex].values) {
        generate([...current, value], optionIndex + 1)
      }
    }
    
    generate([], 0)
    return combinations
  }

  async createProduct(productData: CreateProductRequest, user: JWTPayload): Promise<ApiResponse<any>> {
    // Validate product data
    const validation = await this.validateProduct(productData)
    
    if (!validation.isValid) {
      return {
        success: false,
        error: 'Product validation failed',
        details: validation.errors
      }
    }

    try {
      // Generate handle if not provided
      if (!productData.handle) {
        productData.handle = this.generateHandle(productData.title)
      }

      // Transform data for Shopify
      const shopifyProductData = this.transformToShopifyFormat(productData)

      // Create product in Shopify
      const createdProduct = await this.createShopifyProduct(shopifyProductData)

      // Store in local database for additional features
      await this.storeProductLocally(createdProduct, productData, user)

      return {
        success: true,
        data: {
          product: createdProduct,
          warnings: validation.warnings
        }
      }
    } catch (error) {
      console.error('Product creation failed:', error)
      return {
        success: false,
        error: 'Failed to create product',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private generateHandle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  private transformToShopifyFormat(productData: CreateProductRequest): any {
    return {
      input: {
        title: productData.title,
        descriptionHtml: productData.description,
        handle: productData.handle,
        productType: productData.productType,
        vendor: productData.vendor || 'EC Store',
        tags: productData.tags?.join(', ') || '',
        status: productData.status,
        seo: {
          title: productData.seo?.title || productData.title,
          description: productData.seo?.description || productData.description
        },
        images: productData.images?.map((img, index) => ({
          src: img.url,
          altText: img.altText,
          position: index + 1
        })) || [],
        options: productData.options || [],
        variants: productData.variants.map(variant => ({
          price: variant.price.toString(),
          sku: variant.sku || this.generateSku(productData.title, variant.title),
          inventoryQuantity: variant.inventory,
          weight: variant.weight,
          title: variant.title,
          optionValues: variant.options || {}
        }))
      }
    }
  }

  private generateSku(productTitle: string, variantTitle: string): string {
    const productCode = productTitle
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .substring(0, 6)
    const variantCode = variantTitle
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .substring(0, 4)
    const timestamp = Date.now().toString().slice(-4)
    return `${productCode}-${variantCode}-${timestamp}`
  }

  private async createShopifyProduct(productData: any): Promise<any> {
    // This would integrate with Shopify Admin API
    // For now, return a mock response
    return {
      id: `shopify_${Date.now()}`,
      title: productData.input.title,
      handle: productData.input.handle,
      status: productData.input.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variants: productData.input.variants,
      images: productData.input.images
    }
  }

  private async storeProductLocally(shopifyProduct: any, originalData: CreateProductRequest, user: JWTPayload) {
    // Store in local database for enhanced features
    const localProduct = {
      id: shopifyProduct.id,
      shopifyId: shopifyProduct.id,
      ...originalData,
      createdBy: user.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        ...originalData.metadata,
        lastModifiedBy: user.userId,
        validationWarnings: []
      }
    }

    // This would integrate with your local database
    console.log('Storing product locally:', localProduct)
  }

  async updateProduct(productId: string, updates: Partial<CreateProductRequest>, user: JWTPayload): Promise<ApiResponse<any>> {
    try {
      // Validate updates
      const currentProduct = await this.getProduct(productId)
      if (!currentProduct) {
        return {
          success: false,
          error: 'Product not found'
        }
      }

      const updatedData = { ...currentProduct, ...updates }
      const validation = await this.validateProduct(updatedData as CreateProductRequest)

      if (!validation.isValid) {
        return {
          success: false,
          error: 'Product validation failed',
          details: validation.errors
        }
      }

      // Update in Shopify
      const shopifyUpdates = this.transformToShopifyFormat(updatedData as CreateProductRequest)
      const updatedProduct = await this.updateShopifyProduct(productId, shopifyUpdates)

      // Update local storage
      await this.updateProductLocally(productId, updates, user)

      return {
        success: true,
        data: {
          product: updatedProduct,
          warnings: validation.warnings
        }
      }
    } catch (error) {
      console.error('Product update failed:', error)
      return {
        success: false,
        error: 'Failed to update product',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async getProduct(productId: string): Promise<any> {
    // Retrieve product from local database or Shopify
    return null // Placeholder
  }

  private async updateShopifyProduct(productId: string, updates: any): Promise<any> {
    // Update product in Shopify Admin API
    return null // Placeholder
  }

  private async updateProductLocally(productId: string, updates: Partial<CreateProductRequest>, user: JWTPayload) {
    // Update product in local database
    console.log(`Updating product ${productId} locally:`, updates)
  }

  async deleteProduct(productId: string, user: JWTPayload): Promise<ApiResponse<void>> {
    try {
      // Check if product exists
      const product = await this.getProduct(productId)
      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        }
      }

      // Delete from Shopify
      await this.deleteShopifyProduct(productId)

      // Delete from local storage
      await this.deleteProductLocally(productId)

      return {
        success: true
      }
    } catch (error) {
      console.error('Product deletion failed:', error)
      return {
        success: false,
        error: 'Failed to delete product',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async deleteShopifyProduct(productId: string) {
    // Delete from Shopify Admin API
    console.log(`Deleting Shopify product: ${productId}`)
  }

  private async deleteProductLocally(productId: string) {
    // Delete from local database
    console.log(`Deleting local product: ${productId}`)
  }

  async batchCreateProducts(products: CreateProductRequest[], user: JWTPayload): Promise<ApiResponse<any[]>> {
    const results: any[] = []
    const errors: string[] = []

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      try {
        const result = await this.createProduct(product, user)
        if (result.success) {
          results.push(result.data)
        } else {
          errors.push(`Product ${i + 1}: ${result.error}`)
        }
      } catch (error) {
        errors.push(`Product ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return {
      success: results.length > 0,
      data: results,
      error: errors.length > 0 ? 'Some products failed to create' : undefined,
      details: errors.length > 0 ? errors : undefined
    }
  }
}

export const productGenerationService = new ProductGenerationService()
