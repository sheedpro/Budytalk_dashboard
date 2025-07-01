import React, { useState } from 'react';
import GeographicReport from './GeographicReport';

const GeographicReportWrapper: React.FC = () => {
  const [reportType, setReportType] = useState<'country' | 'region'>('country');

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-200">Geographic Distribution Reports</h1>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setReportType('country')}
              className={`px-4 py-2 rounded ${
                reportType === 'country' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Country Report
            </button>
            <button
              onClick={() => setReportType('region')}
              className={`px-4 py-2 rounded ${
                reportType === 'region' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Regional Report
            </button>
          </div>
        </div>
      </div>

      <GeographicReport reportType={reportType} />
    </div>
  );
};

export default GeographicReportWrapper;