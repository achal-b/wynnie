import { NextRequest, NextResponse } from 'next/server';
import { translationService } from '@/lib/translation';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth.api.getSession({ headers: request.headers });
    
    const body = await request.json();
    const { 
      input, 
      source_language_code, 
      target_language_code = 'en-IN',
      speaker_id,
      model = 'mayura:v1',
      enable_preprocessing = true 
    } = body;

    if (!input || !source_language_code || !target_language_code) {
      return NextResponse.json(
        { error: 'Missing required fields: input, source_language_code, target_language_code' },
        { status: 400 }
      );
    }

    console.log('Translation request:', {
      input,
      source_language_code,
      target_language_code,
      model,
      enable_preprocessing
    });

    // Translate text using OpenAI via translation service
    const translationResult = await translationService.translateText({
      input,
      source_language_code,
      target_language_code,
      speaker_id,
      model,
      enable_preprocessing: false, // Disable preprocessing to avoid interpretation
    });

    console.log('Translation result:', translationResult);

    // If translation seems wrong (too different in length or content), try fallback
    const inputLength = input.trim().length;
    const translatedLength = translationResult.translated_text.trim().length;
    const lengthRatio = translatedLength / inputLength;
    
    // If translated text is way too long (more than 3x original), it might be hallucinating
    if (lengthRatio > 3.0) {
      console.warn('⚠️ Translation seems to be hallucinating (too long). Original vs translated:', {
        original: input,
        translated: translationResult.translated_text,
        ratio: lengthRatio
      });
      
      // For now, we'll use the original translation but log the warning
      // In a production system, you might want to implement additional fallback logic
    }

    return NextResponse.json({
      success: true,
      data: {
        original_text: input,
        translated_text: translationResult.translated_text,
        source_language: source_language_code,
        target_language: target_language_code,
      },
    });

  } catch (error) {
    console.error('Error in translation API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to translate text',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
