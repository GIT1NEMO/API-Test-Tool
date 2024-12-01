import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { getPaymentOptions } from '../services/respaxApi';
import { PaymentOptionsResponse } from '../types/respax';

export default function PaymentOptionsForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<PaymentOptionsResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [hostId, setHostId] = useState('SALES');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const result = await getPaymentOptions(hostId);
      setResponse(result);
      setError('');
      setStatus('success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setResponse(null);
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Options</h2>
        <p className="text-gray-600">View available payment options</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="hostId" className="block text-sm font-medium text-gray-700">
            Host ID
          </label>
          <input
            type="text"
            id="hostId"
            value={hostId}
            onChange={(e) => setHostId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
                   disabled:bg-blue-300 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading Payment Options...
            </>
          ) : (
            'Get Payment Options'
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
                <div className="ml-3 w-full">
                  <h3 className={`text-sm font-medium ${
                    status === 'success' ? 'text-green-800' : 
                    status === 'error' ? 'text-red-800' : 'text-gray-800'
                  }`}>
                    {status === 'success' ? 'Available Payment Options' : 'Error'}
                  </h3>
                  {status === 'success' && response?.payment_options && (
                    <div className="mt-2 space-y-4">
                      {response.payment_options.map((option, index) => (
                        <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{option.code}</h4>
                            {option.is_default && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {status === 'error' && (
                    <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                      {error}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}