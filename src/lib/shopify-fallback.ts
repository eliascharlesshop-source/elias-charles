// Fallback data and error handling for Shopify integration
export const mockShopifyData = {
  products: [
    {
      id: 'gid://shopify/Product/1',
      title: 'Eco-Friendly Surfboard',
      description: 'Sustainable surfboard made from recycled ocean plastic and bio-based materials. Perfect for eco-conscious surfers.',
      handle: 'eco-surfboard',
      availableForSale: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      tags: ['eco-friendly', 'surfboard', 'featured', 'sustainable'],
      productType: 'Surfboard',
      vendor: 'EcoSurf Co.',
      variants: {
        edges: [{
          node: {
            id: 'gid://shopify/ProductVariant/1',
            title: 'Default Title',
            price: { amount: '299.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '399.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 15,
            sku: 'ECO-SURF-001',
            weight: 3.5,
            weightUnit: 'KILOGRAMS',
            image: {
              url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              altText: 'Eco-friendly surfboard'
            }
          }
        }]
      },
      images: {
        edges: [{
          node: {
            url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            altText: 'Eco-friendly surfboard'
          }
        }]
      },
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        altText: 'Eco-friendly surfboard'
      },
      seo: {
        title: 'Eco-Friendly Surfboard - Sustainable Ocean Sports',
        description: 'Premium eco-friendly surfboard made from recycled materials'
      },
      metafields: [
        { key: 'featured', value: 'true', namespace: 'custom' },
        { key: 'category', value: 'Boards', namespace: 'custom' },
        { key: 'subcategory', value: 'Surfboards', namespace: 'custom' }
      ]
    },
    {
      id: 'gid://shopify/Product/2',
      title: 'Organic Cotton Beach Dress',
      description: 'Comfortable and sustainable beach dress made from 100% organic cotton. Perfect for beach days and summer adventures.',
      handle: 'organic-beach-dress',
      availableForSale: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      tags: ['organic', 'cotton', 'dress', 'beach', 'sustainable'],
      productType: 'Dress',
      vendor: 'Sustainable Fashion Co.',
      variants: {
        edges: [{
          node: {
            id: 'gid://shopify/ProductVariant/2',
            title: 'Medium',
            price: { amount: '89.99', currencyCode: 'USD' },
            compareAtPrice: null,
            availableForSale: true,
            quantityAvailable: 25,
            sku: 'ORG-DRESS-M',
            weight: 0.3,
            weightUnit: 'KILOGRAMS',
            image: {
              url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              altText: 'Organic cotton beach dress'
            }
          }
        }]
      },
      images: {
        edges: [{
          node: {
            url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            altText: 'Organic cotton beach dress'
          }
        }]
      },
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        altText: 'Organic cotton beach dress'
      },
      seo: {
        title: 'Organic Cotton Beach Dress - Sustainable Fashion',
        description: 'Comfortable organic cotton dress perfect for beach and summer'
      },
      metafields: [
        { key: 'featured', value: 'true', namespace: 'custom' },
        { key: 'category', value: 'Apparel', namespace: 'custom' },
        { key: 'subcategory', value: 'Dresses', namespace: 'custom' }
      ]
    },
    {
      id: 'gid://shopify/Product/3',
      title: 'Recycled Ocean Plastic Water Bottle',
      description: 'Durable and sustainable water bottle made from recycled ocean plastic. Help clean the oceans while staying hydrated.',
      handle: 'ocean-plastic-bottle',
      availableForSale: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      tags: ['recycled', 'ocean', 'plastic', 'bottle', 'sustainable'],
      productType: 'Water Bottle',
      vendor: 'Ocean Clean Co.',
      variants: {
        edges: [{
          node: {
            id: 'gid://shopify/ProductVariant/3',
            title: '500ml',
            price: { amount: '29.99', currencyCode: 'USD' },
            compareAtPrice: null,
            availableForSale: true,
            quantityAvailable: 50,
            sku: 'OCEAN-BOTTLE-500',
            weight: 0.2,
            weightUnit: 'KILOGRAMS',
            image: {
              url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              altText: 'Recycled ocean plastic water bottle'
            }
          }
        }]
      },
      images: {
        edges: [{
          node: {
            url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            altText: 'Recycled ocean plastic water bottle'
          }
        }]
      },
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        altText: 'Recycled ocean plastic water bottle'
      },
      seo: {
        title: 'Recycled Ocean Plastic Water Bottle - Eco Hydration',
        description: 'Sustainable water bottle made from recycled ocean plastic'
      },
      metafields: [
        { key: 'featured', value: 'false', namespace: 'custom' },
        { key: 'category', value: 'Accessories', namespace: 'custom' },
        { key: 'subcategory', value: 'Bottles', namespace: 'custom' }
      ]
    }
  ],
  collections: [
    {
      id: 'gid://shopify/Collection/1',
      title: 'Sustainable Boards',
      description: 'Eco-friendly surfboards and skateboards made from sustainable materials',
      handle: 'sustainable-boards',
      updatedAt: '2024-01-01T00:00:00Z',
      image: {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        altText: 'Sustainable boards collection'
      },
      products: {
        edges: [{ node: { id: 'gid://shopify/Product/1', handle: 'eco-surfboard' } }]
      }
    },
    {
      id: 'gid://shopify/Collection/2',
      title: 'Organic Apparel',
      description: 'Sustainable clothing made from organic and recycled materials',
      handle: 'organic-apparel',
      updatedAt: '2024-01-01T00:00:00Z',
      image: {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        altText: 'Organic apparel collection'
      },
      products: {
        edges: [{ node: { id: 'gid://shopify/Product/2', handle: 'organic-beach-dress' } }]
      }
    }
  ]
};

export function createFallbackResponse(type: 'products' | 'collections', limit = 20) {
  switch (type) {
    case 'products':
      return {
        products: {
          edges: mockShopifyData.products.slice(0, limit).map(product => ({ node: product })),
          pageInfo: {
            hasNextPage: false,
            endCursor: null
          }
        }
      };
    case 'collections':
      return {
        collections: {
          edges: mockShopifyData.collections.slice(0, limit).map(collection => ({ node: collection })),
          pageInfo: {
            hasNextPage: false,
            endCursor: null
          }
        }
      };
    default:
      return null;
  }
}

export function isShopifyUnavailable(error: any): boolean {
  if (error instanceof Error) {
    return error.message.includes('Unavailable Shop') ||
           error.message.includes('PAYMENT_REQUIRED') ||
           error.message.includes('402');
  }
  return false;
}