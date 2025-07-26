import { NextRequest, NextResponse } from 'next/server';
import { Flow4CartOptimization, CartItem } from '@/lib/flow4-cart-optimization';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      cartItems, 
      userPreferences 
    } = body;

    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'cartItems is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    console.log('🛒 Flow 4 Cart Optimization API called:', {
      itemCount: cartItems.length,
      userPreferences
    });

    // Process cart optimization using Flow 4
    const optimization = await Flow4CartOptimization.optimizeCart(
      cartItems as CartItem[],
      userPreferences
    );

    return NextResponse.json({
      success: true,
      data: {
        ...optimization,
        timestamp: new Date().toISOString(),
        optimizationId: `OPT_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      },
    });

  } catch (error) {
    console.error('Error in Flow 4 cart optimization:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to optimize cart',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch optimization suggestions for preview
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Return sample optimization data based on category
    const sampleOptimizations = {
      rollbacks: [
        {
          id: 'RB_SAMPLE_001',
          name: 'Great Value Organic Pasta Sauce',
          originalPrice: 2.98,
          rollbackPrice: 1.98,
          savings: 1.00,
          category: 'pantry'
        }
      ],
      greatValue: [
        {
          id: 'GV_SAMPLE_001',
          name: 'Great Value 2% Reduced Fat Milk',
          brandEquivalent: 'Horizon Organic Milk',
          price: 2.78,
          brandPrice: 4.98,
          savings: 2.20,
          category: 'dairy'
        }
      ],
      bundles: [
        {
          id: 'BUNDLE_SAMPLE_001',
          name: 'Breakfast Essentials Bundle',
          discount: 15,
          categories: ['dairy', 'bakery', 'pantry']
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: {
        available: true,
        optimizations: sampleOptimizations,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching optimization preview:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch optimization preview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
