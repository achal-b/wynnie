/**
 * Intent Classification System for E-commerce Voice Interface
 * Extracts shopping intents from voice input for Flow 2 processing
 */

export interface Intent {
  type: 'search_product' | 'add_to_cart' | 'check_price' | 'place_order' | 'view_cart' | 'general_query';
  entities: {
    product?: string;
    quantity?: number;
    category?: string;
    brand?: string;
    price_range?: {
      min?: number;
      max?: number;
    };
  };
  confidence: number;
  original_query: string;
  english_query: string;
}

export class IntentClassifier {
  /**
   * Classify user intent from voice input
   */
  static async classifyIntent(userMessage: string): Promise<Intent> {
    const lowerMessage = userMessage.toLowerCase();
    
    // Define patterns for different intents (more specific)
    const patterns = {
      add_to_cart: [
        /(?:add|put)\s+(.+?)\s+(?:to|in|into)\s+(?:cart|basket)/i,
        /(?:add)\s+(\d+)\s+(.+?)\s+(?:to|in|into)\s+(?:cart|basket)/i,
      ],
      check_price: [
        /(?:price|cost|how much)\s+(?:of|for|is)\s+(.+)/i,
        /(?:what(?:'s| is) the price of)\s+(.+)/i,
        /(.+?)\s+(?:price|cost)(?:\?)?$/i
      ],
      place_order: [
        /(?:place|make|submit)\s+(?:order|purchase)/i,
        /(?:checkout|proceed to payment)/i,
        /(?:confirm|finalize)\s+(?:order|purchase)/i
      ],
      view_cart: [
        /(?:show|view|check)\s+(?:my\s+)?(?:cart|basket)/i,
        /(?:what(?:'s| is) in my cart)/i,
        /(?:cart|basket)\s+(?:items|contents)/i
      ],
      search_product: [
        /(?:find|search|show|get|need|want|looking for)\s+(.+)/i,
        /(?:do you have|is there)\s+(.+)/i,
        /(?:buy|purchase)\s+(.+)/i,
      ]
    };

    // Check specific patterns first (order matters - most specific first)
    for (const [intentType, intentPatterns] of Object.entries(patterns)) {
      for (const pattern of intentPatterns) {
        const match = userMessage.match(pattern);
        if (match) {
          let entities = {};
          
          if (intentType === 'search_product' || intentType === 'check_price') {
            entities = IntentClassifier.extractProduct(match[1] || userMessage);
          } else if (intentType === 'add_to_cart') {
            // Handle "add 2 chicken to cart" vs "add chicken to cart"
            if (match[2]) {
              entities = {
                quantity: parseInt(match[1]),
                product: match[2].trim()
              };
            } else {
              entities = IntentClassifier.extractProduct(match[1]);
            }
          }
          
          return {
            type: intentType as Intent['type'],
            entities,
            confidence: 0.85,
            original_query: userMessage,
            english_query: userMessage
          };
        }
      }
    }

    // Default to search_product for shopping-related queries
    if (this.isShoppingRelated(userMessage)) {
      return {
        type: 'search_product',
        entities: IntentClassifier.extractProduct(userMessage),
        confidence: 0.6,
        original_query: userMessage,
        english_query: userMessage
      };
    }

    // General query fallback
    return {
      type: 'general_query',
      entities: {},
      confidence: 0.4,
      original_query: userMessage,
      english_query: userMessage
    };
  }

  /**
   * Extract product information from text
   */
  static extractProduct(text: string): { product?: string; quantity?: number; category?: string } {
    const quantityMatch = text.match(/(\d+)\s+(.+)/);
    if (quantityMatch) {
      return {
        quantity: parseInt(quantityMatch[1]),
        product: quantityMatch[2].trim()
      };
    }
    
    // Extract category hints
    const categories = ['food', 'electronics', 'clothing', 'home', 'beauty', 'sports', 'books'];
    const category = categories.find(cat => text.toLowerCase().includes(cat));
    
    return {
      product: text.trim(),
      category
    };
  }

  /**
   * Check if message is shopping-related
   */
  private static isShoppingRelated(message: string): boolean {
    const shoppingKeywords = [
      'buy', 'purchase', 'order', 'cart', 'price', 'cost', 'shop', 'store',
      'product', 'item', 'chicken', 'food', 'clothes', 'electronics',
      'delivery', 'shipping', 'available', 'stock', 'discount', 'offer'
    ];
    
    return shoppingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  /**
   * Generate response based on intent for Flow 2 trigger
   */
  static generateIntentResponse(intent: Intent): { message: string; action: string; data: any } {
    switch (intent.type) {
      case 'search_product':
        return {
          message: `Searching for ${intent.entities.product}...`,
          action: 'TRIGGER_PRODUCT_SEARCH',
          data: {
            query: intent.entities.product,
            category: intent.entities.category,
            quantity: intent.entities.quantity
          }
        };
        
      case 'add_to_cart':
        return {
          message: `Adding ${intent.entities.quantity || 1} ${intent.entities.product} to cart...`,
          action: 'ADD_TO_CART',
          data: {
            product: intent.entities.product,
            quantity: intent.entities.quantity || 1
          }
        };
        
      case 'check_price':
        return {
          message: `Checking price for ${intent.entities.product}...`,
          action: 'CHECK_PRICE',
          data: {
            product: intent.entities.product
          }
        };
        
      case 'place_order':
        return {
          message: 'Proceeding to checkout...',
          action: 'PLACE_ORDER',
          data: {}
        };
        
      case 'view_cart':
        return {
          message: 'Showing your cart items...',
          action: 'VIEW_CART',
          data: {}
        };
        
      default:
        return {
          message: 'How can I help you with shopping today?',
          action: 'GENERAL_ASSISTANCE',
          data: {}
        };
    }
  }
}
