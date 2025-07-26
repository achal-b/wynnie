import { NextRequest, NextResponse } from 'next/server';
import { Flow2ProductSearch } from '@/lib/flow2-product-search';
import { IntentClassifier } from '@/lib/intent-classifier';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { intent } = body;

    if (!intent) {
      return NextResponse.json(
        { error: 'Intent is required for Flow 2 processing' },
        { status: 400 }
      );
    }

    console.log('🚀 Flow 2 API - Processing intent:', intent);

    // Process the product search flow
    const searchResults = await Flow2ProductSearch.processProductFlow(intent);

    return NextResponse.json({
      success: true,
      data: {
        flow: 'Flow 2 - Product Search',
        intent: intent,
        results: searchResults,
        timestamp: new Date().toISOString(),
        processingTime: `${searchResults.searchTime}ms`
      }
    });

  } catch (error) {
    console.error('Flow 2 API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process Flow 2 product search',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
