import { NextRequest, NextResponse } from 'next/server';
import { assemblyAI } from '@/lib/assembly-ai';
import { translationService } from '@/lib/translation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth.api.getSession({ headers: request.headers });
    
    // Parse form data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const targetLanguageCode = formData.get('target_language_code') as string || 'en-IN'; // Use en-IN which is supported
    const languageCode = formData.get('language_code') as string || 'unknown';
    const model = formData.get('model') as string || 'saarika:v2.5';

    console.log('Transcribe-translate API called with target:', targetLanguageCode);

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg'];
    if (!allowedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only WAV and MP3 files are supported.' },
        { status: 400 }
      );
    }

    // Validate file size (max 25MB)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    // First, transcribe the audio using Assembly AI
    console.log('Transcribing audio with Assembly AI...');
    const transcriptionResult = await assemblyAI.transcribeAudio({
      file: audioFile,
      language_code: languageCode === 'unknown' ? undefined : languageCode,
      speaker_labels: false, // Disable speaker labels for this endpoint
      punctuate: true,
      format_text: true,
    });

    console.log('Transcription completed:', transcriptionResult.text);

    // Detect language if not provided
    let detectedLanguage = transcriptionResult.language_code;
    if (!detectedLanguage || detectedLanguage === 'unknown') {
      detectedLanguage = await translationService.detectLanguage(transcriptionResult.text);
    }

    // Translate if needed
    let translatedText = transcriptionResult.text;
    if (detectedLanguage !== targetLanguageCode) {
      console.log(`Translating from ${detectedLanguage} to ${targetLanguageCode}...`);
      const translationResult = await translationService.translateText({
        input: transcriptionResult.text,
        source_language_code: detectedLanguage,
        target_language_code: targetLanguageCode,
      });
      translatedText = translationResult.translated_text;
    }

    const result = {
      original_transcript: transcriptionResult.text,
      translated_text: translatedText,
      detected_language: detectedLanguage,
    };

    // Save transcription to database
    const transcriptionRecord = await prisma.voiceTranscription.create({
      data: {
        userId: session?.user?.id || null,
        audioUrl: '', // We could save to S3/CloudFormData and store URL
        transcript: result.original_transcript,
        languageCode: result.detected_language,
        confidence: 0.95, // Sarvam doesn't provide confidence, using default
        duration: 0, // Could calculate from audio file
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: transcriptionRecord.id,
        original_transcript: result.original_transcript,
        translated_text: result.translated_text,
        detected_language: result.detected_language,
        target_language: targetLanguageCode,
      },
    });

  } catch (error) {
    console.error('Error in transcribe-translate API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to transcribe and translate audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
