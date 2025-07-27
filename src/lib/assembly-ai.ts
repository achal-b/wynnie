import axios from "axios";

/**
 * Configuration interface for AssemblyAI transcription requests.
 * Supports all major AssemblyAI features including speaker detection, 
 * AI-powered analysis, and content moderation.
 */
interface AssemblyAITranscriptionRequest {
  /** Audio file to transcribe (File object or Buffer) */
  file: File | Buffer;
  
  /** Speech recognition model to use. 'universal' works for most use cases, 'nano' for speed */
  speech_model?: string;
  
  /** Language code (e.g., 'en_us', 'es', 'fr'). Leave undefined for auto-detection */
  language_code?: string;
  
  /** Whether to add punctuation to the transcript (default: true) */
  punctuate?: boolean;
  
  /** Whether to format text with proper capitalization (default: true) */
  format_text?: boolean;
  
  /** Enable speaker identification and labeling in multi-speaker audio */
  speaker_labels?: boolean;
  
  /** Expected number of speakers (helps improve speaker detection accuracy) */
  speakers_expected?: number;
  
  /** Audio quality boost parameter - affects processing time vs accuracy tradeoff */
  boost_param?: 'low' | 'default' | 'high';
  
  /** Enable automatic redaction of personally identifiable information (PII) */
  redact_pii?: boolean;
  
  /** Also redact PII from the audio file itself, not just transcript */
  redact_pii_audio?: boolean;
  
  /** Specific PII types to redact (e.g., ['medical_condition', 'credit_card_number']) */
  redact_pii_policies?: string[];
  
  /** Enable AI-powered sentiment analysis on transcript segments */
  sentiment_analysis?: boolean;
  
  /** Automatically generate chapter summaries for long-form content */
  auto_chapters?: boolean;
  
  /** Detect and extract named entities (people, places, organizations) */
  entity_detection?: boolean;
  
  /** Classify content using Interactive Advertising Bureau (IAB) taxonomy */
  iab_categories?: boolean;
  
  /** Enable content safety analysis to detect harmful content */
  content_safety?: boolean;
  
  /** Generate key highlights and important moments from the transcript */
  auto_highlights?: boolean;
  
  /** Enable AI-powered summarization of the entire transcript */
  summarization?: boolean;
  
  /** Style of summary generation */
  summary_model?: 'informative' | 'conversational' | 'catchy';
  
  /** Format of the generated summary */
  summary_type?: 'bullets' | 'bullets_verbose' | 'gist' | 'headline' | 'paragraph';
  
  /** Custom spelling corrections to apply during transcription */
  custom_spelling?: Array<{ from: string; to: string }>;
  
  /** Keywords to boost recognition accuracy for domain-specific terms */
  word_boost?: string[];
  
  /** Start transcription from this timestamp (in milliseconds) */
  audio_start_from?: number;
  
  /** End transcription at this timestamp (in milliseconds) */
  audio_end_at?: number;
  
  /** Process multi-channel audio separately (for stereo recordings with distinct channels) */
  multichannel?: boolean;
  
  /** Confidence threshold for speech detection (0.0 to 1.0) */
  speech_threshold?: number;
}

/**
 * Complete response structure from AssemblyAI transcription API.
 * Contains the transcript, metadata, and results from any enabled AI features.
 */
interface AssemblyAITranscriptionResponse {
  /** Unique identifier for this transcription job */
  id: string;
  
  /** Current processing status of the transcription */
  status: 'queued' | 'processing' | 'completed' | 'error';
  
  /** Detected or specified language code */
  language_code: string;
  
  /** Language model used for transcription */
  language_model: string;
  
  /** Confidence score for language detection (0.0 to 1.0) */
  language_confidence: number;
  
  /** Acoustic model used for speech recognition */
  acoustic_model: string;
  
  /** Complete transcript text */
  text: string;
  
