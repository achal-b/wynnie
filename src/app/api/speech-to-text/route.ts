import { NextRequest, NextRes      if (!fileValidation.valid) {
        return NextResponse.json(
          { error: 'File validation failed', details: fileValidation.errors },
          { status: 400 }
        );
      }

      // Check Assembly AI API key
      if (!process.env.ASSEMBLY_AI_API_KEY) {'next/server';
import { assemblyAI } from '@/lib/assembly-ai';
import { prisma } from '@/lib/prisma';
import { withSecurity, validateFileUpload } from '@/lib/security';

export async function POST(request: NextRequest) {
  return withSecurity(request, async (req) => {
    try {
      // Parse form data
      const formData = await req.formData();
      const audioFile = formData.get('audio') as File;
      const languageCode = formData.get('language_code') as string || 'en-US';
      const withTimestamps = formData.get('with_timestamps') === 'true';
      const enableDiarization = formData.get('enable_diarization') === 'true';

      if (!audioFile) {
        return NextResponse.json(
          { error: 'No audio file provided' },
          { status: 400 }
        );
      }

      // Validate file upload with security checks
      const fileValidation = validateFileUpload([audioFile], {
        maxSize: 25 * 1024 * 1024, // 25MB
        allowedTypes: ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'],
        maxFiles: 1
      });

      if (!fileValidation.valid) {
        console.log('File validation failed:', fileValidation.errors);
        return NextResponse.json(
          { error: 'File validation failed', details: fileValidation.errors },
          { status: 400 }
        );
      }

    console.log('File validation passed, calling Assembly AI...');

    // Check if Assembly AI API key is available
    if (!process.env.ASSEMBLY_AI_API_KEY) {
      console.log('Assembly AI API key not configured');
      return NextResponse.json(
        { error: 'Assembly AI API key not configured' },
        { status: 500 }
      );
    }

    // Transcribe audio using Assembly AI
    const transcriptionResult = await assemblyAI.transcribeAudio({
      file: audioFile,
      language_code: languageCode === 'unknown' ? undefined : languageCode,
      speaker_labels: enableDiarization,
      speakers_expected: enableDiarization ? 2 : undefined,
      punctuate: true,
      format_text: true,
    });

    console.log('Assembly AI response:', transcriptionResult);

    // Convert Assembly AI response to match expected format
    const convertedResult = {
      id: transcriptionResult.id,
      transcript: transcriptionResult.text,
      language_code: transcriptionResult.language_code,
      confidence: transcriptionResult.confidence,
      timestamps: transcriptionResult.words ? {
        words: transcriptionResult.words.map(w => w.text),
        start_time_seconds: transcriptionResult.words.map(w => w.start / 1000), // Convert ms to seconds
        end_time_seconds: transcriptionResult.words.map(w => w.end / 1000), // Convert ms to seconds
      } : undefined,
      diarized_transcript: transcriptionResult.utterances ? {
        entries: transcriptionResult.utterances.map(u => ({
          transcript: u.text,
          start_time_seconds: u.start / 1000, // Convert ms to seconds
          end_time_seconds: u.end / 1000, // Convert ms to seconds
          speaker_id: u.speaker,
        }))
      } : undefined,
      request_id: transcriptionResult.id,
    };

    // Save transcription to database (only if we have a working database)
    let transcriptionRecord = null;
    try {
      transcriptionRecord = await prisma.voiceTranscription.create({
        data: {
          userId: null, // No user session for now
          audioUrl: '', // We could save to S3/CloudFormData and store URL
          transcript: convertedResult.transcript,
          languageCode: convertedResult.language_code,
          confidence: convertedResult.confidence || 0.95,
          duration: transcriptionResult.audio_duration || 0,
        },
      });
      console.log('Saved to database:', transcriptionRecord.id);
    } catch (dbError) {
      console.log('Database save failed (continuing anyway):', dbError);
      // Continue without saving to database
    }

    return NextResponse.json({
      success: true,
      data: convertedResult,
    });

    } catch (error) {
      console.error('Error in speech-to-text API:', error);
      
      return NextResponse.json(
        { 
          error: 'Failed to transcribe audio',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  }, {
    requireAuth: false, // Allow unauthenticated for now, but with rate limiting
    rateLimitKey: 'speech-upload',
    maxRequests: 10,
    windowMs: 15 * 60 * 1000 // 15 minutes
  });
}

export async function GET() {
  try {
    // Simple health check
    return NextResponse.json({
      success: true,
      message: 'Speech-to-text API is working',
      assemblyAIConfigured: !!process.env.ASSEMBLY_AI_API_KEY,
    });

  } catch (error) {
    console.error('Error in GET speech-to-text:', error);
    
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    );
  }
}
