import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withSecurity, sanitizeInput } from '@/lib/security';

export async function GET(request: NextRequest) {
  return withSecurity(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      
      // Validate and sanitize query parameters
      const queryParams = {
        query: sanitizeInput(searchParams.get('q') || ''),
        category: sanitizeInput(searchParams.get('category') || ''),
        limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100), // Max 100 items
        offset: Math.max(parseInt(searchParams.get('offset') || '0'), 0),
      };
      
      const { query, category, limit, offset } = queryParams;

    const whereClause: Record<string, any> = {
      isActive: true,
    };

    // Add search filter
    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Add category filter
    if (category) {
      whereClause.category = {
        slug: category,
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Calculate average rating for each product
    const productsWithRating = products.map((product: Record<string, any>) => ({
      ...product,
      rating: product.reviews.length > 0
        ? product.reviews.reduce((sum: number, review: Record<string, any>) => sum + review.rating, 0) / product.reviews.length
        : 0,
      reviewCount: product.reviews.length,
    }));

    const total = await prisma.product.count({ where: whereClause });

    return NextResponse.json({
      success: true,
      data: {
        products: productsWithRating,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    });

    } catch (error) {
      console.error('Error fetching products:', error);
      
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }
  }, {
    rateLimitKey: 'products-get',
    maxRequests: 200,
    windowMs: 15 * 60 * 1000 // 15 minutes
  });
}

export async function POST(request: NextRequest) {
  return withSecurity(request, async (req) => {
    try {
      // Get validated body from security middleware
      const body = (req as { validatedBody?: Record<string, unknown> }).validatedBody || await req.json();
      const { name, description, price, originalPrice, categoryId, stock, images } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        categoryId,
        stock: stock || 0,
        images: images || [],
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
    });

    } catch (error) {
      console.error('Error creating product:', error);
      
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }
  }, {
    requireAuth: true,
    rateLimitKey: 'products-create',
    maxRequests: 10,
    windowMs: 15 * 60 * 1000 // 15 minutes
  });
}
