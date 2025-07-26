interface TranslationRequest {
  input: string;
  source_language_code: string;
  target_language_code: string;
  speaker_id?: string;
  model?: string;
  enable_preprocessing?: boolean;
}

interface TranslationResponse {
  translated_text: string;
}

class TranslationService {
  /**
   * Translate text using OpenAI API
   */
  async translateText({
    input,
    source_language_code,
    target_language_code,
    speaker_id,
    model = 'gpt-3.5-turbo',
    enable_preprocessing = true,
  }: TranslationRequest): Promise<TranslationResponse> {
    try {
      // If source and target languages are the same, return original text
      if (source_language_code === target_language_code) {
        return { translated_text: input };
      }

      // Language code mapping for better prompts
      const languageNames: Record<string, string> = {
        'en': 'English',
        'en-US': 'English',
        'en-IN': 'English',
        'hi': 'Hindi',
        'hi-IN': 'Hindi',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'bn': 'Bengali',
        'te': 'Telugu',
        'ta': 'Tamil',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'pa': 'Punjabi',
        'or': 'Odia',
        'unknown': 'auto-detected language',
      };

      const sourceLang = languageNames[source_language_code] || source_language_code;
      const targetLang = languageNames[target_language_code] || target_language_code;

      const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. 
      Only return the translated text, nothing else.
      
      Text to translate: "${input}"`;

      // Use fetch to call OpenAI API directly since we don't have the ai package
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.1, // Low temperature for consistent translations
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.choices[0]?.message?.content?.trim() || input;

      return { translated_text: translatedText };
    } catch (error) {
      console.error('Error translating text:', error);
      // Fallback: return original text if translation fails
      return { translated_text: input };
    }
  }

  /**
   * Detect language of text using OpenAI
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      const prompt = `Detect the language of the following text and return only the ISO 639-1 language code (e.g., "en", "hi", "es", etc.):

      Text: "${text}"`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 10,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const detectedLanguage = data.choices[0]?.message?.content?.trim() || 'en';

      return detectedLanguage;
    } catch (error) {
      console.error('Error detecting language:', error);
      return 'en'; // Default to English
    }
  }
}

// Create singleton instance
const translationService = new TranslationService();

export { translationService, TranslationService };
export type { TranslationRequest, TranslationResponse };
