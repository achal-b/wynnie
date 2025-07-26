/**
 * Flow 2: Product Search & Best Match Selection System
 * Intent → Product Search → Walmart Search → Price/Inventory → Supply Chain → Best Match
 */

import { Intent } from "./intent-classifier";
import OpenAI from "openai";

// Types for Flow 2
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  brand: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  quantity: number;
  isGreatValue?: boolean;
  warehouse: {
    location: string;
    distance: number;
    estimatedDelivery: string;
  };
  supplier: {
    id: string;
    name: string;
    reliability: number;
  };
}

export interface SearchResult {
  products: Product[];
  query: string;
  suggestions: string[];
  totalResults: number;
  searchTime: number;
  bestMatch?: Product;
}

export interface PriceComparison {
  product: Product;
  competitors: Array<{
    retailer: string;
    price: number;
    availability: boolean;
  }>;
  ourAdvantage: {
    priceDifference: number;
    deliveryAdvantage: string;
    qualityScore: number;
  };
}

export class Flow2ProductSearch {
  private static client = new OpenAI({
    baseURL: "https://api.studio.nebius.com/v1/",
    apiKey: process.env.NEBIUS_API_KEY,
  });

  private static perplexityClient = new OpenAI({
    baseURL: "https://api.perplexity.ai",
    apiKey: process.env.PERPLEXITY_API_KEY,
  });

  /**
   * Main Flow 2 Entry Point - Processes intent and returns optimized product results
   */
  static async processProductFlow(intent: Intent): Promise<SearchResult> {
    const startTime = Date.now();

    try {
      console.log("🔍 Flow 2 Started:", intent);

      // Step 1: Enhanced Product Search based on intent
      const searchResults = await this.searchProducts(intent);

      // Step 2: Walmart Inventory & Supply Chain Check
      const inventoryResults = await this.checkInventoryAndSupplyChain(
        searchResults
      );

      // Step 3: Price Comparison & Best Value Analysis
      const priceAnalysis = await this.performPriceComparison(inventoryResults);

      // Step 4: AI-Powered Best Match Selection
      const bestMatch = await this.selectBestMatch(priceAnalysis, intent);

      // Step 5: Great Value & Rollback Discovery
      const optimizedResults = await this.discoverGreatValueProducts(
        priceAnalysis
      );

      const searchTime = Date.now() - startTime;

      return {
        products: optimizedResults,
        query: intent.entities.product || intent.original_query,
        suggestions: await this.generateSuggestions(intent),
        totalResults: optimizedResults.length,
        searchTime,
        bestMatch,
      };
    } catch (error) {
      console.error("Flow 2 Error:", error);
      return this.getFallbackResults(intent);
    }
  }

  /**
   * Step 1: Enhanced Product Search with AI Understanding
   */
  private static async searchProducts(intent: Intent): Promise<Product[]> {
    let searchQuery = intent.entities.product || intent.original_query;
    const category = intent.entities.category;

    // Clean and enhance the search query
    searchQuery = this.cleanSearchQuery(searchQuery);
    
    // Prioritize words using the original query to preserve context (like health terms)
    const prioritizedWords = this.prioritizeWordsByQuery(intent.original_query);
    const enhancedQuery = prioritizedWords.slice(0, 5).join(' ') || searchQuery;

    console.log("🔍 Step 1: Searching for products...", {
      searchQuery,
      enhancedQuery,
      prioritizedWords,
      category,
    });

    try {
      // Step 1a: Use Perplexity to find best product recommendations
      const perplexityResults = await this.searchWithPerplexity(
        enhancedQuery,
        intent
      );

      // Step 1b: Search Walmart products using SerpAPI
      const walmartProducts = await this.searchWalmartProducts(
        enhancedQuery,
        perplexityResults
      );

      return walmartProducts;
    } catch (error) {
      console.error("Product search error:", error);
      // Fallback to enhanced mock data based on query
      return this.getEnhancedMockProducts(searchQuery, category);
    }
  }

