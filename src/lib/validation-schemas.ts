import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format');
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format');

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU too long'),
  inStock: z.boolean().default(true),
  images: z.array(z.string().url('Invalid image URL')).max(10, 'Too many images').optional(),
  tags: z.array(z.string()).max(20, 'Too many tags').optional(),
});

export const productSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  category: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// Chat/AI schemas
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  context: z.object({
    userId: z.string().optional(),
    sessionId: z.string().optional(),
    flow: z.enum(['search', 'delivery', 'optimization', 'general']).optional(),
  }).optional(),
});

// Flow schemas
export const flow2SearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(200, 'Search query too long'),
  filters: z.object({
    category: z.string().optional(),
    priceRange: z.object({
      min: z.number().positive().optional(),
      max: z.number().positive().optional(),
    }).optional(),
    brand: z.string().optional(),
    inStock: z.boolean().optional(),
  }).optional(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
});

export const flow3DeliverySchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    quantity: z.number().int().positive(),
  })).min(1, 'At least one product is required'),
  deliveryAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    country: z.string().default('US'),
  }),
  deliveryPreferences: z.object({
    urgency: z.enum(['standard', 'express', 'overnight']).default('standard'),
    timeSlot: z.string().optional(),
    specialInstructions: z.string().max(500, 'Instructions too long').optional(),
  }).optional(),
});

export const flow4OptimizationSchema = z.object({
  cartItems: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1, 'Cart cannot be empty'),
  budget: z.number().positive().optional(),
  preferences: z.object({
    prioritizeSavings: z.boolean().default(false),
    preferredBrands: z.array(z.string()).optional(),
    avoidCategories: z.array(z.string()).optional(),
  }).optional(),
});

// Audio/Speech schemas
export const speechToTextSchema = z.object({
  language: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid language code').default('en-US'),
  enableTimestamps: z.boolean().default(false),
  filterProfanity: z.boolean().default(true),
});

export const translateSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text too long'),
  targetLanguage: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid target language code'),
  sourceLanguage: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid source language code').optional(),
});

export const transcribeTranslateSchema = z.object({
  targetLanguage: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid target language code'),
  sourceLanguage: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid source language code').optional(),
  enableTimestamps: z.boolean().default(false),
  filterProfanity: z.boolean().default(true),
});

// User authentication schemas
export const signUpSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  phone: phoneSchema.optional(),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// PWA sync schema
export const pwaSyncSchema = z.object({
  lastSync: z.string().datetime().optional(),
  data: z.object({
    cart: z.array(z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      addedAt: z.string().datetime(),
    })).optional(),
    preferences: z.object({
      language: z.string().optional(),
      currency: z.string().optional(),
      notifications: z.boolean().optional(),
    }).optional(),
    searchHistory: z.array(z.string()).max(50, 'Too many search history items').optional(),
  }),
});