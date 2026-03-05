import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { ShopifyService, Product, Collection } from '@ec-mobile/shopify-sdk';
import { theme, formatCurrency, ProductCardProps } from '@ec-mobile/shared-ui';
import { shopifyConfig, validateShopifyConfig } from '../config/shopify';
import { mockProducts, mockCollections, isShopifyUnavailable } from '../lib/shopify-fallback';

const { width: screenWidth } = Dimensions.get('window');

// Initialize Shopify service with real configuration
validateShopifyConfig();
const shopifyService = new ShopifyService(shopifyConfig);

// Header Component matching web app design
const Header: React.FC<{ title?: string; onMenuPress?: () => void; onSearchPress?: () => void; onCartPress?: () => void; cartCount?: number }> = ({
  title = 'EC',
  onMenuPress,
  onSearchPress,
  onCartPress,
  cartCount = 0
}) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onMenuPress} style={styles.headerButton}>
      <Text style={styles.menuIcon}>☰</Text>
    </TouchableOpacity>
    
    <View style={styles.headerCenter}>
      <Text style={styles.headerLogo}>{title}</Text>
    </View>
    
    <View style={styles.headerRight}>
      <TouchableOpacity onPress={onSearchPress} style={styles.headerButton}>
        <Text style={styles.headerIcon}>🔍</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onCartPress} style={styles.headerButton}>
        <Text style={styles.headerIcon}>🛍</Text>
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  </View>
);

