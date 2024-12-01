import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Calendar } from 'lucide-react';
import { checkTourAvailability } from '../services/respaxApi';
import { TourAvailabilityRequest } from '../types/respax';

export default function TourAvailabilityForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<string>('');
  const [formData, setFormData] = useState<TourAvailabilityRequest>({
    host_id: 'SALES',
    tour_code: 'CNRCITY',
    basis_id: 144,
    subbasis_id: 206,
    tour_date: new Date().toISOString().split('T')[0],
    tour_time_id: 149
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const result = await checkTourAvailability(formData);
      setResponse(JSON.stringify(result, null, 2));
      setStatus('success');
    } catch (error) {
      setResponse(error instanceof Error ? error.message : 'An error occurred');
      setStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('_id') ? parseInt(value) : value
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Tour Availability</h2>
        <p className="text-gray-600">Enter tour details to check availability</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="tour_code" className="block text-sm font-medium text-gray-700">
              Tour Code
            </label>
            <input
              type="text"
              id="tour_code"
              name="tour_code"
              value={formData.tour_code}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="tour_date" className="block text-sm font-medium text-gray-700">
              Tour Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="tour_date"
                name="tour_date"
                value={formData.tour_date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="basis_id" className="block text-sm font-medium text-gray-700">
                Basis ID
              </label>
              <input
                type="number"
                id="basis_id"
                name="basis_id"
                value={formData.basis_id}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="subbasis_id" className="block text-sm font-medium text-gray-700">
                Subbasis ID
              </label>
              <input
                type="number"
                id="subbasis_id"
                name="subbasis_id"
                value={formData.subbasis_id}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="tour_time_id" className="block text-sm font-medium text-gray-700">
              Tour Time ID
            </label>
            <input
              type="number"
              id="tour_time_id"
              name="tour_time_id"
              value={formData.tour_time_id}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
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
              Checking...
            </>
          ) : (
            'Check Availability'
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
                    {status === 'success' ? 'Availability Result' : 
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
      </form>
    </div>
  );
}