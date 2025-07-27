import axios from "axios";

interface AssemblyAITranscriptionRequest {
  file: File | Buffer;
  speech_model?: string;
  language_code?: string;
  punctuate?: boolean;
  format_text?: boolean;
  speaker_labels?: boolean;
  speakers_expected?: number;
  boost_param?: 'low' | 'default' | 'high';
  redact_pii?: boolean;
  redact_pii_audio?: boolean;
  redact_pii_policies?: string[];
  sentiment_analysis?: boolean;
  auto_chapters?: boolean;
  entity_detection?: boolean;
  iab_categories?: boolean;
  content_safety?: boolean;
  auto_highlights?: boolean;
  summarization?: boolean;
  summary_model?: 'informative' | 'conversational' | 'catchy';
  summary_type?: 'bullets' | 'bullets_verbose' | 'gist' | 'headline' | 'paragraph';
  custom_spelling?: Array<{ from: string; to: string }>;
  word_boost?: string[];
  audio_start_from?: number;
  audio_end_at?: number;
  multichannel?: boolean;
  speech_threshold?: number;
}

interface AssemblyAITranscriptionResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  language_code: string;
  language_model: string;
  language_confidence: number;
  acoustic_model: string;
  text: string;
  words: Array<{
    confidence: number;
    start: number;
    end: number;
    text: string;
    speaker?: string;
  }>;
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
  confidence: number;
  audio_duration: number;
  punctuate: boolean;
  format_text: boolean;
  speech_model: string | null;
  webhook_url: string | null;
  webhook_status_code: number | null;
  webhook_auth: boolean;
  webhook_auth_header_name: string | null;
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
  audio_start_from?: number;
  audio_end_at?: number;
  word_boost?: string[];
  boost_param?: string;
  filter_profanity?: boolean;
  redact_pii?: boolean;
  redact_pii_audio?: boolean;
  redact_pii_audio_quality?: string;
  redact_pii_policies?: string[];
  redact_pii_sub?: string;
  speaker_labels?: boolean;
  speakers_expected?: number;
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
  chapters?: Array<{
    gist: string;
    headline: string;
    summary: string;
    start: number;
    end: number;
  }>;
  sentiment_analysis_results?: Array<{
    text: string;
    start: number;
    end: number;
    sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    confidence: number;
    speaker?: string;
  }>;
  entities?: Array<{
    entity_type: string;
    text: string;
    start: number;
    end: number;
  }>;
  summary?: string;
  custom_spelling?: Array<{ from: string; to: string }>;
  throttled?: boolean;
  error?: string;
}

interface AssemblyAIUploadResponse {
  upload_url: string;
}

class AssemblyAIService {
  private apiKey: string;
  private baseUrl = 'https://api.assemblyai.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      authorization: this.apiKey,
      'content-type': 'application/json',
    };
  }

  async uploadAudio(file: File | Buffer): Promise<string> {
    let audioData: Buffer;
    
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

  async startTranscription(audioUrl: string, options: Partial<AssemblyAITranscriptionRequest> = {}): Promise<AssemblyAITranscriptionResponse> {
    let languageCode = options.language_code;
    let languageDetection = false;
    
    if (!languageCode || languageCode === 'unknown') {
      languageDetection = true;
      languageCode = undefined;
    } else if (languageCode === 'en-US') {
      languageCode = 'en_us';
    }

    const data = {
      audio_url: audioUrl,
      speech_model: options.speech_model || 'universal',
      ...(languageCode && { language_code: languageCode }),
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
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

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
      console.log('Uploading audio file...');
      const audioUrl = await this.uploadAudio(file);

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

      console.log(`Polling for completion of job ${transcriptionJob.id}...`);
      const completedTranscription = await this.pollForCompletion(transcriptionJob.id);

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

const assemblyAI = new AssemblyAIService(process.env.ASSEMBLY_AI_API_KEY!);

export { assemblyAI, AssemblyAIService };
export type { 
  AssemblyAITranscriptionRequest, 
  AssemblyAITranscriptionResponse,
  AssemblyAIUploadResponse
};