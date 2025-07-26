import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { z } from 'zod';
import rateLimit from './rate-limit';

export interface SecurityOptions {
  requireAuth?: boolean;
  roles?: string[];
  rateLimitKey?: string;
  maxRequests?: number;
  windowMs?: number;
  validateInput?: z.ZodSchema;
}

export async function withSecurity(
  request: NextRequest,
  handler: (request: NextRequest, session?: Record<string, any>) => Promise<NextResponse>,
  options: SecurityOptions = {}
) {
  try {
    // Add security headers
    const headers = new Headers();
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Rate limiting
    if (options.rateLimitKey) {
      const rateLimitResult = await rateLimit(
        request,
        options.rateLimitKey,
        options.maxRequests || 100,
        options.windowMs || 15 * 60 * 1000 // 15 minutes
      );

      if (!rateLimitResult.success) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
              ...Object.fromEntries(headers.entries())
            }
          }
        );
      }
    }

    // Authentication check
    let session = null;
    if (options.requireAuth) {
      try {
        session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401, headers: Object.fromEntries(headers.entries()) }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid session' },
          { status: 401, headers: Object.fromEntries(headers.entries()) }
        );
      }
    }

    // Input validation
    if (options.validateInput && request.method !== 'GET') {
      try {
        const body = await request.json();
        const validated = options.validateInput.parse(body);
        // Replace request body with validated data
        (request as { validatedBody?: Record<string, unknown> }).validatedBody = validated as Record<string, unknown>;
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid input data', details: error instanceof Error ? error.message : 'Validation failed' },
          { status: 400, headers: Object.fromEntries(headers.entries()) }
        );
      }
    }

    // Execute handler
    const response = await handler(request, session || undefined);
    
    // Add security headers to response
    for (const [key, value] of headers.entries()) {
      response.headers.set(key, value);
    }

    return response;
  } catch (error) {
    console.error('Security middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Input sanitization utility
export function sanitizeInput(input: unknown): unknown {
  if (typeof input === 'string') {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input && typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[sanitizeInput(key) as string] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// Environment validation
export function validateEnvironment() {
  const requiredVars = [
    'DATABASE_URL',
    'NEBIUS_API_KEY',
    'ASSEMBLY_AI_API_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// File upload validation
export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxFiles?: number;
}

export function validateFileUpload(
  files: File[],
  options: FileValidationOptions = {}
): { valid: boolean; errors: string[] } {
  const {
    maxSize = 25 * 1024 * 1024, // 25MB
    allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/x-m4a'],
    maxFiles = 1
  } = options;

  const errors: string[] = [];

  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} file(s) allowed`);
  }

  for (const file of files) {
    if (file.size > maxSize) {
      errors.push(`File ${file.name} exceeds maximum size of ${maxSize / (1024 * 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file extension matches MIME type
    const extension = file.name.toLowerCase().split('.').pop();
    const expectedExtensions: { [key: string]: string[] } = {
      'audio/wav': ['wav'],
      'audio/mp3': ['mp3'],
      'audio/mpeg': ['mp3', 'mpeg'],
      'audio/mp4': ['mp4', 'm4a'],
      'audio/x-m4a': ['m4a']
    };

    const validExtensions = expectedExtensions[file.type] || [];
    if (extension && !validExtensions.includes(extension)) {
      errors.push(`File extension .${extension} doesn't match MIME type ${file.type}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}