import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  
  // Authentication
  BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  
  // AI/ML APIs
  NEBIUS_API_KEY: z.string().min(1, 'NEBIUS_API_KEY is required'),
  ASSEMBLY_AI_API_KEY: z.string().min(1, 'ASSEMBLY_AI_API_KEY is required'),
  PERPLEXITY_API_KEY: z.string().min(1, 'PERPLEXITY_API_KEY is required'),
  SERPAPI_KEY: z.string().min(1, 'SERPAPI_KEY is required'),
  
  // Optional environment variables
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  
  // Rate limiting (Redis URLs for production)
  REDIS_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

// Validate environment variables
export function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return { success: true, env };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      console.error('❌ Environment validation failed:');
      console.error(errorMessages.join('\n'));
      
      return {
        success: false,
        errors: errorMessages,
        error: `Environment validation failed: ${errorMessages.join(', ')}`
      };
    }
    
    return {
      success: false,
      errors: ['Unknown validation error'],
      error: 'Unknown environment validation error'
    };
  }
}

// Check if all required APIs are configured
export function checkApiConfiguration() {
  const apis = {
    nebius: !!process.env.NEBIUS_API_KEY,
    sarvam: !!process.env.SARVAM_API_KEY,
    perplexity: !!process.env.PERPLEXITY_API_KEY,
    serpapi: !!process.env.SERPAPI_KEY,
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    database: !!process.env.DATABASE_URL,
  };

  const missingApis = Object.entries(apis)
    .filter(([_, configured]) => !configured)
    .map(([api, _]) => api);

  return {
    configured: apis,
    allConfigured: missingApis.length === 0,
    missing: missingApis
  };
}

// Get safe environment info for client-side
export function getPublicEnvInfo() {
  const apiConfig = checkApiConfiguration();
  
  return {
    nodeEnv: process.env.NODE_ENV,
    apis: {
      chat: apiConfig.configured.nebius,
      speech: apiConfig.configured.sarvam,
      search: apiConfig.configured.perplexity && apiConfig.configured.serpapi,
      auth: apiConfig.configured.google,
    },
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
  };
}

// Type for validated environment
export type ValidatedEnv = z.infer<typeof envSchema>;