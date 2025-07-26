import { useState, useCallback } from "react";

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(
    (onTranscript: (transcript: string) => void) => {
      if (typeof window === "undefined") return;

      if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
        alert("Speech recognition is not supported in your browser");
        return;
      }

      const SpeechRecognitionAPI =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognitionAPI();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    },
    []
  );

  return {
    isListening,
    startListening,
  };
};
