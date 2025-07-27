import { useState, useCallback } from 'react';

/**
 * Configuration options for audio transcription requests.
 * These options control how the audio is processed and what features are enabled.
 */
interface TranscriptionOptions {
  /** 
   * Language code for the audio content (e.g., 'en-US', 'es-ES', 'fr-FR').
   * If not specified or set to 'unknown', automatic language detection will be used.
   * This helps improve transcription accuracy for known languages.
   */
  language_code?: string;
  
  /** 
   * Enable speaker identification and diarization (speaker separation).
   * When true, the transcript will include speaker labels to distinguish
   * between different speakers in multi-person conversations.
   */
  speaker_labels?: boolean;
  
  /** 
   * Expected number of speakers in the audio.
   * Providing this hint can improve speaker diarization accuracy.
   * Only relevant when speaker_labels is true. Typically 2-10 speakers.
   */
  speakers_expected?: number;
}

/**
 * Complete result structure returned from audio transcription.
 * Contains the transcript text, metadata, timing information, and speaker data.
 */
interface TranscriptionResult {
  /** Unique identifier for this transcription job */
  id: string;
  
  /** Complete transcribed text from the audio */
  transcript: string;
  
  /** Detected or specified language code of the audio content */
  language_code?: string;
  
  /** Overall confidence score for the transcription (0.0 to 1.0) */
  confidence?: number;
  
  /** Word-level timing information for precise synchronization */
  timestamps?: {
    /** Array of individual words in order */
    words: string[];
    /** Start time for each word in seconds */
    start_time_seconds: number[];
    /** End time for each word in seconds */
    end_time_seconds: number[];
  };
  
  /** Speaker-separated transcript with timing (only when speaker_labels is enabled) */
  diarized_transcript?: {
    entries: Array<{
      /** Text spoken by this speaker */
      transcript: string;
      /** When this speaker segment starts (seconds) */
      start_time_seconds: number;
      /** When this speaker segment ends (seconds) */
      end_time_seconds: number;
      /** Unique identifier for the speaker (e.g., "Speaker_0", "Speaker_1") */
      speaker_id: string;
    }>;
  };
  
  /** Unique request identifier for tracking and debugging */
  request_id: string;
}

/**
 * Result structure for combined transcription and translation operations.
 * Provides both the original transcript and translated version.
 */
interface TranscribeTranslateResult {
  /** Unique identifier for this transcribe-translate job */
  id: string;
  
  /** Original transcript in the source language */
  original_transcript: string;
  
  /** Translated text in the target language */
  translated_text: string;
  
  /** Auto-detected source language (if language detection was used) */
  detected_language?: string;
  
  /** Target language code that was requested */
  target_language: string;
}

/**
 * Configuration options for text translation requests.
 * Controls translation behavior, quality, and preprocessing.
 */
interface TranslationOptions {
  /** 
   * Source language code of the input text (e.g., 'en', 'es', 'fr').
   * Must be specified for accurate translation results.
   */
  source_language_code: string;
  
  /** 
   * Target language code for translation output (e.g., 'en-IN', 'es-MX').
   * If not specified, will default to a common variant of the target language.
   */
  target_language_code?: string;
  
  /** 
   * Specific speaker identifier for speaker-aware translation.
   * Useful for maintaining context in multi-speaker scenarios.
   */
  speaker_id?: string;
  
  /** 
   * Translation model to use ('standard', 'premium', 'neural').
   * Premium models offer better quality but may take longer.
   */
  model?: string;
  
  /** 
   * Enable text preprocessing before translation.
   * Includes normalization, punctuation cleanup, and formatting improvements.
   */
  enable_preprocessing?: boolean;
}

/**
 * Simple result structure for standalone text translation operations.
 */
interface TranslationResult {
  /** Original input text before translation */
  original_text: string;
  
  /** Translated output text */
  translated_text: string;
  
  /** Source language that was used */
  source_language: string;
  
