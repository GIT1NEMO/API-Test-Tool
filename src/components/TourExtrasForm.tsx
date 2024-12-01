import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { getTourExtras } from '../services/respaxApi';
import { TourExtrasResponse } from '../types/respax';

export default function TourExtrasForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<TourExtrasResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    hostId: 'SALES',
    tourCode: 'CNRCITY',
    basisId: 144,
    subbasisId: 206,
    timeId: 149,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const result = await getTourExtras(
        formData.hostId,
        formData.tourCode,
        formData.basisId,
        formData.subbasisId,
        formData.timeId
      );
      setResponse(result);
      setError('');
      setStatus('success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setResponse(null);
      setStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Id') ? parseInt(value) : value,
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour Extras</h2>
        <p className="text-gray-600">Check available extras for a tour</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="hostId" className="block text-sm font-medium text-gray-700">
                Host ID
              </label>
              <input
                type="text"
                id="hostId"
                name="hostId"
                value={formData.hostId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="tourCode" className="block text-sm font-medium text-gray-700">
                Tour Code
              </label>
              <input
                type="text"
                id="tourCode"
                name="tourCode"
                value={formData.tourCode}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="basisId" className="block text-sm font-medium text-gray-700">
                Basis ID
              </label>
              <input
                type="number"
                id="basisId"
                name="basisId"
                value={formData.basisId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="subbasisId" className="block text-sm font-medium text-gray-700">
                Subbasis ID
              </label>
              <input
                type="number"
                id="subbasisId"
                name="subbasisId"
                value={formData.subbasisId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="timeId" className="block text-sm font-medium text-gray-700">
                Time ID
              </label>
              <input
                type="number"
                id="timeId"
                name="timeId"
                value={formData.timeId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
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
              Loading Extras...
            </>
          ) : (
            'Check Tour Extras'
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
                    {status === 'success' ? 'Available Extras' : 'Error'}
                  </h3>
                  {status === 'success' && response?.extras && (
                    <div className="mt-2 space-y-4">
                      {response.extras.map((extra) => (
                        <div key={extra.extra_id} className="bg-white p-4 rounded-md shadow-sm">
                          <h4 className="font-medium text-gray-900">{extra.name}</h4>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>Code: {extra.code}</div>
                            <div>Group: {extra.group}</div>
                            <div>Extra ID: {extra.extra_id}</div>
                            <div>Offset: {extra.offset}</div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {extra.allow_adult && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Adults
                              </span>
                            )}
                            {extra.allow_child && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Children
                              </span>
                            )}
                            {extra.allow_infant && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                Infants
                              </span>
                            )}
                          </div>
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