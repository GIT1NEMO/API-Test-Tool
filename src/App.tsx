import React from 'react';
import ApiTestForm from './components/ApiTestForm';
import TourAvailabilityForm from './components/TourAvailabilityForm';
import TourExtrasForm from './components/TourExtrasForm';
import TourPriceRangeForm from './components/TourPriceRangeForm';
import PaxTypesForm from './components/PaxTypesForm';
import PaymentOptionsForm from './components/PaymentOptionsForm';
import ReservationForm from './components/ReservationForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">ResPax API Testing</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <ApiTestForm />
          <TourAvailabilityForm />
          <TourExtrasForm />
          <TourPriceRangeForm />
          <PaxTypesForm />
          <PaymentOptionsForm />
          <div className="md:col-span-2">
            <ReservationForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;