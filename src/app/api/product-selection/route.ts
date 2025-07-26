import { NextRequest, NextResponse } from 'next/server';
import Flow3DeliveryOptimization, { DeliveryAddress, DeliveryMethod } from '@/lib/flow3-delivery-optimization';
import { Product } from '@/lib/flow2-product-search';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth.api.getSession({ headers: request.headers });
    
    const body = await request.json();
    const { 
      productId,
      quantity = 1,
      deliveryAddress,
      userPreferences,
      flow2Results // Results from Flow 2 product search
    } = body;

    // Validate required fields
    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zipCode) {
      return NextResponse.json(
        { error: 'deliveryAddress with street, city, and zipCode is required' },
        { status: 400 }
      );
    }

    console.log('🛒 Product selection API called:', {
      productId,
      quantity,
      deliveryCity: deliveryAddress.city
    });

    // Find the selected product from Flow 2 results or create a mock one
    let selectedProduct: Product;
    
    if (flow2Results?.products) {
      selectedProduct = flow2Results.products.find((p: Product) => p.id === productId);
      if (!selectedProduct) {
        return NextResponse.json(
          { error: 'Product not found in Flow 2 results' },
          { status: 404 }
        );
      }
    } else {
      // Fallback: create a mock product (in real implementation, fetch from database)
      selectedProduct = {
        id: productId,
        name: 'Selected Product',
        description: 'Product selected for delivery optimization',
        price: 25.99,
        brand: 'Great Value',
        category: 'general',
        image: '/placeholder-product.jpg',
        rating: 4.2,
        reviews: 150,
        inStock: true,
        quantity: 50,
        warehouse: {
          location: 'Dallas, TX',
          distance: 15,
          estimatedDelivery: 'Tomorrow'
        },
        supplier: {
          id: 'SUP_001',
          name: 'Walmart Supplier',
          reliability: 0.9
        }
      };
    }

    // Prepare selected products array with quantities
    const selectedProducts: Product[] = [];
    for (let i = 0; i < quantity; i++) {
      selectedProducts.push(selectedProduct);
    }

    console.log('🚛 Triggering Flow 3 for delivery optimization...');

    // 🚀 FLOW 3: Delivery Optimization
    const deliveryResult = await Flow3DeliveryOptimization.processDeliveryFlow(
      selectedProducts,
      deliveryAddress as DeliveryAddress,
      userPreferences
    );

    // Prepare comprehensive response that connects Flow 2 → Flow 3
    return NextResponse.json({
      success: true,
      data: {
        productSelection: {
          product: selectedProduct,
          quantity,
          subtotal: selectedProduct.price * quantity
        },
        deliveryOptimization: deliveryResult,
        summary: {
          productCount: selectedProducts.length,
          subtotal: selectedProduct.price * quantity,
          deliveryCost: deliveryResult.recommendedDelivery.cost,
          totalCost: (selectedProduct.price * quantity) + deliveryResult.recommendedDelivery.cost,
          estimatedDelivery: deliveryResult.lastMileCoordination.estimatedDelivery,
          sustainabilityScore: deliveryResult.sustainabilityScore,
          warehouse: deliveryResult.optimalWarehouse.name,
          trackingId: deliveryResult.lastMileCoordination.trackingId
        },
        nextSteps: [
          'Review delivery options',
          'Confirm delivery address',
          'Proceed to checkout',
          'Track your order'
        ],
        timestamp: new Date().toISOString(),
        userId: session?.user?.id || null,
      },
    });

  } catch (error) {
    console.error('Error in product selection and delivery optimization:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process product selection',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch product details and delivery preview
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const zipCode = searchParams.get('zipCode');

    if (!productId || !zipCode) {
      return NextResponse.json(
        { error: 'productId and zipCode are required' },
        { status: 400 }
      );
    }

    // Mock delivery preview without full address
    const mockAddress: DeliveryAddress = {
      street: 'Preview Address',
      city: 'Unknown',
      state: 'TX',
      zipCode
    };

    // Get available delivery options for the ZIP code
    const warehouses = await (Flow3DeliveryOptimization as any).getNearbyWarehouses(mockAddress);
    const deliveryOptions = await (Flow3DeliveryOptimization as any).getDeliveryOptions(warehouses[0], mockAddress);

    return NextResponse.json({
      success: true,
      data: {
        productId,
        zipCode,
        availableDeliveryOptions: deliveryOptions,
        nearestWarehouse: warehouses[0]?.name || 'Walmart Store',
        serviceRadius: warehouses[0]?.deliveryRadius || 25,
        fastestDelivery: deliveryOptions.find((opt: DeliveryMethod) => opt.type === 'same_day')?.estimatedTime || 'Next Day',
        cheapestDelivery: deliveryOptions.reduce((cheapest: DeliveryMethod, current: DeliveryMethod) => 
          current.cost < cheapest.cost ? current : cheapest, deliveryOptions[0]
        ),
        timestamp: new Date().toISOString()
      },
    });

  } catch (error) {
    console.error('Error fetching delivery preview:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch delivery preview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
