import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { apiRequests } from '@/context/apiRequests';

// Interfaces
interface CountryData {
  address: string;
  user_count: number;
  business_type: string;
  country: string;
}

interface RegionData {
  full_address: string;
  region: string;
  user_count: number;
  avg_employees: number;
  business_type: string;
}

type ReportData = CountryData | RegionData;

interface GeographicReportProps {
  reportType: 'country' | 'region';
}

const GeographicReport: React.FC<GeographicReportProps> = ({ reportType }) => {
  const [data, setData] = useState<ReportData[]>([]);
  const [filteredData, setFilteredData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>('');
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    reportType === 'country'
      ? ['Country', 'Full Address', 'User Count', 'Business Type']
      : ['Region', 'Full Address', 'User Count', 'Avg Employees', 'Business Type']
  );

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = reportType === 'country'
        ? 'reports/geographic/country-distribution'
        : 'reports/geographic/regional-analysis';
      
      const response = await apiRequests.get(endpoint);
      
      // Extract the data from the response
      if (response && response.data && response.data.status === 'success' && response.data.data) {
        const responseData = response.data.data;
        
        if (Array.isArray(responseData)) {
          setData(responseData);
          setFilteredData(responseData);
          
          // Extract unique business types for the filter dropdown
          const types = [...new Set(responseData.map(item => item.business_type))].filter(Boolean);
          setBusinessTypes(types);
        } else {
          console.error('Unexpected data format:', responseData);
          setError('Invalid data format received from server. Expected an array.');
          setData([]);
          setFilteredData([]);
        }
      } else {
        setError('Empty or invalid response received from server');
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Failed to fetch data. Please try again later.');
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when reportType changes
  useEffect(() => {
    fetchData();
    
    // Update selected columns when report type changes
    setSelectedColumns(
      reportType === 'country'
        ? ['Country', 'Full Address', 'User Count', 'Business Type']
        : ['Region', 'Full Address', 'User Count', 'Avg Employees', 'Business Type']
    );
  }, [reportType]);

  // Apply filters when search term, business type, or data changes
  useEffect(() => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }
    
    let filtered = [...data];
    
    if (searchTerm) {
      filtered = filtered.filter(item => {
        if (reportType === 'country') {
          const countryItem = item as CountryData;
          return countryItem.country?.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          const regionItem = item as RegionData;
          return regionItem.region?.toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
    }
    
    if (businessTypeFilter) {
      filtered = filtered.filter(item => 
        item.business_type && item.business_type.toLowerCase() === businessTypeFilter.toLowerCase()
      );
    }
    
    setFilteredData(filtered);
  }, [searchTerm, businessTypeFilter, data, reportType]);

  const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
    if (!filteredData || filteredData.length === 0) {
      alert('No data to export');
      return;
    }

    const exportData = filteredData.map(item => {
      const row: { [key: string]: string | number | undefined } = {};
      selectedColumns.forEach(col => {
        if (reportType === 'country') {
          const countryItem = item as CountryData;
          switch (col) {
            case 'Country': row[col] = countryItem.country; break;
            case 'Full Address': row[col] = countryItem.address; break;
            case 'User Count': row[col] = countryItem.user_count; break;
            case 'Business Type': row[col] = countryItem.business_type; break;
          }
        } else {
          const regionItem = item as RegionData;
          switch (col) {
            case 'Region': row[col] = regionItem.region; break;
            case 'Full Address': row[col] = regionItem.full_address; break;
            case 'User Count': row[col] = regionItem.user_count; break;
            case 'Avg Employees': row[col] = regionItem.avg_employees?.toFixed(2); break;
            case 'Business Type': row[col] = regionItem.business_type; break;
          }
        }
      });
      return row;
    });

    if (type === 'csv') {
      const headers = selectedColumns.join(',');
      const rows = exportData.map(item =>
        selectedColumns.map(col => `"${item[col] ?? ''}"`).join(',')
      ).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadFile(blob, `${reportType}-report.csv`);
    } else if (type === 'excel') {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, reportType);
      XLSX.writeFile(wb, `${reportType}-report.xlsx`);
    } else if (type === 'pdf') {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [selectedColumns],
        body: exportData.map(item => selectedColumns.map(col => item[col] ?? '')),
      });
      doc.save(`${reportType}-report.pdf`);
    }
  };

  const downloadFile = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex justify-center items-center p-5 text-gray-700 dark:text-gray-200">Loading data...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400 my-5">Error: {error}</div>
        <button 
          className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
          onClick={fetchData}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-5 text-gray-700 dark:text-gray-200">
        {reportType === 'country' ? 'Country Distribution' : 'Regional Analysis'}
      </h1>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder={`Search ${reportType === 'country' ? 'Countries' : 'Regions'}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-48 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-700 rounded"
        />
        
        <select
          value={businessTypeFilter}
          onChange={(e) => setBusinessTypeFilter(e.target.value)}
          className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-700 rounded"
        >
          <option value="">All Business Types</option>
          {businessTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
        {['csv', 'excel', 'pdf'].map(exportType => (
          <button 
            key={exportType}
            onClick={() => handleExport(exportType as 'csv' | 'excel' | 'pdf')}
            className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
          >
            Export {exportType.toUpperCase()}
          </button>
        ))}
      </div>

      {filteredData && filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-700">
            <thead>
              <tr>
                {selectedColumns.map(col => (
                  <th key={col} className="border border-gray-400 dark:border-gray-700 p-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-200 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'}>
                  {selectedColumns.map(col => (
                    <td key={col} className="border border-gray-400 dark:border-gray-700 p-2">
                      {reportType === 'country' ? (
                        col === 'Country' ? (row as CountryData).country :
                        col === 'Full Address' ? (row as CountryData).address :
                        col === 'User Count' ? (row as CountryData).user_count :
                        col === 'Business Type' ? (row as CountryData).business_type : ''
                      ) : (
                        col === 'Region' ? (row as RegionData).region :
                        col === 'Full Address' ? (row as RegionData).full_address :
                        col === 'User Count' ? (row as RegionData).user_count :
                        col === 'Avg Employees' ? 
                          (typeof (row as RegionData).avg_employees === 'number' 
                            ? (row as RegionData).avg_employees.toFixed(2) 
                            : (row as RegionData).avg_employees) :
                        col === 'Business Type' ? (row as RegionData).business_type : ''
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-5 text-center text-gray-500 dark:text-gray-400">
          No data available. Please adjust your filters or try again later.
        </div>
      )}
    </div>
  );
};

export default GeographicReport;