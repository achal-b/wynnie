import { useState, useCallback } from 'react';

interface TranscriptionOptions {
  language_code?: string;
  speaker_labels?: boolean;
  speakers_expected?: number;
}

interface TranscriptionResult {
  id: string;
  transcript: string;
  language_code?: string;
  confidence?: number;
  timestamps?: {
    words: string[];
    start_time_seconds: number[];
    end_time_seconds: number[];
  };
  diarized_transcript?: {
    entries: Array<{
      transcript: string;
      start_time_seconds: number;
      end_time_seconds: number;
      speaker_id: string;
    }>;
  };
  request_id: string;
}

interface TranscribeTranslateResult {
  id: string;
  original_transcript: string;
  translated_text: string;
  detected_language?: string;
  target_language: string;
}

interface TranslationOptions {
  source_language_code: string;
  target_language_code?: string;
  speaker_id?: string;
  model?: string;
  enable_preprocessing?: boolean;
}

interface TranslationResult {
  original_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
}

export const useAssemblyAI = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribeAudio = useCallback(async (
    audioFile: File,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult | null> => {
    setIsTranscribing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      
      if (options.language_code) {
        formData.append('language_code', options.language_code);
      }
      if (options.speaker_labels !== undefined) {
        formData.append('enable_diarization', options.speaker_labels.toString());
      }
      if (options.speakers_expected !== undefined) {
        formData.append('speakers_expected', options.speakers_expected.toString());
      }

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transcribe audio');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  const translateText = useCallback(async (
    text: string,
    options: TranslationOptions
  ): Promise<TranslationResult | null> => {
    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          ...options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to translate text');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const transcribeAndTranslate = useCallback(async (
    audioFile: File,
    targetLanguage: string = 'en-IN',
    sourceLanguage: string = 'unknown'
  ): Promise<TranscribeTranslateResult | null> => {
    setIsTranscribing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('target_language_code', targetLanguage);
      formData.append('language_code', sourceLanguage);

      const response = await fetch('/api/transcribe-translate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transcribe and translate audio');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  return {
    transcribeAudio,
    translateText,
    transcribeAndTranslate,
    isTranscribing,
    isTranslating,
    error,
  };
};
