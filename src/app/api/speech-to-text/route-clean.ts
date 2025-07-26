import { NextRequest, NextResponse } from 'next/server';
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

      // Validate file upload
      const fileValidation = validateFileUpload([audioFile], {
        maxSize: 25 * 1024 * 1024, // 25MB
        allowedTypes: ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm', 'audio/ogg', 'audio/mp4'],
        maxFiles: 1
      });

      if (!fileValidation.valid) {
        return NextResponse.json(
          { error: 'File validation failed', details: fileValidation.errors },
          { status: 400 }
        );
      }

      // Check Assembly AI API key
      if (!process.env.ASSEMBLY_AI_API_KEY) {
        return NextResponse.json(
          { error: 'Assembly AI API key not configured' },
          { status: 500 }
        );
      }

      // Transcribe using Assembly AI
      const transcriptionResult = await assemblyAI.transcribeAudio({
        file: audioFile,
        language_code: languageCode === 'unknown' ? undefined : languageCode,
        speaker_labels: enableDiarization,
        speakers_expected: enableDiarization ? 2 : undefined,
        punctuate: true,
        format_text: true,
      });

      // Convert to standard format
      const convertedResult = {
        id: transcriptionResult.id,
        transcript: transcriptionResult.text,
        language_code: transcriptionResult.language_code,
        confidence: transcriptionResult.confidence,
        // Add timestamps if requested
        timestamps: withTimestamps && transcriptionResult.words ? {
          words: transcriptionResult.words.map((w: any) => w.text),
          start_time_seconds: transcriptionResult.words.map((w: any) => w.start / 1000),
          end_time_seconds: transcriptionResult.words.map((w: any) => w.end / 1000),
        } : undefined,
        // Add speaker diarization if enabled
        diarized_transcript: enableDiarization && transcriptionResult.utterances ? {
          entries: transcriptionResult.utterances.map((u: any) => ({
            transcript: u.text,
            start_time_seconds: u.start / 1000,
            end_time_seconds: u.end / 1000,
            speaker_id: u.speaker,
          }))
        } : undefined,
        request_id: transcriptionResult.id,
      };

      // Try to save to database (non-blocking)
      try {
        const transcriptionRecord = await prisma.transcription.create({
          data: {
            audioUrl: '', // We don't store the file URL for privacy
            transcript: convertedResult.transcript,
            languageCode: convertedResult.language_code || 'unknown',
            confidence: convertedResult.confidence || 0,
            provider: 'assembly-ai',
            userId: req.headers?.get('user-id') || null,
          },
        });
      } catch (dbError: any) {
        // Log error but don't fail the request
        console.error('Database save failed (continuing anyway):', dbError);
      }

      return NextResponse.json(convertedResult);

    } catch (error: any) {
      console.error('Error in speech-to-text API:', error);
      return NextResponse.json(
        { error: 'Internal server error', details: error.message },
        { status: 500 }
      );
    }
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'Speech-to-text API endpoint. Use POST to submit audio files.',
    supportedFormats: ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm', 'audio/ogg', 'audio/mp4'],
    maxFileSize: '25MB',
    parameters: {
      audio: 'Audio file (required)',
      language_code: 'Language code (optional, default: en-US)',
      with_timestamps: 'Include word-level timestamps (optional, default: false)',
      enable_diarization: 'Enable speaker diarization (optional, default: false)'
    }
  });
}
