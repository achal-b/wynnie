/**
 * Flow 4: Cart Optimization System
 * Selected Products → Rollback Discovery → Benefits → Great Value Products → Final Optimization
 */

import { Product } from './flow2-product-search';
import { Flow3Result } from './flow3-delivery-optimization';

// Types for Flow 4
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
  addedAt: Date;
}

export interface RollbackProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rollbackPrice: number;
  savings: number;
  savingsPercentage: number;
  category: string;
  brand: string;
  image: string;
  rating: number;
  isRollbackActive: boolean;
  rollbackEndDate: string;
  alternativeFor?: string; // ID of the product this could replace
}

export interface GreatValueProduct {
  id: string;
  name: string;
  price: number;
  brandEquivalent: string;
  brandEquivalentPrice: number;
  savings: number;
  savingsPercentage: number;
  quality: 'same' | 'better' | 'good';
  category: string;
  image: string;
  rating: number;
  customerReviews: number;
  ingredients?: string[];
  nutritionScore?: number;
}

export interface CartOptimization {
  originalCart: CartItem[];
  recommendedSubstitutions: ProductSubstitution[];
  rollbackOpportunities: RollbackOpportunity[];
  greatValueRecommendations: GreatValueRecommendation[];
  bundleDeals: BundleOpportunity[];
  totalOriginalPrice: number;
  totalOptimizedPrice: number;
  totalSavings: number;
  savingsPercentage: number;
  sustainabilityScore: number;
  nutritionScore?: number;
}

export interface ProductSubstitution {
  originalProduct: Product;
  suggestedProduct: Product;
  substitutionType: 'rollback' | 'great_value' | 'better_price' | 'same_brand_variant';
  reason: string;
  savings: number;
  confidence: number; // 0-1
}

export interface RollbackOpportunity {
  product: RollbackProduct;
  replacesProductId: string;
  savings: number;
  priority: 'high' | 'medium' | 'low';
  timeLeft: string; // How long rollback is active
}

export interface GreatValueRecommendation {
  product: GreatValueProduct;
  replacesProductId: string;
  savings: number;
  qualityComparison: string;
  priority: 'high' | 'medium' | 'low';
}

export interface BundleOpportunity {
  id: string;
  name: string;
  products: Product[];
  bundlePrice: number;
  originalPrice: number;
  savings: number;
  applicableItems: string[]; // Cart item IDs this bundle applies to
}

export class Flow4CartOptimization {
  /**
   * Main Flow 4 Entry Point - Optimizes cart with rollbacks, Great Value, and bundles
   */
  static async optimizeCart(
    cartItems: CartItem[],
    userPreferences?: {
      preferGreatValue?: boolean;
      preferNameBrands?: boolean;
      sustainabilityFocus?: boolean;
      budgetConscious?: boolean;
      nutritionFocus?: boolean;
    }
  ): Promise<CartOptimization> {
    console.log('🛒 Flow 4 Started: Cart Optimization', { 
      itemCount: cartItems.length,
      totalValue: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    });

    try {
      // Step 1: Analyze current cart
      const originalPrice = this.calculateOriginalPrice(cartItems);
      
      // Step 2: Find rollback opportunities
      const rollbackOpportunities = await this.findRollbackOpportunities(cartItems);
      
      // Step 3: Find Great Value alternatives
      const greatValueRecommendations = await this.findGreatValueAlternatives(cartItems, userPreferences);
      
      // Step 4: Find bundle deals
      const bundleDeals = await this.findBundleDeals(cartItems);
      
      // Step 5: Create optimization recommendations
      const recommendedSubstitutions = this.createOptimizationRecommendations(
        cartItems,
        rollbackOpportunities,
        greatValueRecommendations,
        userPreferences
      );
      
      // Step 6: Calculate final optimization
      const optimizedPrice = this.calculateOptimizedPrice(cartItems, recommendedSubstitutions);
      const savings = originalPrice - optimizedPrice;
      
      // Step 7: Calculate scores
      const sustainabilityScore = this.calculateSustainabilityScore(cartItems, recommendedSubstitutions);
      const nutritionScore = this.calculateNutritionScore(cartItems, recommendedSubstitutions);

      return {
        originalCart: cartItems,
        recommendedSubstitutions,
        rollbackOpportunities,
        greatValueRecommendations,
        bundleDeals,
        totalOriginalPrice: originalPrice,
        totalOptimizedPrice: optimizedPrice,
        totalSavings: savings,
        savingsPercentage: (savings / originalPrice) * 100,
        sustainabilityScore,
        nutritionScore
      };

    } catch (error) {
      console.error('Flow 4 Error:', error);
      return this.getFallbackOptimization(cartItems);
    }
  }