// Hero Section Component matching web app
const HeroSection: React.FC = () => (
  <View style={styles.hero}>
    <Image 
      source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
      style={styles.heroImage}
      resizeMode="cover"
    />
    <View style={styles.heroOverlay}>
      <View style={styles.heroContent}>
        <Text style={styles.heroIssue}>Summer 2025 Issue</Text>
        <Text style={styles.heroTitle}>THE OCEAN{'\n'}EDITION</Text>
        <Text style={styles.heroSubtitle}>
          Exploring the intersection of surf culture, sustainable fashion, and coastal living
        </Text>
        <TouchableOpacity style={styles.heroButton}>
          <Text style={styles.heroButtonText}>EXPLORE COLLECTIONS</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// Table of Contents Component
const TableOfContents: React.FC = () => (
  <View style={styles.tocSection}>
    <View style={styles.tocHeader}>
      <View>
        <Text style={styles.tocTitle}>IN THIS ISSUE</Text>
        <Text style={styles.tocVolume}>Volume 03 • Summer 2025</Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.tocSubscribe}>SUBSCRIBE TO EC MAGAZINE</Text>
      </TouchableOpacity>
    </View>
    
    <View style={styles.tocGrid}>
      {[
        { title: 'Surf Culture', number: '01' },
        { title: 'Summer Apparel', number: '02' },
        { title: 'Coastal Living', number: '03' },
        { title: 'Self Care', number: '04' },
      ].map((item, index) => (
        <TouchableOpacity key={index} style={styles.tocItem}>
          <Text style={styles.tocNumber}>{item.number}</Text>
          <Text style={styles.tocItemTitle}>{item.title}</Text>
          <View style={styles.tocUnderline} />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Pull Quote Component
const PullQuote: React.FC = () => (
  <View style={styles.pullQuoteSection}>
    <Text style={styles.pullQuoteText}>
      "If life gives you a break, ride it. Our designs are for those who live for the waves and streets."
    </Text>
    <Text style={styles.pullQuoteAuthor}>— EC Design Team</Text>
  </View>
);

// Magazine Article Card Component
const ArticleCard: React.FC<{ article: any; index: number }> = ({ article, index }) => (
  <TouchableOpacity style={styles.articleCard}>
    <Image 
      source={{ uri: article.image }} 
      style={styles.articleImage}
      resizeMode="cover"
    />
    <View style={styles.articleContent}>
      <Text style={styles.articleCategory}>TRENDING</Text>
      <Text style={styles.articleTitle}>{article.title}</Text>
      <Text style={styles.articleExcerpt}>{article.excerpt}</Text>
      <Text style={styles.articleReadMore}>READ MORE</Text>
    </View>
  </TouchableOpacity>
);

// Product Card Component matching web app design
const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => (
  <TouchableOpacity style={styles.productCard} onPress={onPress}>
    <Image 
      source={{ uri: product.images[0] || 'https://via.placeholder.com/200' }} 
      style={styles.productImage}
      resizeMode="cover"
    />
    <View style={styles.productInfo}>
      <Text style={styles.productCategory}>{product.category}</Text>
      <Text style={styles.productTitle} numberOfLines={2}>
        {product.title}
      </Text>
      <View style={styles.priceContainer}>
        {product.salePrice ? (
          <>
            <Text style={styles.salePrice}>{formatCurrency(product.salePrice)}</Text>
            <Text style={styles.originalPrice}>{formatCurrency(product.price)}</Text>
          </>
        ) : (
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        )}
      </View>
      {!product.inStock && (
        <Text style={styles.outOfStock}>OUT OF STOCK</Text>
      )}
    </View>
  </TouchableOpacity>
);

// Collection Feature Component
const CollectionFeature: React.FC = () => (
  <View style={styles.featureSection}>
    <View style={styles.featureContent}>
      <Text style={styles.featureLabel}>FEATURED COLLECTION</Text>
      <Text style={styles.featureTitle}>THE SKATE{'\n'}COLLECTION</Text>
      <Text style={styles.featureDescription}>
        From street to beach, our skate collection combines performance, style, and sustainability. 
        Designed for those who see the world as their playground.
      </Text>
      
      <View style={styles.featurePoints}>
        <View style={styles.featurePoint}>
          <View style={styles.featurePointLine} />
          <Text style={styles.featurePointText}>
            Sustainable materials that don't compromise on performance
          </Text>
        </View>
        <View style={styles.featurePoint}>
          <View style={styles.featurePointLine} />
          <Text style={styles.featurePointText}>
            Designed by skaters for skaters with coastal influences
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.featureButton}>
        <Text style={styles.featureButtonText}>EXPLORE COLLECTION</Text>
      </TouchableOpacity>
    </View>
    
    <Image 
      source={{ uri: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }}
      style={styles.featureImage}
      resizeMode="cover"
    />
  </View>
);

export const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'collections' | 'search'>('home');

  // Mock data matching the web app
  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'Eco-Friendly Beach Cruiser',
      handle: 'beach-cruiser',
      description: 'Sustainable surfboard made from recycled materials',
      price: 299.99,
      salePrice: 249.99,
      images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
      category: 'BOARDS',
      subcategory: 'Surfboards',
      productType: 'Surfboard',
      vendor: 'EcoSurf',
      tags: ['eco-friendly', 'surfboard', 'featured'],
      availableForSale: true,
      featured: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      variants: [],
      sku: 'ECO-SURF-001',
      inventory: 15,
      inStock: true,
      weight: 3.5
    },
    {
      id: '2',
      title: 'Organic Cotton Beach Dress',
      handle: 'beach-dress',
      description: 'Comfortable and sustainable beach dress',
      price: 89.99,
      images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
      category: 'APPAREL',
      subcategory: 'Dresses',
      productType: 'Dress',
      vendor: 'EcoFashion',
      tags: ['organic', 'cotton', 'beach'],
      availableForSale: true,
      featured: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      variants: [],
      sku: 'ECO-DRESS-001',
      inventory: 25,
      inStock: true,
      weight: 0.3
    },
    {
      id: '3',
      title: 'Recycled Plastic Water Bottle',
      handle: 'water-bottle',
      description: 'Durable water bottle made from ocean plastic',
      price: 29.99,
      images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
      category: 'ACCESSORIES',
      subcategory: 'Bottles',
      productType: 'Water Bottle',
      vendor: 'OceanSave',
      tags: ['recycled', 'bottle', 'ocean'],
      availableForSale: true,
      featured: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      variants: [],
      sku: 'OCEAN-BOTTLE-001',
      inventory: 50,
      inStock: true,
      weight: 0.2
    }
  ];

  const mockArticles = [
    {
      title: 'The Rise of Sustainable Surf Gear',
      excerpt: 'How eco-conscious brands are changing the industry standard.',
      image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'Summer Essentials',
      excerpt: 'The must-have pieces for your beach days and beyond.',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'Skate Culture Meets High Fashion',
      excerpt: 'The unexpected influence of skate aesthetics on runway trends.',
      image: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Try to load real products from Shopify
      const productsData = await shopifyService.getProducts({ limit: 20 });
      const featuredData = await shopifyService.getProducts({ featured: true, limit: 10 });
      
      setProducts(productsData.products);
      setFeaturedProducts(featuredData.products);
      
      console.log('✅ Successfully loaded Shopify data');
    } catch (error) {
      console.error('Error loading Shopify data:', error);
      
      // Check if it's a Shopify unavailable error
      if (isShopifyUnavailable(error)) {
        console.warn('⚠️ Shopify store unavailable, using fallback data');
        setProducts(mockProducts);
        setFeaturedProducts(mockProducts.filter(p => p.featured));
        
        Alert.alert(
          'Demo Mode',
          'Shopify store is currently unavailable. Using demo data for demonstration purposes.',
          [{ text: 'OK' }]
        );
      } else {
        // Other errors - still use fallback but show different message
        console.log('🔄 Falling back to demo data due to connection error');
        setProducts(mockProducts);
        setFeaturedProducts(mockProducts.filter(p => p.featured));
        
        Alert.alert(
          'Connection Error',
          'Unable to connect to store. Using demo data.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    Alert.alert(
      product.title,
      `Price: ${formatCurrency(product.price)}\n\n${product.description}`,
      [{ text: 'Add to Cart' }, { text: 'View Details' }, { text: 'Cancel' }]
    );
  };

  const renderHomeTab = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <HeroSection />

      {/* Table of Contents */}
      <TableOfContents />

      {/* Pull Quote */}
      <PullQuote />

      {/* Trending Articles */}
      <View style={styles.trendingSection}>
        <Text style={styles.sectionTitle}>TRENDING NOW</Text>
        
        <FlatList
          data={mockArticles}
          renderItem={({ item, index }) => <ArticleCard article={item} index={index} />}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FEATURED PRODUCTS</Text>
        <FlatList
          data={featuredProducts}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              onPress={() => handleProductPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Collection Feature */}
      <CollectionFeature />
    </ScrollView>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading EC Store...</Text>
        </View>
      );
    }

    return renderHomeTab();
  };

  return (
    <>
      <ExpoStatusBar style="dark" backgroundColor={theme.colors.background} />
      <SafeAreaView style={styles.safeArea}>
        <Header cartCount={0} />
        {renderContent()}
        
        {/* Bottom Navigation matching web app style */}
        <View style={styles.bottomNav}>
          {[
            { key: 'home', title: 'HOME' },
            { key: 'products', title: 'PRODUCTS' },
            { key: 'collections', title: 'COLLECTIONS' },
            { key: 'search', title: 'SEARCH' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.navItem,
                activeTab === tab.key && styles.activeNavItem
              ]}
              onPress={() => setActiveTab(tab.key as typeof activeTab)}
            >
              <Text style={[
                styles.navText,
                activeTab === tab.key && styles.activeNavText
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: theme.colors.text,
  },
  hero: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  horizontalList: {
    paddingRight: theme.spacing.md,
  },
  productsGrid: {
    padding: theme.spacing.sm,
  },
  collectionsList: {
    padding: theme.spacing.md,
  },
  productCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.md,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  productInfo: {
    padding: theme.spacing.sm,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  productCategory: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginRight: theme.spacing.xs,
  },
  originalPrice: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  outOfStock: {
    fontSize: 12,
    color: theme.colors.error,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  },
  collectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.md,
    width: 200,
    height: 120,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collectionImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.lg,
  },
  collectionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: theme.spacing.sm,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  collectionCount: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  searchContainer: {
    padding: theme.spacing.md,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  activeNavItem: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  navText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  activeNavText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Missing styles for magazine-style components
  tocSection: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    marginVertical: theme.spacing.md,
  },
  tocHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  tocTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    letterSpacing: 1,
  },
  tocVolume: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  tocSubscribe: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tocGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tocItem: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  tocNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    opacity: 0.3,
  },
  tocItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  tocUnderline: {
    height: 2,
    backgroundColor: theme.colors.primary,
    width: 30,
    marginTop: theme.spacing.xs,
  },
  trendingSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  articleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  articleContent: {
    padding: theme.spacing.md,
  },
  articleCategory: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  articleExcerpt: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  articleReadMore: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pullQuoteSection: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    marginVertical: theme.spacing.md,
  },
  pullQuoteText: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: theme.spacing.md,
  },
  pullQuoteAuthor: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
  featureSection: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    marginVertical: theme.spacing.md,
  },
  featureContent: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  featureLabel: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 28,
  },
  featureDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  featurePoints: {
    marginBottom: theme.spacing.lg,
  },
  featurePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  featurePointLine: {
    width: 20,
    height: 2,
    backgroundColor: theme.colors.primary,
    marginTop: 8,
    marginRight: theme.spacing.sm,
  },
  featurePointText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  featureButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  featureButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  featureImage: {
    width: 120,
    height: 160,
    borderRadius: theme.borderRadius.lg,
  },
  heroImage: {
    width: '100%',
    height: 300,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  heroIssue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: theme.spacing.xs,
  },
  heroButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: theme.spacing.lg,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    padding: theme.spacing.sm,
    position: 'relative',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    letterSpacing: 2,
  },
  headerRight: {
    flexDirection: 'row',
  },
  menuIcon: {
    fontSize: 18,
    color: theme.colors.text,
  },
  headerIcon: {
    fontSize: 16,
    color: theme.colors.text,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default App;
