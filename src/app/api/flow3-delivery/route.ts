import { NextRequest, NextResponse } from 'next/server';
import Flow3DeliveryOptimization, { DeliveryAddress } from '@/lib/flow3-delivery-optimization';
import { Product } from '@/lib/flow2-product-search';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth.api.getSession({ headers: request.headers });
    
    const body = await request.json();
    const { 
      selectedProducts, 
      deliveryAddress, 
      userPreferences 
    } = body;

    // Validate required fields
    if (!selectedProducts || !Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      return NextResponse.json(
        { error: 'selectedProducts is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zipCode) {
      return NextResponse.json(
        { error: 'deliveryAddress with street, city, and zipCode is required' },
        { status: 400 }
      );
    }

    console.log('🚛 Flow 3 API called:', {
      productCount: selectedProducts.length,
      deliveryCity: deliveryAddress.city,
      userPreferences
    });

    // Process delivery optimization using Flow 3
    const deliveryResult = await Flow3DeliveryOptimization.processDeliveryFlow(
      selectedProducts as Product[],
      deliveryAddress as DeliveryAddress,
      userPreferences
    );

    return NextResponse.json({
      success: true,
      data: {
        ...deliveryResult,
        timestamp: new Date().toISOString(),
        // Add user context if available
        userId: session?.user?.id || null,
      },
    });

  } catch (error) {
    console.error('Error in Flow 3 delivery optimization:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to optimize delivery',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch delivery options for a specific address
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zipCode = searchParams.get('zipCode');
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    if (!zipCode || !city || !state) {
      return NextResponse.json(
        { error: 'zipCode, city, and state are required' },
        { status: 400 }
      );
    }

    // Get available delivery options for the address
    const mockAddress: DeliveryAddress = {
      street: '123 Main St', // We don't need full address for options
      city,
      state,
      zipCode
    };

    // Get nearby warehouses and delivery options
    const warehouses = await (Flow3DeliveryOptimization as any).getNearbyWarehouses(mockAddress);
    const deliveryOptions = await (Flow3DeliveryOptimization as any).getDeliveryOptions(warehouses[0], mockAddress);

    return NextResponse.json({
      success: true,
      data: {
        availableWarehouses: warehouses.length,
        deliveryOptions,
        serviceArea: warehouses[0]?.deliveryRadius || 25,
        timestamp: new Date().toISOString()
      },
    });

  } catch (error) {
    console.error('Error fetching delivery options:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch delivery options',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
