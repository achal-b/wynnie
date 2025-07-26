import { useState, useCallback, useRef } from "react";
import { useAssemblyAI } from "./use-assembly-ai";

type RecognitionMode = "browser" | "assembly";

interface SpeechRecognitionOptions {
  mode?: RecognitionMode;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxRecordingTime?: number; // in seconds
}

export const useEnhancedSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { transcribeAudio, isTranscribing, error } = useAssemblyAI();

  // Browser-based speech recognition (fallback)
  const startBrowserRecognition = useCallback(
    (
      onTranscript: (transcript: string) => void,
      options: SpeechRecognitionOptions = {}
    ) => {
      if (typeof window === "undefined") return;

      const SpeechRecognitionAPI =
        window.webkitSpeechRecognition || (window as any).SpeechRecognition;

      if (!SpeechRecognitionAPI) {
        setDebugInfo("Speech recognition not supported in this browser");
        alert(
          "Speech recognition is not supported in your browser. Please use Chrome, Safari, or Edge."
        );
        return;
      }

      setDebugInfo("Starting browser recognition...");

      const recognition = new SpeechRecognitionAPI();

      recognition.continuous = options.continuous || false;
      recognition.interimResults = options.interimResults || false;
      recognition.lang = options.language || "en-US";

      // Set maxAlternatives if supported
      if ("maxAlternatives" in recognition) {
        (recognition as any).maxAlternatives = 1;
      }

      recognition.onstart = () => {
        setIsListening(true);
        setLocalError(null); // Clear errors on successful start
        setDebugInfo("Browser recognition started - speak now");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        setDebugInfo(
          `Transcript: ${transcript} (confidence: ${(confidence * 100).toFixed(
            1
          )}%)`
        );
        onTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        setDebugInfo(`Browser recognition error: ${event.error}`);
        console.error("Speech recognition error:", event.error);
        setIsListening(false);

        if (event.error === "not-allowed") {
          setLocalError(
            "Microphone access denied. Please allow microphone permissions in your browser settings and try again."
          );
          setDebugInfo(
            "Microphone permission denied - check browser permissions"
          );
        } else if (event.error === "no-speech") {
          setDebugInfo("No speech detected. Please try again.");
        } else if (event.error === "network") {
          setLocalError(
            "Network error with browser speech recognition. Please try using Assembly AI mode instead."
          );
          setDebugInfo("Network error - consider switching to Assembly AI mode");
        } else {
          setLocalError(`Speech recognition error: ${event.error}. Please try Assembly AI mode.`);
          setDebugInfo(`Browser error: ${event.error} - consider Assembly AI mode`);
        }
      };

      recognition.onend = () => {
        setDebugInfo("Browser recognition ended");
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (error) {
        setDebugInfo(`Failed to start recognition: ${error}`);
        setIsListening(false);
      }
    },
    []
  );

  // Assembly AI-based speech recognition with recording
  const startAssemblyAIRecognition = useCallback(
    async (
      onTranscript: (transcript: string) => void,
      options: SpeechRecognitionOptions = {}
    ) => {
      try {
        setDebugInfo("Checking browser compatibility...");

        // Check for required APIs
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("getUserMedia not supported in this browser");
        }

        if (!window.MediaRecorder) {
          throw new Error("MediaRecorder not supported in this browser");
        }

        setDebugInfo("Requesting microphone access...");

        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 16000,
          },
        });

        setDebugInfo("Microphone access granted");
        streamRef.current = stream;
        audioChunksRef.current = [];

        // Check if MediaRecorder is supported
        if (!window.MediaRecorder) {
          throw new Error("MediaRecorder not supported");
        }

        // Setup MediaRecorder with Assembly AI compatible formats first
        let mimeType = "";
        const assemblyCompatibleTypes = [
          "audio/wav",
          "audio/mp3",
          "audio/mpeg",
          "audio/mp4",
          "audio/ogg",
          "audio/webm", // Without codec specification
        ];

        const allSupportedTypes = [
          ...assemblyCompatibleTypes,
          "audio/webm;codecs=opus",
          "audio/webm;codecs=vp8,opus",
          "audio/mp4;codecs=mp4a.40.2",
          "audio/ogg;codecs=opus",
        ];

        for (const type of allSupportedTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            mimeType = type;
            break;
          }
        }

        const mediaRecorder = new MediaRecorder(
          stream,
          mimeType ? { mimeType } : undefined
        );
        mediaRecorderRef.current = mediaRecorder;
        setDebugInfo(
          `MediaRecorder created with ${mimeType || "default"} type`
        );

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
            setDebugInfo(`Data chunk received: ${event.data.size} bytes`);
          }
        };

        mediaRecorder.onstop = async () => {
          setDebugInfo("Recording stopped, processing audio...");

          // Clean up MIME type for Assembly AI compatibility
          let cleanMimeType = mimeType || "audio/webm";
          if (cleanMimeType.includes("codecs=")) {
            cleanMimeType = cleanMimeType.split(";")[0];
          }

          const audioBlob = new Blob(audioChunksRef.current, {
            type: cleanMimeType,
          });

          setDebugInfo(`Audio blob created: ${audioBlob.size} bytes`);

          // Create audio file with proper extension and clean MIME type
          let fileName = "recording.webm";
          if (cleanMimeType.includes("mp4")) fileName = "recording.mp4";
          else if (cleanMimeType.includes("ogg")) fileName = "recording.ogg";
          else if (cleanMimeType.includes("wav")) fileName = "recording.wav";
          else if (
            cleanMimeType.includes("mp3") ||
            cleanMimeType.includes("mpeg")
          )
            fileName = "recording.mp3";

          const audioFile = new File([audioBlob], fileName, {
            type: cleanMimeType,
          });

          setIsRecording(false);
          setRecordingTime(0);

          // Stop all tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }

          try {
            setDebugInfo(
              `Sending ${fileName} (${cleanMimeType}) to Assembly AI...`
            );

            // Transcribe using Assembly AI
            const result = await transcribeAudio(audioFile, {
              language_code: options.language || "unknown",
            });

            if (result && result.transcript) {
              setDebugInfo(`Transcription received: ${result.transcript}`);

              // If language is not English, translate to English for product search
              if (
                result.language_code &&
                !result.language_code.startsWith("en")
              ) {
                // setDebugInfo(`Translating from ${result.language_code} to English...`);

                try {
                  const translationResponse = await fetch("/api/translate", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      input: result.transcript,
                      source_language_code: result.language_code,
                      target_language_code: "en-IN", // Use en-IN which is supported
                    }),
                  });

                  if (translationResponse.ok) {
                    const translationData = await translationResponse.json();
                    const englishText = translationData.data.translated_text;
                    setDebugInfo(`Translated to English: ${englishText}`);
                    onTranscript(englishText); // Use translated text
                  } else {
                    setDebugInfo(
                      `Translation failed, using original: ${result.transcript}`
                    );
                    onTranscript(result.transcript); // Fallback to original
                  }
                } catch (translationError) {
                  setDebugInfo(
                    `Translation error: ${
                      translationError instanceof Error
                        ? translationError.message
                        : "Unknown error"
                    }, using original: ${result.transcript}`
                  );
                  onTranscript(result.transcript); // Fallback to original
                }
              } else {
                // Already in English, use directly
                onTranscript(result.transcript);
              }
            } else {
              setDebugInfo("No transcript received from Assembly AI");
              // Fallback to browser recognition
              startBrowserRecognition(onTranscript, options);
            }
          } catch (transcriptionError) {
            const errorMessage =
              transcriptionError instanceof Error
                ? transcriptionError.message
                : "Unknown error";
            setDebugInfo(`Transcription error: ${errorMessage}`);
            console.error("Transcription error:", transcriptionError);

            // Check if it's a subscription/auth error - if so, fall back immediately
            if (
              errorMessage.includes("403") ||
              errorMessage.includes("Subscription not found")
            ) {
              setDebugInfo(
                "Assembly AI API subscription issue - falling back to browser recognition"
              );
            } else {
              setDebugInfo(
                "Assembly AI API error - falling back to browser recognition"
              );
            }

            // Fallback to browser recognition
            startBrowserRecognition(onTranscript, options);
          }
        };

        mediaRecorder.onerror = (event: any) => {
          setDebugInfo(`MediaRecorder error: ${event.error}`);
          console.error("MediaRecorder error:", event);
          setIsRecording(false);
          setIsListening(false);
        };

        // Start recording
        mediaRecorder.start(100); // Collect 100ms chunks
        setIsRecording(true);
        setIsListening(true);
        setDebugInfo("Recording started...");

        // Setup timer
        let seconds = 0;
        timerRef.current = setInterval(() => {
          seconds++;
          setRecordingTime(seconds);

          // Auto-stop after max time
          const maxTime = options.maxRecordingTime || 30;
          if (seconds >= maxTime) {
            setDebugInfo("Max recording time reached, stopping...");
            // Inline stop logic to avoid circular dependency
            if (
              mediaRecorderRef.current &&
              mediaRecorderRef.current.state !== "inactive"
            ) {
              mediaRecorderRef.current.stop();
            }
          }
        }, 1000);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setDebugInfo(`Error starting Assembly AI recognition: ${errorMessage}`);
        console.error("Error starting Assembly AI recognition:", err);
        setIsListening(false);
        setIsRecording(false);

        // Fallback to browser recognition
        if (
          errorMessage.includes("microphone") ||
          errorMessage.includes("permission")
        ) {
          alert(
            "Microphone access denied. Please allow microphone access and try again."
          );
        } else {
          startBrowserRecognition(onTranscript, options);
        }
      }
    },
    [transcribeAudio, startBrowserRecognition]
  );

  const stopRecording = useCallback(() => {
    setDebugInfo("Stopping recording...");

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsListening(false);
  }, [isRecording]);

  const startListening = useCallback(
    (
      onTranscript: (transcript: string) => void,
      options: SpeechRecognitionOptions = {}
    ) => {
      const mode = options.mode || "assembly"; // Default to Assembly AI for better language support

      // Clear any previous errors
      setLocalError(null);
      setDebugInfo(`Starting ${mode} recognition...`);

      if (mode === "assembly") {
        startAssemblyAIRecognition(onTranscript, options);
      } else {
        startBrowserRecognition(onTranscript, options);
      }
    },
    [startBrowserRecognition, startAssemblyAIRecognition]
  );

  const stopListening = useCallback(() => {
    if (isRecording) {
      stopRecording();
    }
    setIsListening(false);
    setDebugInfo("Stopped listening");
  }, [isRecording, stopRecording]);

  const retryWithAssemblyAI = useCallback((
    onTranscript: (transcript: string) => void,
    options: SpeechRecognitionOptions = {}
  ) => {
    setLocalError(null);
    setDebugInfo("Switching to Assembly AI mode...");
    startAssemblyAIRecognition(onTranscript, { ...options, mode: "assembly" });
  }, [startAssemblyAIRecognition]);

  return {
    isListening,
    isRecording,
    isTranscribing,
    recordingTime,
    error: localError || error, // Combine local and Assembly AI errors
    debugInfo, // Add debug info for troubleshooting
    startListening,
    stopListening,
    retryWithAssemblyAI, // New method to easily retry with Assembly AI
  };
};