  /**
   * Clean and enhance search query for better product matching
   */
  private static cleanSearchQuery(query: string): string {
    // Remove common phrases and improve search terms
    let cleaned = query
      .toLowerCase()
      .replace(
        /^(i want to|i need to|i'm looking for|looking for|find|search for|buy)/gi,
        ""
      )
      .replace(/(to have|to eat|to drink|to use|to buy|to purchase)/gi, "")
      .replace(/\b(some|any|a|an|the)\b/gi, "")
      .replace(/suggest me.*things?/gi, "")
      .replace(/something for.*breakfast/gi, "breakfast")
      .trim();

    // Handle specific food items and categories - BE DIETARY NEUTRAL
    if (cleaned.includes("apple")) {
      cleaned = "fresh apples";
    } else if (
      cleaned.includes("chicken") &&
      (cleaned.includes("biryani") || query.toLowerCase().includes("chicken"))
    ) {
      // Only suggest chicken if user specifically mentioned it
      cleaned = "chicken breast";
    } else if (cleaned.includes("milk")) {
      cleaned = "milk gallon";
    } else if (cleaned.includes("breakfast") || cleaned === "") {
      // Keep breakfast neutral
      cleaned = "breakfast cereal oats bread eggs";
    } else if (
      cleaned.includes("dinner") ||
      query.toLowerCase().includes("dinner")
    ) {
      // Keep dinner neutral and diverse - NO DIETARY ASSUMPTIONS
      cleaned = "dinner food vegetables rice pasta bread";
    } else if (
      cleaned.includes("lunch") ||
      query.toLowerCase().includes("lunch")
    ) {
      // Keep lunch neutral
      cleaned = "lunch food sandwich vegetables bread";
    }

    return cleaned || query; // fallback to original if cleaning removes everything
  }

  /**
   * Use Perplexity to find best products for the query
   */
  private static async searchWithPerplexity(
    query: string,
    intent: Intent
  ): Promise<string[]> {
    if (!process.env.PERPLEXITY_API_KEY) {
      console.log("⚠️ Perplexity API key not configured");
      return [];
    }

    try {
      const systemPrompt = `You are a product research expert. Given a user's query, suggest 3-5 specific product names/brands that would best match their needs. Focus on popular, well-reviewed products available at major retailers like Walmart.

IMPORTANT: Be dietary neutral and inclusive. For generic food requests (like "dinner food" or "food"), suggest diverse options that accommodate different dietary preferences including vegetarian, vegan, and various cultural backgrounds. Do NOT make assumptions about dietary preferences.

DELIVERY PRIORITY: If the user mentions urgency (fast, quick, urgent, asap, immediate, today, tomorrow), prioritize products that are commonly available for same-day or next-day delivery.

Return only a comma-separated list of specific product names, no explanations.

Examples:
- "dinner food vegetables rice pasta bread" → "Rice, Pasta, Fresh Vegetables, Bread, Olive Oil"
- "gaming laptop" → "ASUS ROG Strix G15, HP Pavilion Gaming Laptop, Acer Nitro 5"
- "I need chicken urgently" → "Great Value Chicken Breast, Tyson Fresh Chicken Breast, Perdue Chicken Thighs"`;

      const userPrompt = `User query: "${query}"
Intent: ${intent.type}
Category: ${intent.entities.category || "any"}

Suggest specific products:`;

      const response = await this.perplexityClient.chat.completions.create({
        model: "sonar-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 150,
      });

      const productSuggestions =
        response.choices[0]?.message?.content?.trim() || "";
      const products = productSuggestions
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      console.log("🧠 Perplexity suggestions:", products);
      return products.slice(0, 5);
    } catch (error) {
      console.error("Perplexity search error:", error);
      return [];
    }
  }

  /**
   * Search Walmart products using SerpAPI
   */
  private static async searchWalmartProducts(
    originalQuery: string,
    perplexityResults: string[]
  ): Promise<Product[]> {
    if (!process.env.SERPAPI_KEY) {
      console.log("⚠️ SerpAPI key not configured, using enhanced mock data");
      return this.getEnhancedMockProducts(originalQuery);
    }

    const allProducts: Product[] = [];

    // Search for both original query and Perplexity suggestions
    const searchQueries = [originalQuery, ...perplexityResults.slice(0, 3)];

    for (const query of searchQueries) {
      try {
        console.log(`🛒 Searching Walmart for: "${query}"`);

        const searchUrl = new URL("https://serpapi.com/search");
        searchUrl.searchParams.set("engine", "walmart");
        searchUrl.searchParams.set("query", query);
        searchUrl.searchParams.set("api_key", process.env.SERPAPI_KEY!);
        searchUrl.searchParams.set("num", "5");

        // Add timeout using AbortController
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

        const response = await fetch(searchUrl.toString(), {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; Flow2ProductSearch/1.0)",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.log(`❌ SerpAPI error for "${query}":`, response.status);
          continue;
        }

        const data = await response.json();

        if (data.organic_results && data.organic_results.length > 0) {
          const products = data.organic_results
            .map((item: Record<string, any>) => {
              try {
                return this.convertSerpAPIToProduct(item);
              } catch (error) {
                console.error("Error converting SerpAPI item:", error, item);
                return null;
              }
            })
            .filter(Boolean); // Remove null items
          allProducts.push(...products);
        } else {
          console.log(`ℹ️ No results found for "${query}" on Walmart`);
        }

        // Rate limit: small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error searching for "${query}":`, error);
        // Continue with next query instead of failing completely
        continue;
      }
    }

    // Remove duplicates and limit results
    const uniqueProducts = this.removeDuplicateProducts(allProducts);

    // If no products found, fallback to enhanced mock data
    if (uniqueProducts.length === 0) {
      console.log("⚠️ No products found via SerpAPI, using enhanced mock data");
      return this.getEnhancedMockProducts(originalQuery);
    }

    return uniqueProducts.slice(0, 6);
  }

  /**
   * Convert SerpAPI result to our Product format
   */
  private static convertSerpAPIToProduct(
    serpItem: Record<string, any>
  ): Product {
    // Safe price parsing
    const extractPrice = (priceValue: unknown): number => {
      if (!priceValue) return 0;
      if (typeof priceValue === "number") return priceValue;
      if (typeof priceValue === "string") {
        const cleaned = priceValue.replace(/[^0-9.]/g, "");
        return parseFloat(cleaned) || 0;
      }
      return 0;
    };

    const price = extractPrice(serpItem.primary_offer?.offer_price);
    const originalPrice = serpItem.primary_offer?.list_price
      ? extractPrice(serpItem.primary_offer.list_price)
      : undefined;

    return {
      id: `WM_${
        serpItem.us_item_id || Math.random().toString(36).substr(2, 9)
      }`,
      name: serpItem.title || "Unknown Product",
      description: serpItem.snippet || "Product description not available",
      price: price > 0 ? price : Math.floor(Math.random() * 100) + 10,
      originalPrice,
      discount:
        originalPrice && price
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : undefined,
      brand: serpItem.brand || "Walmart",
      category: serpItem.category || "general",
      image:
        serpItem.thumbnail ||
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center&q=95",
      rating: serpItem.rating
        ? parseFloat(serpItem.rating)
        : 4.0 + Math.random(),
      reviews: serpItem.reviews_count || Math.floor(Math.random() * 1000) + 100,
      inStock: true,
      quantity: Math.floor(Math.random() * 100) + 10,
      warehouse: {
        location: this.getNearestWarehouse(),
        distance: Math.floor(Math.random() * 50) + 5,
        estimatedDelivery: this.calculateDelivery(),
      },
      supplier: {
        id: `SUP_${Math.random().toString(36).substr(2, 9)}`,
        name: serpItem.brand || "Walmart Supplier",
        reliability: 0.85 + Math.random() * 0.15,
      },
    };
  }

  /**
   * Remove duplicate products based on name similarity
   */
  private static removeDuplicateProducts(products: Product[]): Product[] {
    const unique: Product[] = [];

    for (const product of products) {
      const isDuplicate = unique.some(
        (existing) =>
          this.calculateStringSimilarity(
            existing.name.toLowerCase(),
            product.name.toLowerCase()
          ) > 0.7
      );

      if (!isDuplicate) {
        unique.push(product);
      }
    }

    return unique;
  }

  /**
   * Calculate string similarity (0-1)
   */
  private static calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance
   */
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

  /**
   * Enhanced mock products based on actual query analysis
   * Re-enabled for API fallback when SerpAPI credits are exhausted
   */
  private static getEnhancedMockProducts(
    query: string,
    category?: string
  ): Product[] {
    // Re-enabled for API fallback
    console.log(`🔄 Using enhanced mock products as fallback for query: "${query}"`);
    
    const lowerQuery = query.toLowerCase();

    // Analyze query to determine product type
    const productMappings = {
      apple: [
        {
          name: "Fresh Gala Apples 3lb Bag",
          description: "Sweet and crisp Gala apples, perfect for snacking",
          price: 4.99,
          brand: "Fresh",
          category: "food",
        },
        {
          name: "Honeycrisp Apples 2lb Bag",
          description:
            "Premium Honeycrisp apples, known for their sweet-tart flavor",
          price: 6.99,
          brand: "Fresh",
          category: "food",
        },
        {
          name: "Organic Red Delicious Apples",
          description: "Certified organic red delicious apples, 3lb bag",
          price: 7.99,
          brand: "Organic",
          category: "food",
        },
      ],
      chicken: [
        {
          name: "Tyson Fresh Chicken Breast",
          description:
            "Fresh, all-natural chicken breast, perfect for grilling",
          price: 8.99,
          brand: "Tyson",
          category: "food",
        },
        {
          name: "Perdue Chicken Thighs",
          description: "Juicy chicken thighs, great for roasting",
          price: 6.99,
          brand: "Perdue",
          category: "food",
        },
      ],
      coffee: [
        {
          name: "Keurig K-Classic Coffee Maker",
          description: "Single serve K-Cup pod coffee maker with multiple brew sizes",
          price: 79.99,
          brand: "Keurig",
          category: "appliances",
        },
        {
          name: "Mr. Coffee 12-Cup Coffee Maker",
          description: "Programmable drip coffee maker with auto shut-off",
          price: 49.99,
          brand: "Mr. Coffee",
          category: "appliances",
        },
        {
          name: "Ninja Specialty Coffee Maker",
          description: "Single-serve and carafe coffee maker with built-in frother",
          price: 169.99,
          brand: "Ninja",
          category: "appliances",
        },
      ],
      groceries: [
        {
          name: "Great Value Whole Wheat Bread",
          description: "Fresh whole wheat bread loaf, perfect for sandwiches",
          price: 2.48,
          brand: "Great Value",
          category: "food",
        },
        {
          name: "Bananas (per lb)",
          description: "Fresh bananas, rich in potassium and natural energy",
          price: 0.68,
          brand: "Fresh",
          category: "food",
        },
        {
          name: "Great Value 2% Milk Gallon",
          description: "Fresh 2% reduced fat milk, 1 gallon",
          price: 3.48,
          brand: "Great Value",
          category: "food",
        },
        {
          name: "Large Eggs (18 count)",
          description: "Grade A large eggs, great source of protein",
          price: 4.97,
          brand: "Great Value",
          category: "food",
        },
      ],
      iphone: [
        {
          name: "iPhone 15 Pro 128GB",
          description: "Latest iPhone with Pro camera system and A17 Pro chip",
          price: 999.99,
          brand: "Apple",
          category: "electronics",
        },
        {
          name: "iPhone 15 256GB",
          description: "iPhone 15 with enhanced camera and all-day battery",
          price: 899.99,
          brand: "Apple",
          category: "electronics",
        },
      ],
      laptop: [
        {
          name: "HP Pavilion Gaming Laptop",
          description: "Gaming laptop with RTX graphics and fast processor",
          price: 699.99,
          brand: "HP",
          category: "electronics",
        },
        {
          name: "ASUS VivoBook 15",
          description: "Lightweight laptop perfect for work and study",
          price: 549.99,
          brand: "ASUS",
          category: "electronics",
        },
      ],
      milk: [
        {
          name: "Great Value 2% Milk Gallon",
          description: "Fresh 2% reduced fat milk, 1 gallon",
          price: 3.99,
          brand: "Great Value",
          category: "food",
        },
      ],
      dinner: [
        {
          name: "Jasmine White Rice 20lb",
          description: "Premium jasmine rice, perfect base for any dinner",
          price: 18.99,
          brand: "Great Value",
          category: "food",
        },
        {
          name: "Barilla Whole Wheat Pasta",
          description: "Nutritious whole wheat pasta, various shapes available",
          price: 3.49,
          brand: "Barilla",
          category: "food",
        },
        {
          name: "Fresh Mixed Vegetables",
          description: "Fresh seasonal vegetables for healthy dinner prep",
          price: 4.99,
          brand: "Fresh",
          category: "food",
        },
        {
          name: "Whole Wheat Bread Loaf",
          description: "Nutritious whole wheat bread, perfect for any meal",
          price: 2.99,
          brand: "Sara Lee",
          category: "food",
        },
      ],
      vegetables: [
        {
          name: "Fresh Broccoli Crowns",
          description: "Fresh broccoli crowns, rich in vitamins",
          price: 2.99,
          brand: "Fresh",
          category: "food",
        },
        {
          name: "Organic Spinach Bunch",
          description: "Organic fresh spinach, perfect for salads or cooking",
          price: 3.49,
          brand: "Organic",
          category: "food",
        },
      ],
      rice: [
        {
          name: "Basmati Rice 10lb",
          description: "Premium basmati rice with authentic aroma",
          price: 12.99,
          brand: "Royal",
          category: "food",
        },
        {
          name: "Brown Rice 5lb",
          description: "Nutritious brown rice, high in fiber",
          price: 8.99,
          brand: "Uncle Ben's",
          category: "food",
        },
      ],
      pasta: [
        {
          name: "Penne Pasta",
          description: "Classic penne pasta for versatile cooking",
          price: 1.99,
          brand: "Barilla",
          category: "food",
        },
      ],
    };

    // Find matching products
    for (const [key, products] of Object.entries(productMappings)) {
      if (lowerQuery.includes(key)) {
        return products.map((p, i) => ({
          id: `MOCK_${key.toUpperCase()}_${i + 1}`,
          ...p,
          originalPrice: p.price * 1.2,
          discount: Math.floor(Math.random() * 25) + 10,
          image: this.getProductImage(key),
          rating: 4.0 + Math.random(),
          reviews: Math.floor(Math.random() * 1000) + 100,
          inStock: true,
          quantity: Math.floor(Math.random() * 100) + 20,
          warehouse: {
            location: this.getNearestWarehouse(),
            distance: Math.floor(Math.random() * 30) + 5,
            estimatedDelivery: this.calculateDelivery(),
          },
          supplier: {
            id: `SUP_${Math.random().toString(36).substring(2, 11)}`,
            name: `${p.brand} Supplier`,
            reliability: 0.85 + Math.random() * 0.15,
          },
        }));
      }
    }

    // Fallback: generic products
    return [
      {
        id: "FALLBACK_1",
        name: `Best ${query} Option`,
        description: `High-quality ${query} product available at Walmart`,
        price: Math.floor(Math.random() * 100) + 20,
        originalPrice: Math.floor(Math.random() * 120) + 30,
        discount: 15,
        brand: "Great Value",
        category: category || "general",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center&q=95",
        rating: 4.0 + Math.random(),
        reviews: Math.floor(Math.random() * 500) + 50,
        inStock: true,
        quantity: Math.floor(Math.random() * 50) + 10,
        warehouse: {
          location: this.getNearestWarehouse(),
          distance: Math.floor(Math.random() * 40) + 5,
          estimatedDelivery: this.calculateDelivery(),
        },
        supplier: {
          id: `SUP_${Math.random().toString(36).substring(2, 11)}`,
          name: "Walmart Supplier",
          reliability: 0.9,
        },
      },
    ];
  }

  /**
   * Step 2: Inventory & Supply Chain Validation
   */
  private static async checkInventoryAndSupplyChain(
    products: Product[]
  ): Promise<Product[]> {
    // Simulate supply chain checks
    return products
      .map((product) => ({
        ...product,
        inStock: Math.random() > 0.1, // 90% in stock
        quantity: Math.floor(Math.random() * 100) + 10,
        warehouse: {
          location: this.getNearestWarehouse(),
          distance: Math.floor(Math.random() * 50) + 5,
          estimatedDelivery: this.calculateDelivery(),
        },
        supplier: {
          id: `SUP_${Math.random().toString(36).substr(2, 9)}`,
          name: `${product.brand} Supplier`,
          reliability: Math.random() * 0.3 + 0.7, // 70-100% reliability
        },
      }))
      .filter((p) => p.inStock && p.quantity > 0); // Only return products that are in stock and have quantity > 0
  }

  /**
   * Step 3: Price Comparison & Market Analysis
   */
  private static async performPriceComparison(
    products: Product[]
  ): Promise<Product[]> {
    // Simulate competitor price comparison
    return products.map((product) => {
      const competitorPrices = [
        { retailer: "Amazon", price: product.price * 1.1, availability: true },
        {
          retailer: "Target",
          price: product.price * 1.05,
          availability: Math.random() > 0.2,
        },
        {
          retailer: "Flipkart",
          price: product.price * 0.95,
          availability: true,
        },
      ];

      // Calculate our competitive advantage
      const lowestCompetitorPrice = Math.min(
        ...competitorPrices.map((c) => c.price)
      );
      const priceDifference =
        ((lowestCompetitorPrice - product.price) / lowestCompetitorPrice) * 100;

      return {
        ...product,
        originalPrice: product.price * 1.2, // Show savings
        discount: Math.floor(Math.random() * 30) + 5, // 5-35% discount
        competitorAnalysis: {
          competitors: competitorPrices,
          ourAdvantage: {
            priceDifference: Math.round(priceDifference),
            deliveryAdvantage: "Free 2-day delivery",
            qualityScore: Math.random() * 0.3 + 0.7,
          },
        },
      };
    });
  }

  /**
   * Step 4: AI-Powered Best Match Selection using Nebius
   */
  private static async selectBestMatch(
    products: Product[],
    intent: Intent
  ): Promise<Product | undefined> {
    if (products.length === 0) return undefined;

    const systemPrompt = `You are a Walmart product selection AI. Select the BEST product match based on:
1. User intent and preferences
2. Price value and savings
3. Product quality and ratings
4. Delivery speed and availability
5. Brand reputation

Return only the index number (0-${products.length - 1}) of the best product.`;

    const userPrompt = `
    User Query: "${intent.original_query}"
    Intent: ${intent.type}
    Looking for: ${intent.entities.product || "general products"}
    Quantity needed: ${intent.entities.quantity || 1}

    Available Products:
    ${products
      .map(
        (p, i) => `
    ${i}. ${p.name} - $${p.price}
       Brand: ${p.brand} | Rating: ${p.rating}⭐ (${p.reviews} reviews)
       Discount: ${p.discount}% | Stock: ${p.quantity}
       Delivery: ${p.warehouse.estimatedDelivery}
    `
      )
      .join("")}

    Best match index:`;

    try {
      const response = await this.client.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 10,
      });

      const bestIndex = parseInt(
        response.choices[0]?.message?.content?.trim() || "0"
      );
      return products[bestIndex] || products[0];
    } catch (error) {
      console.error("AI Best Match Error:", error);
      // Fallback: Select highest rated product with good price
      return products.sort(
        (a, b) =>
          b.rating * (1 - b.price / 1000) - a.rating * (1 - a.price / 1000)
      )[0];
    }
  }

  /**
   * Step 5: Great Value & Rollback Product Discovery
   */
  private static async discoverGreatValueProducts(
    products: Product[]
  ): Promise<Product[]> {
    return products
      .map((product) => ({
        ...product,
        isGreatValue: product.discount! > 20 || product.price < 50,
        deliveryPriority: this.getDeliveryPriority(product.warehouse.estimatedDelivery)
      }))
      .sort((a, b) => {
        if (a.deliveryPriority !== b.deliveryPriority) {
          return a.deliveryPriority - b.deliveryPriority;
        }
        
        if (a.isGreatValue && !b.isGreatValue) return -1;
        if (!a.isGreatValue && b.isGreatValue) return 1;
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.price - b.price;
      });
  }

  /**
   * Enhanced Search Query using AI
   */
  private static async enhanceSearchQuery(
    query: string,
    intent: Intent
  ): Promise<string> {
    // Use AI to understand user intent better and expand search terms
    const systemPrompt = `Enhance product search queries for better e-commerce results. Return only the enhanced search terms, no explanation.`;

    try {
      const response = await this.client.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Original: "${query}" Intent: ${intent.type} Category: ${
              intent.entities.category || "any"
            }`,
          },
        ],
        temperature: 0.4,
        max_tokens: 50,
      });

      return response.choices[0]?.message?.content?.trim() || query;
    } catch (error) {
      return query;
    }
  }

  /**
   * Mock Walmart Product Database
   */
  private static async getMockWalmartProducts(
    query: string,
    category?: string
  ): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();

    // Mock product database
    const allProducts: Product[] = [
      {
        id: "WM_001",
        name: "Great Value Organic Chicken Breast",
        description: "Fresh organic chicken breast, perfect for healthy meals",
        price: 12.99,
        brand: "Great Value",
        category: "food",
        image:
          "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&crop=center&q=95",
        rating: 4.5,
        reviews: 1250,
        inStock: true,
        quantity: 50,
        warehouse: {
          location: "Dallas, TX",
          distance: 15,
          estimatedDelivery: "Tomorrow",
        },
        supplier: { id: "SUP_001", name: "Tyson Foods", reliability: 0.95 },
      },
      {
        id: "WM_002",
        name: "iPhone 15 Pro 128GB",
        description: "Latest iPhone with Pro camera system",
        price: 999.99,
        brand: "Apple",
        category: "electronics",
        image:
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center&q=95",
        rating: 4.8,
        reviews: 3450,
        inStock: true,
        quantity: 25,
        warehouse: {
          location: "Austin, TX",
          distance: 25,
          estimatedDelivery: "2 days",
        },
        supplier: { id: "SUP_002", name: "Apple Inc", reliability: 0.98 },
      },
      {
        id: "WM_003",
        name: "Great Value 2% Milk Gallon",
        description: "Fresh 2% reduced fat milk, 1 gallon",
        price: 3.99,
        brand: "Great Value",
        category: "food",
        image:
          "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&crop=center&q=95",
        rating: 4.2,
        reviews: 890,
        inStock: true,
        quantity: 100,
        warehouse: {
          location: "Local Store",
          distance: 5,
          estimatedDelivery: "Today",
        },
        supplier: { id: "SUP_003", name: "Local Dairy", reliability: 0.92 },
      },
      {
        id: "WM_004",
        name: "Faded Glory Mens T-Shirt",
        description: "Comfortable cotton t-shirt, various colors",
        price: 8.99,
        brand: "Faded Glory",
        category: "clothing",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&q=95",
        rating: 4.0,
        reviews: 567,
        inStock: true,
        quantity: 75,
        warehouse: {
          location: "Houston, TX",
          distance: 30,
          estimatedDelivery: "3 days",
        },
        supplier: { id: "SUP_004", name: "Hanes", reliability: 0.88 },
      },
    ];

    // Filter products based on search query
    let filteredProducts = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );

    // If no matches, return popular products from category
    if (filteredProducts.length === 0 && category) {
      filteredProducts = allProducts.filter((p) => p.category === category);
    }

    // If still no matches, return random popular products
    if (filteredProducts.length === 0) {
      filteredProducts = allProducts.slice(0, 2);
    }

    return filteredProducts.slice(0, 6); // Return max 6 products
  }

  /**
   * Generate search suggestions
   */
  private static async generateSuggestions(intent: Intent): Promise<string[]> {
    const suggestions = [
      "organic chicken breast",
      "fresh milk gallon",
      "iPhone 15 deals",
      "men's clothing",
      "grocery essentials",
      "electronics on sale",
    ];

    return suggestions.slice(0, 4);
  }

  /**
   * Helper methods
   */
  private static getNearestWarehouse(): string {
    const warehouses = [
      "Dallas, TX",
      "Austin, TX",
      "Houston, TX",
      "San Antonio, TX",
    ];
    return warehouses[Math.floor(Math.random() * warehouses.length)];
  }

  private static calculateDelivery(): string {
    const deliveryOptions = [
      { text: "Today", priority: 1, hours: 0 },
      { text: "Tomorrow", priority: 2, hours: 24 },
      { text: "2 days", priority: 3, hours: 48 },
      { text: "3 days", priority: 4, hours: 72 },
      { text: "1 week", priority: 5, hours: 168 }
    ];
    
    const weights = [0.3, 0.3, 0.2, 0.15, 0.05];
    const randomValue = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulativeWeight += weights[i];
      if (randomValue <= cumulativeWeight) {
        return deliveryOptions[i].text;
      }
    }
    
    return deliveryOptions[0].text;
  }

  private static getDeliveryPriority(deliveryText: string): number {
    const deliveryMap: Record<string, number> = {
      "Today": 1,
      "Tomorrow": 2,
      "2 days": 3,
      "3 days": 4,
      "1 week": 5
    };
    return deliveryMap[deliveryText] || 6;
  }

  private static prioritizeWordsByQuery(query: string): string[] {
    const words = query.toLowerCase().split(/\s+/);
    const priorityWords: Record<string, number> = {};
    
    // Core product/brand/item names (nouns) - highest priority
    const productNouns = [
      /\b(laptop|computer|phone|iphone|samsung|apple|nike|adidas)\b/i,
      /\b(milk|bread|rice|pasta|chicken|beef|eggs|cheese|butter)\b/i,
      /\b(shampoo|soap|toothpaste|detergent|paper|towel|tissue)\b/i,
      /\b(shirt|pants|shoes|jacket|dress|socks|underwear)\b/i,
      /\b(tv|television|monitor|speaker|headphones|camera)\b/i,
      /\b(book|magazine|toy|game|console|xbox|playstation)\b/i,
      /\b(medicine|vitamin|supplement|bandage|thermometer)\b/i,
      /\b(car|auto|tire|oil|battery|parts|tools|wrench)\b/i
    ];
    
    // Product attributes/descriptors - high priority
    const productAttributes = [
      /\b(organic|natural|fresh|frozen|canned|bottled|dried)\b/i,
      /\b(large|small|medium|extra|mini|jumbo|family|single)\b/i,
      /\b(red|blue|green|black|white|pink|yellow|purple)\b/i,
      /\b(cotton|wool|silk|leather|plastic|metal|wood|glass)\b/i,
      /\b(wireless|bluetooth|digital|smart|electric|manual)\b/i,
      /\b(premium|deluxe|basic|standard|professional|industrial)\b/i
    ];
    
    // Health/dietary requirements - very high priority
    const healthDietary = [
      /\b(diabetes|diabetic|diabities|diabetic|diabet|sugar-free|low-sugar|no-sugar)\b/i,
      /\b(gluten-free|dairy-free|lactose-free|nut-free|allergen-free)\b/i,
      /\b(organic|keto|vegan|vegetarian|kosher|halal)\b/i,
      /\b(low-fat|fat-free|low-sodium|sugar-free|diet)\b/i
    ];
    
    // Brand names - high priority
    const brandNames = [
      /\b(walmart|great-value|equate|marketside|mainstays)\b/i,
      /\b(coca-cola|pepsi|nestle|kraft|general-mills|kellogg)\b/i,
      /\b(samsung|apple|lg|sony|hp|dell|lenovo|asus)\b/i,
      /\b(nike|adidas|levi|gap|target|amazon|microsoft)\b/i
    ];
    
    // Urgency/timing - medium-high priority
    const urgencyTiming = [
      /\b(urgent|asap|immediate|today|tomorrow|fast|quick|rush)\b/i,
      /\b(same-day|next-day|express|priority|overnight)\b/i
    ];
    
    // Quality/price indicators - medium priority
    const qualityPrice = [
      /\b(cheap|expensive|budget|affordable|discount|sale|deal)\b/i,
      /\b(quality|premium|luxury|high-end|top-rated|best)\b/i,
      /\b(new|latest|updated|modern|classic|vintage)\b/i
    ];
    
    // Common stop words to deprioritize
    const stopWords = [
      /\b(i|me|my|myself|we|our|ours|ourselves|you|your|yours)\b/i,
      /\b(he|him|his|himself|she|her|hers|herself|it|its|itself)\b/i,
      /\b(they|them|their|theirs|themselves|what|which|who|whom)\b/i,
      /\b(this|that|these|those|am|is|are|was|were|be|been|being)\b/i,
      /\b(have|has|had|having|do|does|did|doing|a|an|the|and|but)\b/i,
      /\b(if|or|because|as|until|while|of|at|by|for|with|about)\b/i,
      /\b(against|between|into|through|during|before|after|above)\b/i,
      /\b(below|to|from|up|down|in|out|on|off|over|under|again)\b/i,
      /\b(further|then|once|so|such|something|someone|somewhere)\b/i
    ];
    
    words.forEach(word => {
      let priority = 1;
      
      // Check if it's a stop word (lowest priority)
      if (stopWords.some(pattern => pattern.test(word))) {
        priority = 0.1;
      }
      // Health/dietary terms get highest priority
      else if (healthDietary.some(pattern => pattern.test(word))) {
        priority = 5;
      }
      // Additional fuzzy matching for common health-related misspellings
      else if (this.isSimilarToHealthTerm(word)) {
        priority = 5;
      }
      // Product nouns get very high priority
      else if (productNouns.some(pattern => pattern.test(word))) {
        priority = 4.5;
      }
      // Brand names get high priority
      else if (brandNames.some(pattern => pattern.test(word))) {
        priority = 4;
      }
      // Product attributes get high priority
      else if (productAttributes.some(pattern => pattern.test(word))) {
        priority = 3.5;
      }
      // Urgency/timing get medium-high priority
      else if (urgencyTiming.some(pattern => pattern.test(word))) {
        priority = 3;
      }
      // Quality/price indicators get medium priority
      else if (qualityPrice.some(pattern => pattern.test(word))) {
        priority = 2.5;
      }
      
      // Length bonus for longer words (more specific)
      if (word.length > 4) {
        priority += 0.5;
      }
      if (word.length > 7) {
        priority += 0.5;
      }
      
      // Numbers and model identifiers get bonus
      if (/\d/.test(word)) {
        priority += 1;
      }
      
      priorityWords[word] = priority;
    });
    
    return Object.entries(priorityWords)
      .sort(([, a], [, b]) => b - a)
      .map(([word]) => word);
  }

  private static isSimilarToHealthTerm(word: string): boolean {
    const healthTerms = [
      { correct: 'diabetes', variations: ['diabities', 'diabites', 'diabitis', 'diabeted', 'diabete'] },
      { correct: 'diabetic', variations: ['diabitic', 'diabitic', 'diabetik', 'diabetic'] },
      { correct: 'gluten', variations: ['glutten', 'gluten', 'glutin', 'gluten'] },
      { correct: 'organic', variations: ['orgnic', 'organik', 'organc', 'organi'] },
      { correct: 'vegan', variations: ['vegan', 'veagan', 'vegen', 'veegn'] },
      { correct: 'vegetarian', variations: ['vegeterian', 'vegetarian', 'vegatarian', 'vegaterian'] }
    ];
    
    return healthTerms.some(term => 
      term.variations.some(variation => 
        this.calculateSimilarity(word.toLowerCase(), variation.toLowerCase()) > 0.7
      )
    );
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }


  private static getProductImage(category: string): string {
    const imageMap: Record<string, string> = {
      apple:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center&q=95",
      chicken:
        "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&crop=center&q=95",
      iphone:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center&q=95",
      laptop:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center&q=95",
      milk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&crop=center&q=95",
      dinner:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&crop=center&q=95",
      vegetables:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&crop=center&q=95",
      rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center&q=95",
      pasta:
        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=400&fit=crop&crop=center&q=95",
    };

    return (
      imageMap[category] ||
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center&q=95"
    );
  }

  private static getFallbackResults(intent: Intent): SearchResult {
    return {
      products: [],
      query: intent.original_query,
      suggestions: ['Try searching for "chicken", "iPhone", or "milk"'],
      totalResults: 0,
      searchTime: 0,
      bestMatch: undefined,
    };
  }
}
