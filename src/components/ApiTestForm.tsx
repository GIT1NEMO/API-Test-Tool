import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { pingServer } from '../services/respaxApi';

export default function ApiTestForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<string>('');

  const handleTestConnection = async () => {
    setStatus('loading');
    try {
      const result = await pingServer();
      setResponse(JSON.stringify(result, null, 2));
      setStatus('success');
    } catch (error) {
      setResponse(error instanceof Error ? error.message : 'An error occurred');
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ResPax API Test</h1>
        <p className="text-gray-600">Test your connection to the ResPax API</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <button
          onClick={handleTestConnection}
          disabled={status === 'loading'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
                   disabled:bg-blue-300 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Test Connection'
          )}
        </button>

        {status !== 'idle' && (
          <div className="mt-4">
            <div className={`p-4 rounded-md ${
              status === 'success' ? 'bg-green-50' : 
              status === 'error' ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <div className="flex items-start">
                {status === 'success' && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                )}
                {status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                )}
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    status === 'success' ? 'text-green-800' : 
                    status === 'error' ? 'text-red-800' : 'text-gray-800'
                  }`}>
                    {status === 'success' ? 'Success' : 
                     status === 'error' ? 'Error' : 'Response'}
                  </h3>
                  <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                    {response}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}