  /** Array of individual words with timestamps and confidence scores */
  words: Array<{
    confidence: number;
    start: number;
    end: number;
    text: string;
    speaker?: string;
  }>;
  
  /** Speaker-segmented utterances (only when speaker_labels is enabled) */
  utterances?: Array<{
    confidence: number;
    start: number;
    end: number;
    text: string;
    words: Array<{
      confidence: number;
      start: number;
      end: number;
      text: string;
      speaker?: string;
    }>;
    speaker: string;
  }>;
  
  /** Overall confidence score for the entire transcript */
  confidence: number;
  
  /** Duration of the audio file in seconds */
  audio_duration: number;
  
  /** Whether punctuation was applied */
  punctuate: boolean;
  
  /** Whether text formatting was applied */
  format_text: boolean;
  
  /** Speech model that was used */
  speech_model: string | null;
  
  /** Webhook URL if configured */
  webhook_url: string | null;
  
  /** HTTP status code of webhook delivery attempt */
  webhook_status_code: number | null;
  
  /** Whether webhook authentication was used */
  webhook_auth: boolean;
  
  /** Name of the webhook authentication header */
  webhook_auth_header_name: string | null;
  
  /** Results from auto-highlights feature */
  auto_highlights_result?: {
    status: 'success' | 'unavailable';
    results: Array<{
      count: number;
      rank: number;
      text: string;
      timestamps: Array<{
        start: number;
        end: number;
      }>;
    }>;
  };
  
  /** Audio segment start time if specified */
  audio_start_from?: number;
  
  /** Audio segment end time if specified */
  audio_end_at?: number;
  
  /** Word boost terms that were applied */
  word_boost?: string[];
  
  /** Boost parameter that was used */
  boost_param?: string;
  
  /** Whether profanity filtering was applied */
  filter_profanity?: boolean;
  
  /** Whether PII redaction was enabled */
  redact_pii?: boolean;
  
  /** Whether audio PII redaction was enabled */
  redact_pii_audio?: boolean;
  
  /** Quality of PII audio redaction */
  redact_pii_audio_quality?: string;
  
  /** PII redaction policies that were applied */
  redact_pii_policies?: string[];
  
  /** Substitution method used for PII redaction */
  redact_pii_sub?: string;
  
  /** Whether speaker labeling was enabled */
  speaker_labels?: boolean;
  
  /** Expected number of speakers that was specified */
  speakers_expected?: number;
  
  /** Results from content safety analysis */
  content_safety_labels?: {
    status: 'success' | 'unavailable';
    results: Array<{
      text: string;
      labels: Array<{
        label: string;
        confidence: number;
        severity: number;
      }>;
      sentences_idx_start: number;
      sentences_idx_end: number;
      timestamp: {
        start: number;
        end: number;
      };
    }>;
    summary: Record<string, number>;
    severity_score_summary: Record<string, Record<string, number>>;
  };
  
  /** Results from IAB content classification */
  iab_categories_result?: {
    status: 'success' | 'unavailable';
    results: Array<{
      text: string;
      labels: Array<{
        relevance: number;
        label: string;
      }>;
      timestamp: {
        start: number;
        end: number;
      };
    }>;
    summary: Record<string, number>;
  };
  
  /** Auto-generated chapters for long-form content */
  chapters?: Array<{
    gist: string;
    headline: string;
    summary: string;
    start: number;
    end: number;
  }>;
  
  /** Sentiment analysis results for transcript segments */
  sentiment_analysis_results?: Array<{
    text: string;
    start: number;
    end: number;
    sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    confidence: number;
    speaker?: string;
  }>;
  
  /** Named entities detected in the transcript */
  entities?: Array<{
    entity_type: string;
    text: string;
    start: number;
    end: number;
  }>;
  
  /** AI-generated summary of the entire transcript */
  summary?: string;
  
  /** Custom spelling corrections that were applied */
  custom_spelling?: Array<{ from: string; to: string }>;
  
  /** Whether the request was throttled due to rate limits */
  throttled?: boolean;
  
