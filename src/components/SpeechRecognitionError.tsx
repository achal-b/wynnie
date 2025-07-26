import React from 'react';

interface SpeechRecognitionErrorProps {
  error: string | null;
  debugInfo: string;
  onRetryWithAssemblyAI?: () => void;
  onRetryWithBrowser?: () => void;
}

export const SpeechRecognitionError: React.FC<SpeechRecognitionErrorProps> = ({
  error,
  debugInfo,
  onRetryWithAssemblyAI,
  onRetryWithBrowser,
}) => {
  if (!error) return null;

  const isNetworkError = error.includes('network') || error.includes('Network');
  const isBrowserError = error.includes('browser') || error.includes('Browser');

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Speech Recognition Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
            {debugInfo && (
              <p className="mt-1 text-xs text-red-600">Debug: {debugInfo}</p>
            )}
          </div>
          
          {/* Suggested solutions */}
          <div className="mt-3">
            {isNetworkError && (
              <div className="text-sm text-red-700">
                <p className="font-medium">Suggested solutions:</p>
                <ul className="mt-1 list-disc list-inside">
                  <li>Check your internet connection</li>
                  <li>Try using Assembly AI mode (more reliable)</li>
                  <li>Refresh the page and try again</li>
                </ul>
              </div>
            )}
            
            {isBrowserError && (
              <div className="text-sm text-red-700">
                <p className="font-medium">Suggested solutions:</p>
                <ul className="mt-1 list-disc list-inside">
                  <li>Allow microphone permissions in your browser</li>
                  <li>Try using Assembly AI mode instead</li>
                  <li>Use Chrome, Safari, or Edge browser</li>
                </ul>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex space-x-3">
            {onRetryWithAssemblyAI && (
              <button
                onClick={onRetryWithAssemblyAI}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Try Assembly AI
              </button>
            )}
            {onRetryWithBrowser && (
              <button
                onClick={onRetryWithBrowser}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Retry Browser Mode
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechRecognitionError;