  /** Target language that was produced */
  target_language: string;
}

/**
 * Custom React hook for AssemblyAI speech-to-text, translation, and combined operations.
 * Provides a simple interface for audio transcription with built-in state management,
 * error handling, and loading states.
 * 
 * Features:
 * - Audio file transcription with speaker detection
 * - Text translation between languages
 * - Combined transcribe-and-translate workflow
 * - Automatic error handling and loading states
 * - TypeScript support with comprehensive type definitions
 * 
 * @example
 * ```tsx
 * function AudioTranscriber() {
 *   const { transcribeAudio, isTranscribing, error } = useAssemblyAI();
 *   
 *   const handleFileUpload = async (file: File) => {
 *     const result = await transcribeAudio(file, {
 *       speaker_labels: true,
 *       language_code: 'en-US'
 *     });
 *     
 *     if (result) {
 *       console.log('Transcript:', result.transcript);
 *       console.log('Speakers:', result.diarized_transcript?.entries);
 *     }
 *   };
 *   
 *   return (
 *     <div>
 *       <input type="file" accept="audio/*" onChange={e => handleFileUpload(e.target.files[0])} />
 *       {isTranscribing && <p>Transcribing...</p>}
 *       {error && <p>Error: {error}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useAssemblyAI = () => {
  // Loading state for transcription operations (transcribeAudio, transcribeAndTranslate)
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  // Loading state for translation-only operations (translateText)
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Error state - stores the last error message or null if no error
  const [error, setError] = useState<string | null>(null);

  /**
   * Transcribes audio files to text with optional speaker identification.
   * Supports various audio formats and provides detailed timing information.
   * 
   * @param audioFile - Audio file to transcribe (WAV, MP3, MP4, etc.)
   * @param options - Transcription configuration options
   * @returns Promise resolving to transcription result or null if failed
   * 
   * @example
   * ```tsx
   * // Basic transcription
   * const result = await transcribeAudio(audioFile);
   * 
   * // With speaker detection
   * const result = await transcribeAudio(audioFile, {
   *   speaker_labels: true,
   *   speakers_expected: 3,
   *   language_code: 'en-US'
   * });
   * 
   * // Access speaker-separated content
   * result?.diarized_transcript?.entries.forEach(entry => {
   *   console.log(`${entry.speaker_id}: ${entry.transcript}`);
   * });
   * ```
   */
  const transcribeAudio = useCallback(async (
    audioFile: File,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult | null> => {
    setIsTranscribing(true);
    setError(null); // Clear any previous errors

    try {
      // Create FormData to handle file upload with multipart/form-data
      const formData = new FormData();
      formData.append('audio', audioFile);
      
      // Add optional parameters only if they're specified
      if (options.language_code) {
        formData.append('language_code', options.language_code);
      }
      
      // Map speaker_labels to the API's expected parameter name
      if (options.speaker_labels !== undefined) {
        formData.append('enable_diarization', options.speaker_labels.toString());
      }
      
      if (options.speakers_expected !== undefined) {
        formData.append('speakers_expected', options.speakers_expected.toString());
      }

      // Make request to your backend API endpoint
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData, // Don't set Content-Type header - browser will set it with boundary
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to transcribe audio`);
      }

      const result = await response.json();
      
      // Validate response structure
      if (!result.data) {
        throw new Error('Invalid response format: missing data field');
      }
      
      return result.data;
    } catch (err) {
      // Extract meaningful error message for user display
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred during transcription';
      setError(errorMessage);
      console.error('Transcription error:', err);
      return null;
    } finally {
      // Always reset loading state, regardless of success or failure
      setIsTranscribing(false);
    }
  }, []); // Empty dependency array - function doesn't depend on any props or state

  /**
   * Translates text from one language to another using AI translation models.
   * Supports a wide range of language pairs with configurable quality levels.
   * 
   * @param text - Text to translate
   * @param options - Translation configuration including source and target languages
   * @returns Promise resolving to translation result or null if failed
   * 
   * @example
   * ```tsx
   * // Basic translation
   * const result = await translateText("Hello world", {
   *   source_language_code: 'en',
   *   target_language_code: 'es'
   * });
   * 
   * // With preprocessing and premium model
   * const result = await translateText(transcript, {
   *   source_language_code: 'en',
   *   target_language_code: 'fr-CA',
   *   model: 'premium',
   *   enable_preprocessing: true
   * });
   * 
   * console.log(`${result.original_text} → ${result.translated_text}`);
   * ```
   */
  const translateText = useCallback(async (
    text: string,
    options: TranslationOptions
  ): Promise<TranslationResult | null> => {
    setIsTranslating(true);
    setError(null);

    try {
      // Validate required parameters
      if (!text.trim()) {
        throw new Error('Text to translate cannot be empty');
      }
      
      if (!options.source_language_code) {
        throw new Error('Source language code is required for translation');
      }

      // Send JSON request for text translation
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          ...options, // Spread all translation options
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to translate text`);
      }

      const result = await response.json();
      
      if (!result.data) {
        throw new Error('Invalid response format: missing data field');
      }
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred during translation';
      setError(errorMessage);
      console.error('Translation error:', err);
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  /**
   * Combines transcription and translation in a single operation for efficiency.
   * Transcribes audio to the source language, then translates to the target language.
   * This is faster than calling transcribeAudio + translateText separately.
   * 
   * @param audioFile - Audio file to transcribe and translate
   * @param targetLanguage - Target language code for translation (default: 'en-IN')
   * @param sourceLanguage - Source language hint ('unknown' for auto-detection)
   * @returns Promise resolving to combined result or null if failed
   * 
   * @example
   * ```tsx
   * // Auto-detect source language and translate to English (India)
   * const result = await transcribeAndTranslate(audioFile);
   * 
   * // Specify both source and target languages
   * const result = await transcribeAndTranslate(
   *   audioFile, 
   *   'es-MX', // Mexican Spanish
   *   'en-US'  // US English source
   * );
   * 
   * if (result) {
   *   console.log('Original:', result.original_transcript);
   *   console.log('Translated:', result.translated_text);
   *   console.log('Detected language:', result.detected_language);
   * }
   * ```
   */
  const transcribeAndTranslate = useCallback(async (
    audioFile: File,
    targetLanguage: string = 'en-IN', // Default to Indian English
    sourceLanguage: string = 'unknown' // Enable auto-detection by default
  ): Promise<TranscribeTranslateResult | null> => {
    setIsTranscribing(true); // Use transcribing state since this includes transcription
    setError(null);

    try {
      // Validate file input
      if (!audioFile) {
        throw new Error('Audio file is required');
      }
      
      if (audioFile.size === 0) {
        throw new Error('Audio file appears to be empty');
      }

      // Create FormData for the combined operation
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('target_language_code', targetLanguage);
      formData.append('language_code', sourceLanguage);

      // Call the combined API endpoint
      const response = await fetch('/api/transcribe-translate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to transcribe and translate audio`);
      }

      const result = await response.json();
      
      if (!result.data) {
        throw new Error('Invalid response format: missing data field');
      }
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred during transcription and translation';
      setError(errorMessage);
      console.error('Transcribe-translate error:', err);
      return null;
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  // Return object with all functions and state
  return {
    /** Function to transcribe audio files with optional speaker detection */
    transcribeAudio,
    
    /** Function to translate text between languages */
    translateText,
    
    /** Function to transcribe and translate audio in one operation */
    transcribeAndTranslate,
    
    /** Loading state for transcription operations (true while processing) */
    isTranscribing,
    
    /** Loading state for translation-only operations (true while processing) */
    isTranslating,
    
    /** Current error message or null if no error. Cleared on next operation. */
    error,
  };
};
