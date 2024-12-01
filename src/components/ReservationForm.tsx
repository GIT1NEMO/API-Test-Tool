import React, { useState, useEffect } from 'react';
import { Loader2, Calendar } from 'lucide-react';
import { writeReservation, getTourPriceRange, getTourExtras } from '../services/respaxApi';
import type { ReservationRequest, TourExtra, PriceRange } from '../types/respax';

interface PassengerCounts {
  adults: number;
  children: number;
  families: number;
}

interface PassengerDetails {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  extras: number[];
}

export default function ReservationForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [hostId] = useState('SALES');
  const [passengerCounts, setPassengerCounts] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    families: 0
  });
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails[]>([{
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    extras: []
  }]);
  const [availableExtras, setAvailableExtras] = useState<TourExtra[]>([]);
  const [priceInfo, setPriceInfo] = useState<PriceRange | null>(null);

  const [formData, setFormData] = useState<ReservationRequest>({
    voucher_num: 'TEST BOOKING',
    payment_option: 'comm-agent/bal-pob',
    general_comment: 'RON JSON REQUEST TEST BOOKING',
    agent_reference: 'Test ref',
    tickets: [{
      tour_code: 'CNRCITY',
      basis_id: '144',
      subbasis_id: '206',
      tour_time_id: '149',
      tour_date: new Date().toISOString().split('T')[0],
      passengers: [],
      transfers: {}
    }]
  });

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const result = await getTourPriceRange({
          host_id: hostId,
          tour_code: formData.tickets[0].tour_code,
          basis_id: parseInt(formData.tickets[0].basis_id),
          subbasis_id: parseInt(formData.tickets[0].subbasis_id),
          tour_date: formData.tickets[0].tour_date,
          tour_time_id: parseInt(formData.tickets[0].tour_time_id)
        });
        setPriceInfo(result.prices[0]);
      } catch (error) {
        console.error('Failed to fetch price range:', error);
      }
    };
    fetchPriceRange();
  }, [hostId, formData.tickets[0]]);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const result = await getTourExtras(
          hostId,
          formData.tickets[0].tour_code,
          parseInt(formData.tickets[0].basis_id),
          parseInt(formData.tickets[0].subbasis_id),
          parseInt(formData.tickets[0].tour_time_id)
        );
        setAvailableExtras(result.extras || []);
      } catch (error) {
        console.error('Failed to fetch extras:', error);
      }
    };
    fetchExtras();
  }, [hostId, formData.tickets[0]]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const passengers = passengerDetails.map((passenger, index) => ({
        first_name: passenger.firstName,
        last_name: passenger.lastName,
        email: passenger.email,
        mobile: passenger.mobile,
        type: index < passengerCounts.adults ? 1 : 
              index < passengerCounts.adults + passengerCounts.children ? 3 : 5,
        extras: passenger.extras
      }));

      const requestData = {
        ...formData,
        tickets: [{
          ...formData.tickets[0],
          passengers
        }]
      };

      await writeReservation(hostId, requestData);
      setStatus('success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setStatus('error');
    }
  };

  const handlePassengerChange = (index: number, field: keyof PassengerDetails, value: string | number[]) => {
    const newPassengers = [...passengerDetails];
    newPassengers[index] = {
      ...newPassengers[index],
      [field]: value
    };
    setPassengerDetails(newPassengers);
  };

  const calculateTotalPrice = () => {
    if (!priceInfo) return 0;

    let total = 0;
    total += passengerCounts.adults * priceInfo.adult_tour_sell;
    total += passengerCounts.children * priceInfo.child_tour_sell;
    total += passengerCounts.families * (priceInfo.udef1_tour_sell || 0);
    total += priceInfo.non_per_pax_sell || 0;

    return total;
  };

  const totalPassengers = passengerCounts.adults + passengerCounts.children + passengerCounts.families;

  useEffect(() => {
    // Update passenger details array when counts change
    const newPassengerDetails = Array(totalPassengers).fill(null).map((_, index) => 
      passengerDetails[index] || {
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        extras: []
      }
    );
    setPassengerDetails(newPassengerDetails);
  }, [totalPassengers]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Reservation</h2>
        <p className="text-gray-600">Book a tour with passenger details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ticket Details</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tour Code</label>
              <input
                type="text"
                value={formData.tickets[0].tour_code}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Tour Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.tickets[0].tour_date}
                  onChange={(e) => setFormData({
                    ...formData,
                    tickets: [{
                      ...formData.tickets[0],
                      tour_date: e.target.value
                    }]
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Adults</label>
              <select
                value={passengerCounts.adults}
                onChange={(e) => setPassengerCounts({
                  ...passengerCounts,
                  adults: parseInt(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Children</label>
              <select
                value={passengerCounts.children}
                onChange={(e) => setPassengerCounts({
                  ...passengerCounts,
                  children: parseInt(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Families</label>
              <select
                value={passengerCounts.families}
                onChange={(e) => setPassengerCounts({
                  ...passengerCounts,
                  families: parseInt(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {passengerDetails.map((passenger, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {index < passengerCounts.adults ? `Adult ${index + 1}` :
               index < passengerCounts.adults + passengerCounts.children ? `Child ${index - passengerCounts.adults + 1}` :
               `Family Member ${index - passengerCounts.adults - passengerCounts.children + 1}`}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={passenger.firstName}
                  onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={passenger.lastName}
                  onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={passenger.email}
                  onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <input
                  type="tel"
                  value={passenger.mobile}
                  onChange={(e) => handlePassengerChange(index, 'mobile', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {availableExtras.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Optional Extras</label>
                <div className="space-y-2">
                  {availableExtras.map((extra) => (
                    <label key={extra.extra_id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={passenger.extras.includes(extra.extra_id)}
                        onChange={(e) => {
                          const newExtras = e.target.checked
                            ? [...passenger.extras, extra.extra_id]
                            : passenger.extras.filter(id => id !== extra.extra_id);
                          handlePassengerChange(index, 'extras', newExtras);
                        }}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{extra.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {priceInfo && (
          <div className="bg-white shadow-lg rounded-lg p-6 border-2 border-blue-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Price Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Adults ({passengerCounts.adults})</span>
                <span className="font-medium">
                  {priceInfo.currency_symbol}{(passengerCounts.adults * priceInfo.adult_tour_sell).toFixed(2)}
                </span>
              </div>
              {passengerCounts.children > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Children ({passengerCounts.children})</span>
                  <span className="font-medium">
                    {priceInfo.currency_symbol}{(passengerCounts.children * priceInfo.child_tour_sell).toFixed(2)}
                  </span>
                </div>
              )}
              {passengerCounts.families > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Family Members ({passengerCounts.families})</span>
                  <span className="font-medium">
                    {priceInfo.currency_symbol}{(passengerCounts.families * (priceInfo.udef1_tour_sell || 0)).toFixed(2)}
                  </span>
                </div>
              )}
              {priceInfo.non_per_pax_sell > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Additional Fees</span>
                  <span className="font-medium">
                    {priceInfo.currency_symbol}{priceInfo.non_per_pax_sell.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {priceInfo.currency_symbol}{calculateTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
                   disabled:bg-blue-300 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Reservation...
            </>
          ) : (
            'Create Reservation'
          )}
        </button>

        {status === 'error' && (
          <div className="p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 bg-green-50 rounded-md">
            <p className="text-sm text-green-700">Reservation created successfully!</p>
          </div>
        )}
      </form>
    </div>
  );
}