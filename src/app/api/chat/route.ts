import { NextRequest, NextResponse } from 'next/server';
import { IntentClassifier } from '@/lib/intent-classifier';
import { Flow2ProductSearch } from '@/lib/flow2-product-search';
import { withSecurity, sanitizeInput } from '@/lib/security';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(request: NextRequest) {
  return withSecurity(request, async (req) => {
    try {
      // Check if Nebius API key is configured
      if (!process.env.NEBIUS_API_KEY) {
        return NextResponse.json({
          success: true,
          message: "Thanks for your message! I'm a shopping assistant ready to help you find products. (Note: AI chat is currently not configured - please add a valid Nebius API key)",
          usage: { total_tokens: 0 }
        });
      }
      
      // Get validated body from security middleware
      const body = (req as { validatedBody?: Record<string, unknown> }).validatedBody || await req.json();
      const { message, context } = body;

      // Sanitize user input
      const sanitizedMessage = sanitizeInput(message) as string;

    // 🎯 STEP 1: Classify intent for e-commerce actions
    const intent = await IntentClassifier.classifyIntent(sanitizedMessage);
    console.log('Intent classified:', intent);

    // 🎯 STEP 2: Handle specific e-commerce intents with Flow 2 integration
    if (intent.type !== 'general_query') {
      const intentResponse = IntentClassifier.generateIntentResponse(intent);
      
      // 🚀 FLOW 2: Product Search Integration
      if (intent.type === 'search_product' || intent.type === 'check_price') {
        try {
          console.log('🔍 Triggering Flow 2 for:', intent.type);
          const searchResults = await Flow2ProductSearch.processProductFlow(intent);
          
          return NextResponse.json({
            success: true,
            data: {
              message: intentResponse.message,
              intent: intent,
              action: intentResponse.action,
              action_data: intentResponse.data,
              flow2_results: searchResults,
              timestamp: new Date().toISOString()
            }
          });
        } catch (flow2Error) {
          console.error('Flow 2 Error:', flow2Error);
          // Fallback to basic intent response if Flow 2 fails
        }
      }
      
      return NextResponse.json({
        success: true,
        data: {
          message: intentResponse.message,
          intent: intent,
          action: intentResponse.action,
          action_data: intentResponse.data,
          timestamp: new Date().toISOString()
        }
      });
    }

    // 🎯 STEP 3: For general queries, use AI chat
    // Create system prompt for shopping assistant
    const systemPrompt = `You are a direct shopping assistant for Walmart. Give ultra-brief, actionable responses only.

RULES:
- Maximum 1-2 sentences
- Always suggest specific products or actions  
- No explanations or reasoning
- For vague queries, recommend popular items
- Never use <think> tags or show internal reasoning
- Focus only on products and shopping actions
- BE DIETARY NEUTRAL: Never assume dietary preferences (vegetarian, non-vegetarian, etc.)
- For food requests, suggest diverse options that accommodate all dietary needs

EXAMPLES:
"you can see" → "I can help you shop! Try searching for phones, groceries, or clothes."
"I need something" → "Popular items: iPhone 15, milk, or cleaning supplies. What interests you?"
"show me items" → "Trending: electronics, snacks, home goods. Which category?"
"dinner food" → "Check out rice, pasta, vegetables, bread, or search for specific ingredients!"
"unclear request" → "What would you like to shop for - electronics, groceries, or clothing?"

Be direct, product-focused, and culturally inclusive.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(context) ? context : []), // Previous conversation context
      { role: 'user', content: sanitizedMessage }
    ];

    // Call Nebius API
    const completion = await client.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
      temperature: 0.6,
      top_p: 0.9,
      messages: messages as Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
      max_tokens: 512,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    // Try to trigger Flow 2 for ANY product searches - be more inclusive
    let flow2Results = null;
    
    // More comprehensive shopping detection
    const shoppingKeywords = [
      // Action words
      'buy', 'order', 'shop', 'purchase', 'get', 'find', 'need', 'want', 'looking for',
      // General product terms
      'product', 'item', 'stuff', 'things', 'something',
      // Categories
      'grocery', 'food', 'electronics', 'clothing', 'clothes', 'appliance', 'furniture',
      'book', 'toy', 'game', 'tool', 'supply', 'equipment', 'accessory',
      // Specific items (expand this list)
      'coffee', 'laptop', 'phone', 'machine', 'chair', 'table', 'shirt', 'shoes',
      'bread', 'milk', 'apple', 'banana', 'rice', 'pasta', 'chicken', 'meat',
      'tv', 'computer', 'tablet', 'watch', 'bag', 'bottle', 'cup', 'plate'
    ];
    
    const questionWords = ['what', 'where', 'how much', 'price of', 'cost of'];
    
    // Check for shopping-related content
    const lowerMessage = message.toLowerCase();
    const hasShoppingKeyword = shoppingKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasQuestionAboutProducts = questionWords.some(q => lowerMessage.includes(q)) && 
                                    (lowerMessage.includes('product') || lowerMessage.includes('item') || lowerMessage.includes('buy'));
    
    // Also trigger if the message looks like a product search (noun-based queries)
    const looksLikeProductSearch = /^[a-zA-Z\s]{2,50}$/.test(message.trim()) && 
                                  message.trim().split(' ').length <= 6 && 
                                  !lowerMessage.includes('how are') && 
                                  !lowerMessage.includes('hello') && 
                                  !lowerMessage.includes('hi ') &&
                                  !lowerMessage.includes('thank');
    
    if (hasShoppingKeyword || hasQuestionAboutProducts || looksLikeProductSearch) {
      try {
        console.log('🔍 Triggering Flow 2 for shopping query:', message);
        console.log('🔍 Detection reason:', { hasShoppingKeyword, hasQuestionAboutProducts, looksLikeProductSearch });
        
        // Create a basic intent for Flow 2
        const basicIntent = {
          type: 'search_product' as const,
          confidence: 0.8,
          original_query: message,
          entities: {
            product: message.replace(/^(i want to|i need to|buy|order|get me|find|show me|what is)\s*/i, '').trim(),
            quantity: 1,
            category: 'general'
          }
        };
        flow2Results = await Flow2ProductSearch.processProductFlow(basicIntent);
        console.log('✅ Flow 2 results:', flow2Results ? `${flow2Results.products?.length} products found` : 'No results');
      } catch (error) {
        console.error('❌ Flow 2 error in general chat:', error);
      }
    } else {
      console.log('⏭️ Skipping Flow 2 - not detected as shopping query:', message);
    }

    // TODO: Save conversation to database if user is logged in
    // if (session?.user?.id) {
    //   // Save chat history to database
    //   // await prisma.chatMessage.create({ ... })
    // }

    return NextResponse.json({
      success: true,
      data: {
        message: aiResponse,
        flow2_results: flow2Results,
        timestamp: new Date().toISOString(),
      },
    });

    } catch (error) {
      console.error('Error in chat API:', error);
      
      return NextResponse.json(
        { 
          error: 'Failed to process chat message',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  }, {
    requireAuth: false, // Allow unauthenticated users but with rate limiting
    rateLimitKey: 'chat-ai',
    maxRequests: 50,
    windowMs: 60 * 60 * 1000 // 1 hour
  });
}