  /**
   * Step 1: Find Rollback opportunities
   */
  private static async findRollbackOpportunities(cartItems: CartItem[]): Promise<RollbackOpportunity[]> {
    const opportunities: RollbackOpportunity[] = [];
    
    // Mock rollback products data (in real app, fetch from Walmart API)
    const mockRollbackProducts: RollbackProduct[] = [
      {
        id: 'RB_001',
        name: 'Great Value Organic Pasta Sauce',
        price: 1.98,
        originalPrice: 2.98,
        rollbackPrice: 1.98,
        savings: 1.00,
        savingsPercentage: 33.6,
        category: 'pantry',
        brand: 'Great Value',
        image: '/pasta-sauce.jpg',
        rating: 4.3,
        isRollbackActive: true,
        rollbackEndDate: '2025-07-15',
        alternativeFor: 'pasta_sauce'
      },
      {
        id: 'RB_002',
        name: 'Rollback Organic Milk 2%',
        price: 3.28,
        originalPrice: 4.48,
        rollbackPrice: 3.28,
        savings: 1.20,
        savingsPercentage: 26.8,
        category: 'dairy',
        brand: 'Great Value',
        image: '/milk.jpg',
        rating: 4.5,
        isRollbackActive: true,
        rollbackEndDate: '2025-07-12',
        alternativeFor: 'milk'
      }
    ];

    for (const cartItem of cartItems) {
      // Find rollback products that could replace cart items
      const applicableRollbacks = mockRollbackProducts.filter(rollback => 
        rollback.category === cartItem.product.category ||
        rollback.alternativeFor === cartItem.product.category ||
        this.isSimilarProduct(rollback.name, cartItem.product.name)
      );

      for (const rollback of applicableRollbacks) {
        const savings = (cartItem.product.price - rollback.rollbackPrice) * cartItem.quantity;
        if (savings > 0) {
          opportunities.push({
            product: rollback,
            replacesProductId: cartItem.id,
            savings,
            priority: savings > 2 ? 'high' : savings > 1 ? 'medium' : 'low',
            timeLeft: this.calculateTimeLeft(rollback.rollbackEndDate)
          });
        }
      }
    }

    console.log('🔄 Found rollback opportunities:', opportunities.length);
    return opportunities.sort((a, b) => b.savings - a.savings);
  }

  /**
   * Step 2: Find Great Value alternatives
   */
  private static async findGreatValueAlternatives(
    cartItems: CartItem[],
    preferences?: any
  ): Promise<GreatValueRecommendation[]> {
    const recommendations: GreatValueRecommendation[] = [];
    
    // Mock Great Value products (in real app, fetch from Walmart API)
    const mockGreatValueProducts: GreatValueProduct[] = [
      {
        id: 'GV_001',
        name: 'Great Value 2% Reduced Fat Milk',
        price: 2.78,
        brandEquivalent: 'Horizon Organic Milk',
        brandEquivalentPrice: 4.98,
        savings: 2.20,
        savingsPercentage: 44.2,
        quality: 'same',
        category: 'dairy',
        image: '/gv-milk.jpg',
        rating: 4.4,
        customerReviews: 2847
      },
      {
        id: 'GV_002',
        name: 'Great Value Whole Wheat Bread',
        price: 1.28,
        brandEquivalent: 'Pepperidge Farm Bread',
        brandEquivalentPrice: 3.48,
        savings: 2.20,
        savingsPercentage: 63.2,
        quality: 'good',
        category: 'bakery',
        image: '/gv-bread.jpg',
        rating: 4.1,
        customerReviews: 1534
      }
    ];

    for (const cartItem of cartItems) {
      // Skip if user prefers name brands and this is already Great Value
      if (preferences?.preferNameBrands && cartItem.product.brand === 'Great Value') {
        continue;
      }

      const applicableProducts = mockGreatValueProducts.filter(gv => 
        gv.category === cartItem.product.category ||
        this.isSimilarProduct(gv.name, cartItem.product.name)
      );

      for (const gvProduct of applicableProducts) {
        const savings = (cartItem.product.price - gvProduct.price) * cartItem.quantity;
        if (savings > 0) {
          recommendations.push({
            product: gvProduct,
            replacesProductId: cartItem.id,
            savings,
            qualityComparison: this.getQualityComparison(gvProduct.quality),
            priority: savings > 2 ? 'high' : savings > 1 ? 'medium' : 'low'
          });
        }
      }
    }

    console.log('💚 Found Great Value recommendations:', recommendations.length);
    return recommendations.sort((a, b) => b.savings - a.savings);
  }

