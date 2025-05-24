import React from 'react';

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Leistungen</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Service 1</h2>
            <p className="text-gray-600">Beschreibung des ersten Services.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Service 2</h2>
            <p className="text-gray-600">Beschreibung des zweiten Services.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 