  /** Error message if transcription failed */
  error?: string;
}

/**
 * Response from AssemblyAI file upload endpoint.
 */
interface AssemblyAIUploadResponse {
  /** URL where the uploaded file can be accessed for transcription */
  upload_url: string;
}

/**
 * Service class for interacting with AssemblyAI's Speech-to-Text API.
 * Provides methods for uploading audio files, starting transcriptions,
 * and polling for completion with support for all AssemblyAI features.
 * 
 * @example
 * ```typescript
 * const service = new AssemblyAIService('your-api-key');
 * const result = await service.transcribeAudio({
 *   file: audioFile,
 *   speaker_labels: true,
 *   sentiment_analysis: true
 * });
 * console.log(result.text);
 * ```
 */
class AssemblyAIService {
  private apiKey: string;
  private baseUrl = 'https://api.assemblyai.com';

  /**
   * Creates a new AssemblyAI service instance.
   * @param apiKey - Your AssemblyAI API key from https://www.assemblyai.com/dashboard/
   */
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generates standard headers for AssemblyAI API requests.
   * @private
   * @returns Headers object with authorization and content-type
   */
  private getHeaders() {
    return {
      authorization: this.apiKey,
      'content-type': 'application/json',
    };
  }

  /**
   * Uploads an audio file to AssemblyAI's servers for transcription.
   * Accepts both File objects (from browser file inputs) and Node.js Buffers.
   * 
   * @param file - Audio file as File object or Buffer
   * @returns Promise resolving to the upload URL for use in transcription requests
   * @throws Error if upload fails or API key is invalid
   * 
   * @example
   * ```typescript
   * const uploadUrl = await service.uploadAudio(audioFile);
   * // Use uploadUrl in subsequent transcription request
   * ```
   */
  async uploadAudio(file: File | Buffer): Promise<string> {
    let audioData: Buffer;
    
    // Convert File object to Buffer for consistent handling
    if (file instanceof File) {
      audioData = Buffer.from(await file.arrayBuffer());
    } else {
      audioData = file;
    }

    const uploadResponse = await axios.post(
      `${this.baseUrl}/v2/upload`,
      audioData,
      {
        headers: {
          authorization: this.apiKey,
          'content-type': 'application/octet-stream',
        },
      }
    );

    return uploadResponse.data.upload_url;
  }