  /**
   * Step 3: Find bundle deals
   */
  private static async findBundleDeals(cartItems: CartItem[]): Promise<BundleOpportunity[]> {
    const bundles: BundleOpportunity[] = [];
    
    // Mock bundle deals
    const mockBundles = [
      {
        id: 'BUNDLE_001',
        name: 'Breakfast Essentials Bundle',
        categories: ['dairy', 'bakery', 'pantry'],
        minItems: 2,
        discount: 0.15, // 15% off
        description: 'Save on breakfast items'
      },
      {
        id: 'BUNDLE_002',
        name: 'Pantry Staples Bundle',
        categories: ['pantry', 'condiments'],
        minItems: 3,
        discount: 0.20, // 20% off
        description: 'Stock up and save'
      }
    ];

    for (const bundle of mockBundles) {
      const applicableItems = cartItems.filter(item => 
        bundle.categories.includes(item.product.category)
      );

      if (applicableItems.length >= bundle.minItems) {
        const originalPrice = applicableItems.reduce((sum, item) => 
          sum + (item.product.price * item.quantity), 0);
        const bundlePrice = originalPrice * (1 - bundle.discount);
        const savings = originalPrice - bundlePrice;

        bundles.push({
          id: bundle.id,
          name: bundle.name,
          products: applicableItems.map(item => item.product),
          bundlePrice,
          originalPrice,
          savings,
          applicableItems: applicableItems.map(item => item.id)
        });
      }
    }

    return bundles;
  }

  /**
   * Create final optimization recommendations
   */
  private static createOptimizationRecommendations(
    cartItems: CartItem[],
    rollbackOpportunities: RollbackOpportunity[],
    greatValueRecommendations: GreatValueRecommendation[],
    preferences?: any
  ): ProductSubstitution[] {
    const substitutions: ProductSubstitution[] = [];

    // Prioritize rollbacks (time-sensitive)
    for (const rollback of rollbackOpportunities) {
      const originalItem = cartItems.find(item => item.id === rollback.replacesProductId);
      if (originalItem) {
        substitutions.push({
          originalProduct: originalItem.product,
          suggestedProduct: this.convertRollbackToProduct(rollback.product),
          substitutionType: 'rollback',
          reason: `Save ${rollback.savings.toFixed(2)} with rollback price`,
          savings: rollback.savings,
          confidence: 0.9
        });
      }
    }

    // Add Great Value recommendations for items not already substituted
    for (const gvRec of greatValueRecommendations) {
      const alreadySubstituted = substitutions.some(sub => 
        sub.originalProduct.id === gvRec.replacesProductId
      );
      
      if (!alreadySubstituted) {
        const originalItem = cartItems.find(item => item.id === gvRec.replacesProductId);
        if (originalItem) {
          substitutions.push({
            originalProduct: originalItem.product,
            suggestedProduct: this.convertGreatValueToProduct(gvRec.product),
            substitutionType: 'great_value',
            reason: `Save ${gvRec.savings.toFixed(2)} with Great Value alternative`,
            savings: gvRec.savings,
            confidence: preferences?.preferGreatValue ? 0.8 : 0.7
          });
        }
      }
    }

    return substitutions;
  }

