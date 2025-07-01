import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  User, 
  Search,
  ArrowUpDown} from 'lucide-react';
import { apiRequests } from '@/context/apiRequests';

function formatDate(dateString: string | number | Date) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortField, setSortField] = useState<'user' | 'event' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedEventTypes] = useState<string[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState("");

  interface AuditLog {
    id: string;
    user: string;
    user_type?: string;  // Add these fields
    user_id?: string;    // Add these fields
    event: string;
    auditable_type: string;
    created_at: string;
    ip_address: string;
    icon?: React.ComponentType;
  }
  

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);


  const getAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.get("audit-logs");
      return response.data;
    }catch (error){
      setError(error instanceof Error ? error.message : 'Failed to fetch logs');
      throw error;
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const logsWithUserNames = await getAuditLogs();
        console.log('Fetched audit logs:', logsWithUserNames); // Log the fetched data
        setAuditLogs(logsWithUserNames);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      }
    };

    fetchAuditLogs();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedLogs = [...auditLogs].sort((a, b) => {
    const compareValue = sortDirection === 'asc' ? 1 : -1;
    const aValue = String(a[sortField]).toLowerCase();
    const bValue = String(b[sortField]).toLowerCase();
    
    if (aValue < bValue) return -compareValue;
    if (aValue > bValue) return compareValue;
    return 0;
  });

  const filteredLogs = sortedLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEventType = 
      selectedEventTypes.length === 0 || 
      selectedEventTypes.includes(log.event);

    return matchesSearch && matchesEventType;
  });

  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  const handleSort = (field: 'user' | 'event' | 'created_at') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-8 py-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Audit Logs</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filter
          </button> */}
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <div className="bg-gray-50 dark:bg-gray-900">
              <div className="grid grid-cols-12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div 
                  className="col-span-3 flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort('user')}
                >
                  User <ArrowUpDown className={`h-4 w-4 ${sortField === 'user' ? 'text-green-500' : ''}`} />
                </div>
                <div 
                  className="col-span-7 flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort('event')}
                >
                  Action <ArrowUpDown className={`h-4 w-4 ${sortField === 'event' ? 'text-green-500' : ''}`} />
                </div>
                <div 
                  className="col-span-2 flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  Time <ArrowUpDown className={`h-4 w-4 ${sortField === 'created_at' ? 'text-green-500' : ''}`} />
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.map((log) => {
                const IconComponent = log.icon || User;
                return (
                  <div key={log.id} className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="col-span-3 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{log.user}</span>
                    </div>
                    <div className="col-span-7 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <IconComponent className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-gray-100">{log.event}</span>
                    </div>
                    
                    <div className="col-span-2 flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add Pagination Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, auditLogs.length)} of {auditLogs.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === index + 1
                    ? 'bg-green-500 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;

