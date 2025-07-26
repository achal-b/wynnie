import { NextRequest } from 'next/server';

interface RateLimitResult {
  success: boolean;
  resetTime: number;
  remaining: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (use Redis in production)
const store: RateLimitStore = {};

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of Object.entries(store)) {
    if (value.resetTime < now) {
      delete store[key];
    }
  }
}, 5 * 60 * 1000);

export default async function rateLimit(
  request: NextRequest,
  keyPrefix: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): Promise<RateLimitResult> {
  // Get client identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             request.headers.get('x-real-ip') || 
             'anonymous';
  
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const resetTime = now + windowMs;

  // Get or create rate limit record
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime
    };
    return {
      success: true,
      resetTime,
      remaining: maxRequests - 1
    };
  }

  // Increment counter
  store[key].count++;

  if (store[key].count > maxRequests) {
    return {
      success: false,
      resetTime: store[key].resetTime,
      remaining: 0
    };
  }

  return {
    success: true,
    resetTime: store[key].resetTime,
    remaining: maxRequests - store[key].count
  };
}

// Specific rate limiters for different endpoints
export const rateLimiters = {
  // Authentication endpoints
  auth: (request: NextRequest) => rateLimit(request, 'auth', 5, 15 * 60 * 1000), // 5 per 15 minutes
  
  // AI/Chat endpoints
  ai: (request: NextRequest) => rateLimit(request, 'ai', 50, 60 * 60 * 1000), // 50 per hour
  
  // File upload endpoints
  upload: (request: NextRequest) => rateLimit(request, 'upload', 10, 15 * 60 * 1000), // 10 per 15 minutes
  
  // General API endpoints
  api: (request: NextRequest) => rateLimit(request, 'api', 200, 15 * 60 * 1000), // 200 per 15 minutes
  
  // Product search endpoints
  search: (request: NextRequest) => rateLimit(request, 'search', 100, 15 * 60 * 1000), // 100 per 15 minutes
};