  /**
   * Helper methods
   */
  private static calculateOriginalPrice(cartItems: CartItem[]): number {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  private static calculateOptimizedPrice(
    cartItems: CartItem[], 
    substitutions: ProductSubstitution[]
  ): number {
    return this.calculateOriginalPrice(cartItems) - 
           substitutions.reduce((sum, sub) => sum + sub.savings, 0);
  }

  private static calculateSustainabilityScore(
    cartItems: CartItem[],
    substitutions: ProductSubstitution[]
  ): number {
    // Mock sustainability calculation
    let score = 70; // Base score
    
    // Bonus for Great Value (less packaging, local sourcing)
    const greatValueCount = substitutions.filter(sub => 
      sub.substitutionType === 'great_value'
    ).length;
    score += greatValueCount * 5;
    
    // Bonus for organic products
    const organicCount = cartItems.filter(item => 
      item.product.name.toLowerCase().includes('organic')
    ).length;
    score += organicCount * 3;
    
    return Math.min(100, score);
  }

  private static calculateNutritionScore(
    cartItems: CartItem[],
    substitutions: ProductSubstitution[]
  ): number {
    // Mock nutrition calculation
    let score = 60; // Base score
    
    // Bonus for whole grain, organic, etc.
    const healthyKeywords = ['whole grain', 'organic', 'low sodium', 'no sugar'];
    
    for (const item of cartItems) {
      for (const keyword of healthyKeywords) {
        if (item.product.name.toLowerCase().includes(keyword)) {
          score += 5;
        }
      }
    }
    
    return Math.min(100, score);
  }

  private static isSimilarProduct(name1: string, name2: string): boolean {
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z]/g, '');
    const n1 = normalize(name1);
    const n2 = normalize(name2);
    
    // Simple similarity check
    return n1.includes(n2) || n2.includes(n1) || 
           this.calculateSimilarity(n1, n2) > 0.6;
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private static calculateTimeLeft(endDate: string): string {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 1) return `${days} days left`;
    if (days === 1) return '1 day left';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours > 0 ? `${hours} hours left` : 'Ending soon';
  }

  private static getQualityComparison(quality: string): string {
    switch (quality) {
      case 'same': return 'Same quality as name brand';
      case 'better': return 'Better quality than name brand';
      case 'good': return 'Good quality alternative';
      default: return 'Quality alternative';
    }
  }

  private static convertRollbackToProduct(rollback: RollbackProduct): Product {
    return {
      id: rollback.id,
      name: rollback.name,
      description: `Rollback price - save ${rollback.savingsPercentage.toFixed(1)}%`,
      price: rollback.rollbackPrice,
      brand: rollback.brand,
      category: rollback.category,
      image: rollback.image,
      rating: rollback.rating,
      reviews: 100,
      inStock: true,
      quantity: 50,
      warehouse: {
        location: 'Multiple locations',
        distance: 5,
        estimatedDelivery: 'Tomorrow'
      },
      supplier: {
        id: 'WALMART_ROLLBACK',
        name: 'Walmart Rollback',
        reliability: 1.0
      }
    };
  }

  private static convertGreatValueToProduct(gv: GreatValueProduct): Product {
    return {
      id: gv.id,
      name: gv.name,
      description: `Great Value alternative - save ${gv.savingsPercentage.toFixed(1)}%`,
      price: gv.price,
      brand: 'Great Value',
      category: gv.category,
      image: gv.image,
      rating: gv.rating,
      reviews: gv.customerReviews,
      inStock: true,
      quantity: 100,
      warehouse: {
        location: 'Multiple locations',
        distance: 5,
        estimatedDelivery: 'Tomorrow'
      },
      supplier: {
        id: 'WALMART_GV',
        name: 'Walmart Great Value',
        reliability: 1.0
      }
    };
  }

  private static getFallbackOptimization(cartItems: CartItem[]): CartOptimization {
    const originalPrice = this.calculateOriginalPrice(cartItems);
    
    return {
      originalCart: cartItems,
      recommendedSubstitutions: [],
      rollbackOpportunities: [],
      greatValueRecommendations: [],
      bundleDeals: [],
      totalOriginalPrice: originalPrice,
      totalOptimizedPrice: originalPrice,
      totalSavings: 0,
      savingsPercentage: 0,
      sustainabilityScore: 70,
      nutritionScore: 60
    };
  }
}

export default Flow4CartOptimization;
