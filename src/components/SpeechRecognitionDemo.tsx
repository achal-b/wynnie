import React, { useState } from 'react';
import { useEnhancedSpeechRecognition } from '@/hooks/use-enhanced-speech-recognition';
import SpeechRecognitionError from '@/components/SpeechRecognitionError';

interface SpeechRecognitionDemoProps {
  onTranscript?: (transcript: string) => void;
}

export const SpeechRecognitionDemo: React.FC<SpeechRecognitionDemoProps> = ({
  onTranscript = (text) => console.log('Transcript:', text)
}) => {
  const [transcript, setTranscript] = useState<string>('');
  const [mode, setMode] = useState<'assembly' | 'browser'>('assembly');
  
  const {
    isListening,
    isRecording,
    isTranscribing,
    recordingTime,
    error,
    debugInfo,
    startListening,
    stopListening,
    retryWithAssemblyAI,
  } = useEnhancedSpeechRecognition();

  const handleStartListening = () => {
    setTranscript('');
    startListening((text) => {
      setTranscript(text);
      onTranscript(text);
    }, { mode });
  };

  const handleRetryWithAssemblyAI = () => {
    setTranscript('');
    retryWithAssemblyAI((text) => {
      setTranscript(text);
      onTranscript(text);
    });
  };

  const handleRetryWithBrowser = () => {
    setTranscript('');
    startListening((text) => {
      setTranscript(text);
      onTranscript(text);
    }, { mode: 'browser' });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Speech Recognition
      </h2>

      {/* Mode Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recognition Mode
        </label>
        <div className="flex space-x-3">
          <label className="flex items-center">
            <input
              type="radio"
              value="assembly"
              checked={mode === 'assembly'}
              onChange={(e) => setMode(e.target.value as 'assembly')}
              className="mr-2"
            />
            Assembly AI (Recommended)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="browser"
              checked={mode === 'browser'}
              onChange={(e) => setMode(e.target.value as 'browser')}
              className="mr-2"
            />
            Browser
          </label>
        </div>
      </div>

      {/* Error Display */}
      <SpeechRecognitionError
        error={error}
        debugInfo={debugInfo}
        onRetryWithAssemblyAI={handleRetryWithAssemblyAI}
        onRetryWithBrowser={handleRetryWithBrowser}
      />

      {/* Status Display */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="text-sm">
          <p><strong>Status:</strong> {
            isTranscribing ? 'Processing...' :
            isRecording ? 'Recording...' :
            isListening ? 'Listening...' : 'Ready'
          }</p>
          {isRecording && (
            <p><strong>Recording Time:</strong> {recordingTime}s</p>
          )}
          {debugInfo && (
            <p><strong>Debug:</strong> {debugInfo}</p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4 flex space-x-3">
        <button
          onClick={handleStartListening}
          disabled={isListening || isTranscribing}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isListening ? 'Listening...' : 'Start Listening'}
        </button>
        <button
          onClick={stopListening}
          disabled={!isListening && !isRecording}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Stop
        </button>
      </div>

      {/* Transcript Display */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transcript
        </label>
        <div className="p-3 border border-gray-300 rounded min-h-[80px] bg-gray-50">
          {transcript || 'Transcript will appear here...'}
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-gray-600">
        <p><strong>Tips:</strong></p>
        <ul className="list-disc list-inside mt-1">
          <li>Assembly AI mode is more accurate and reliable</li>
          <li>Make sure your microphone is enabled</li>
          <li>Speak clearly and avoid background noise</li>
          <li>Browser mode requires internet connection to Google servers</li>
        </ul>
      </div>
    </div>
  );
};

export default SpeechRecognitionDemo;