  /**
   * Initiates a transcription job with AssemblyAI.
   * Handles language detection logic and parameter validation.
   * 
   * @param audioUrl - URL of the uploaded audio file (from uploadAudio method)
   * @param options - Transcription configuration options
   * @returns Promise resolving to initial transcription response with job ID
   * @throws Error if API request fails or parameters are invalid
   * 
   * @example
   * ```typescript
   * const job = await service.startTranscription(audioUrl, {
   *   speaker_labels: true,
   *   language_code: 'en_us'
   * });
   * console.log('Job ID:', job.id);
   * ```
   */
  async startTranscription(audioUrl: string, options: Partial<AssemblyAITranscriptionRequest> = {}): Promise<AssemblyAITranscriptionResponse> {
    // Handle automatic language detection vs. explicit language specification
    let languageCode = options.language_code;
    let languageDetection = false;
    
    if (!languageCode || languageCode === 'unknown') {
      // Enable auto language detection when no language or "unknown" is specified
      languageDetection = true;
      languageCode = undefined; // Don't specify language_code when using auto-detection
    } else if (languageCode === 'en-US') {
      // Convert common format to Assembly AI format for backwards compatibility
      languageCode = 'en_us';
    }

    // Build request payload with sensible defaults
    const data = {
      audio_url: audioUrl,
      speech_model: options.speech_model || 'universal', // Universal model works best for most content
      ...(languageCode && { language_code: languageCode }), // Only include if we have a specific language
      language_detection: languageDetection,
      punctuate: options.punctuate !== undefined ? options.punctuate : true,
      format_text: options.format_text !== undefined ? options.format_text : true,
      speaker_labels: options.speaker_labels || false,
      speakers_expected: options.speakers_expected,
      boost_param: options.boost_param || 'default',
      redact_pii: options.redact_pii || false,
      redact_pii_audio: options.redact_pii_audio || false,
      redact_pii_policies: options.redact_pii_policies,
      sentiment_analysis: options.sentiment_analysis || false,
      auto_chapters: options.auto_chapters || false,
      entity_detection: options.entity_detection || false,
      iab_categories: options.iab_categories || false,
      content_safety: options.content_safety || false,
      auto_highlights: options.auto_highlights || false,
      summarization: options.summarization || false,
      summary_model: options.summary_model || 'informative',
      summary_type: options.summary_type || 'bullets',
      custom_spelling: options.custom_spelling,
      word_boost: options.word_boost,
      audio_start_from: options.audio_start_from,
      audio_end_at: options.audio_end_at,
      multichannel: options.multichannel || false,
      speech_threshold: options.speech_threshold || 0.5,
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/v2/transcript`,
        data,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Assembly AI transcription error:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        throw new Error(`Assembly AI API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  /**
   * Polls AssemblyAI API until transcription is completed or fails.
   * Uses exponential backoff to avoid overwhelming the API while ensuring
   * timely completion detection.
   * 
   * @param transcriptId - ID of the transcription job to monitor
   * @returns Promise resolving to completed transcription with all results
   * @throws Error if transcription fails or API becomes unreachable
   * 
   * @example
   * ```typescript
   * const result = await service.pollForCompletion(job.id);
   * if (result.status === 'completed') {
   *   console.log('Transcript:', result.text);
   * }
   * ```
   */
  async pollForCompletion(transcriptId: string): Promise<AssemblyAITranscriptionResponse> {
    const pollingEndpoint = `${this.baseUrl}/v2/transcript/${transcriptId}`;

    while (true) {
      const pollingResponse = await axios.get(pollingEndpoint, {
        headers: this.getHeaders(),
      });
      
      const transcriptionResult = pollingResponse.data;

      if (transcriptionResult.status === "completed") {
        return transcriptionResult;
      } else if (transcriptionResult.status === "error") {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      } else {
        // Wait 3 seconds before polling again to balance responsiveness with API courtesy
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  /**
   * Complete transcription workflow: upload, transcribe, and return results.
   * This is the main method most applications should use as it handles the entire
   * process from audio file to final transcript with all requested AI features.
   * 
   * @param request - Complete transcription configuration
   * @returns Promise resolving to full transcription results including AI analysis
   * @throws Error if any step of the process fails
   * 
   * @example
   * ```typescript
   * // Basic transcription
   * const result = await service.transcribeAudio({
   *   file: audioFile
   * });
   * 
   * // Advanced transcription with AI features
   * const advancedResult = await service.transcribeAudio({
   *   file: audioFile,
   *   speaker_labels: true,
   *   sentiment_analysis: true,
   *   auto_chapters: true,
   *   summarization: true,
   *   content_safety: true
   * });
   * 
   * console.log('Transcript:', result.text);
   * console.log('Summary:', result.summary);
   * console.log('Speakers:', result.utterances?.map(u => u.speaker));
   * ```
   */
  async transcribeAudio({
    file,
    speech_model = 'universal',
    language_code,
    punctuate = true,
    format_text = true,
    speaker_labels = false,
    speakers_expected,
    boost_param = 'default',
    redact_pii = false,
    redact_pii_audio = false,
    redact_pii_policies,
    sentiment_analysis = false,
    auto_chapters = false,
    entity_detection = false,
    iab_categories = false,
    content_safety = false,
    auto_highlights = false,
    summarization = false,
    summary_model = 'informative',
    summary_type = 'bullets',
    custom_spelling,
    word_boost,
    audio_start_from,
    audio_end_at,
    multichannel = false,
    speech_threshold = 0.5,
  }: AssemblyAITranscriptionRequest): Promise<AssemblyAITranscriptionResponse> {
    try {
      // Step 1: Upload the audio file to AssemblyAI's servers
      console.log('Uploading audio file...');
      const audioUrl = await this.uploadAudio(file);

      // Step 2: Start the transcription job with specified options
      console.log('Starting transcription job...');
      const transcriptionJob = await this.startTranscription(audioUrl, {
        speech_model,
        language_code,
        punctuate,
        format_text,
        speaker_labels,
        speakers_expected,
        boost_param,
        redact_pii,
        redact_pii_audio,
        redact_pii_policies,
        sentiment_analysis,
        auto_chapters,
        entity_detection,
        iab_categories,
        content_safety,
        auto_highlights,
        summarization,
        summary_model,
        summary_type,
        custom_spelling,
        word_boost,
        audio_start_from,
        audio_end_at,
        multichannel,
        speech_threshold,
      });

      // Step 3: Poll for completion and return comprehensive results
      console.log(`Polling for completion of job ${transcriptionJob.id}...`);
      const completedTranscription = await this.pollForCompletion(transcriptionJob.id);

      // Return the complete transcription response with all enabled features
      return {
        id: completedTranscription.id,
        status: completedTranscription.status,
        language_code: completedTranscription.language_code,
        language_model: completedTranscription.language_model,
        language_confidence: completedTranscription.language_confidence,
        acoustic_model: completedTranscription.acoustic_model,
        text: completedTranscription.text,
        words: completedTranscription.words,
        utterances: completedTranscription.utterances,
        confidence: completedTranscription.confidence,
        audio_duration: completedTranscription.audio_duration,
        punctuate: completedTranscription.punctuate,
        format_text: completedTranscription.format_text,
        speech_model: completedTranscription.speech_model,
        webhook_url: completedTranscription.webhook_url,
        webhook_status_code: completedTranscription.webhook_status_code,
        webhook_auth: completedTranscription.webhook_auth,
        webhook_auth_header_name: completedTranscription.webhook_auth_header_name,
        auto_highlights_result: completedTranscription.auto_highlights_result,
        audio_start_from: completedTranscription.audio_start_from,
        audio_end_at: completedTranscription.audio_end_at,
        word_boost: completedTranscription.word_boost,
        boost_param: completedTranscription.boost_param,
        filter_profanity: completedTranscription.filter_profanity,
        redact_pii: completedTranscription.redact_pii,
        redact_pii_audio: completedTranscription.redact_pii_audio,
        redact_pii_audio_quality: completedTranscription.redact_pii_audio_quality,
        redact_pii_policies: completedTranscription.redact_pii_policies,
        redact_pii_sub: completedTranscription.redact_pii_sub,
        speaker_labels: completedTranscription.speaker_labels,
        speakers_expected: completedTranscription.speakers_expected,
        content_safety_labels: completedTranscription.content_safety_labels,
        iab_categories_result: completedTranscription.iab_categories_result,
        chapters: completedTranscription.chapters,
        sentiment_analysis_results: completedTranscription.sentiment_analysis_results,
        entities: completedTranscription.entities,
        summary: completedTranscription.summary,
        custom_spelling: completedTranscription.custom_spelling,
        throttled: completedTranscription.throttled,
        error: completedTranscription.error,
      };
    } catch (error) {
      console.error('Error transcribing audio with Assembly AI:', error);
      throw error;
    }
  }
}

// Create singleton instance using environment variable
// Ensure ASSEMBLY_AI_API_KEY is set in your environment variables
const assemblyAI = new AssemblyAIService(process.env.ASSEMBLY_AI_API_KEY!);

export { assemblyAI, AssemblyAIService };
export type { 
  AssemblyAITranscriptionRequest, 
  AssemblyAITranscriptionResponse,
  AssemblyAIUploadResponse
};
