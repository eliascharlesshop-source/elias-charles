// Fallback data for mobile app when Shopify is unavailable
import { Product, Collection } from '@ec-mobile/shopify-sdk';

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Eco-Friendly Surfboard',
    handle: 'eco-surfboard',
    description: 'Sustainable surfboard made from recycled ocean plastic and bio-based materials. Perfect for eco-conscious surfers.',
    price: 299.99,
    salePrice: 249.99,
    compareAtPrice: 399.99,
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    category: 'Boards',
    subcategory: 'Surfboards',
    productType: 'Surfboard',
    vendor: 'EcoSurf Co.',
    tags: ['eco-friendly', 'surfboard', 'featured', 'sustainable'],
    availableForSale: true,
    featured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    sku: 'ECO-SURF-001',
    inventory: 15,
    inStock: true,
    weight: 3.5,
    seo: {
      title: 'Eco-Friendly Surfboard - Sustainable Ocean Sports',
      description: 'Premium eco-friendly surfboard made from recycled materials'
    },
    variants: [{
      id: '1',
      title: 'Default Title',
      price: 299.99,
      compareAtPrice: 399.99,
      availableForSale: true,
      quantityAvailable: 15,
      sku: 'ECO-SURF-001',
      weight: 3.5,
      weightUnit: 'KILOGRAMS',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }]
  },
  {
    id: '2',
    title: 'Organic Cotton Beach Dress',
    handle: 'organic-beach-dress',
    description: 'Comfortable and sustainable beach dress made from 100% organic cotton. Perfect for beach days and summer adventures.',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    category: 'Apparel',
    subcategory: 'Dresses',
    productType: 'Dress',
    vendor: 'Sustainable Fashion Co.',
    tags: ['organic', 'cotton', 'dress', 'beach', 'sustainable'],
    availableForSale: true,
    featured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    sku: 'ORG-DRESS-M',
    inventory: 25,
    inStock: true,
    weight: 0.3,
    seo: {
      title: 'Organic Cotton Beach Dress - Sustainable Fashion',
      description: 'Comfortable organic cotton dress perfect for beach and summer'
    },
    variants: [{
      id: '2',
      title: 'Medium',
      price: 89.99,
      availableForSale: true,
      quantityAvailable: 25,
      sku: 'ORG-DRESS-M',
      weight: 0.3,
      weightUnit: 'KILOGRAMS',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }]
  },
  {
    id: '3',
    title: 'Recycled Ocean Plastic Water Bottle',
    handle: 'ocean-plastic-bottle',
    description: 'Durable and sustainable water bottle made from recycled ocean plastic. Help clean the oceans while staying hydrated.',
    price: 29.99,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    category: 'Accessories',
    subcategory: 'Bottles',
    productType: 'Water Bottle',
    vendor: 'Ocean Clean Co.',
    tags: ['recycled', 'ocean', 'plastic', 'bottle', 'sustainable'],
    availableForSale: true,
    featured: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    sku: 'OCEAN-BOTTLE-500',
    inventory: 50,
    inStock: true,
    weight: 0.2,
    seo: {
      title: 'Recycled Ocean Plastic Water Bottle - Eco Hydration',
      description: 'Sustainable water bottle made from recycled ocean plastic'
    },
    variants: [{
      id: '3',
      title: '500ml',
      price: 29.99,
      availableForSale: true,
      quantityAvailable: 50,
      sku: 'OCEAN-BOTTLE-500',
      weight: 0.2,
      weightUnit: 'KILOGRAMS',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }]
  }
];

export const mockCollections: Collection[] = [
  {
    id: '1',
    title: 'Sustainable Boards',
    description: 'Eco-friendly surfboards and skateboards made from sustainable materials',
    handle: 'sustainable-boards',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    productCount: 1,
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Organic Apparel',
    description: 'Sustainable clothing made from organic and recycled materials',
    handle: 'organic-apparel',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    productCount: 1,
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export function isShopifyUnavailable(error: any): boolean {
  if (error instanceof Error) {
    return error.message.includes('Unavailable Shop') ||
           error.message.includes('PAYMENT_REQUIRED') ||
           error.message.includes('402') ||
           error.message.includes('HTTP error! status: 402');
  }
  return false;
}