import { useState, useEffect } from 'react';
import { User } from './types';
import { apiRequests } from '@/context/apiRequests';
import { Users, Store, ShoppingBag, Search } from 'lucide-react';

export default function ListUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'seller' | 'buyer' | 'activeBuyer'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.get('users');
      
      if (response.data && response.data.data) {
        const userData = Array.isArray(response.data.data) ? response.data.data : response.data.data.data;
        if (Array.isArray(userData)) {
          return userData;
        } else {
          throw new Error('Invalid data format received from server: user data is not an array');
        }
      } else {
        throw new Error('Invalid data format received from server: missing data');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        const userList = await getAllUsers();
        setUsers(userList);
        setFilteredUsers(userList);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    // Apply role-based filtering
    if (activeFilter === 'seller') {
      result = result.filter(user => user.role === 'seller');
    } else if (activeFilter === 'buyer') {
      result = result.filter(user => user.role === 'buyer');
    } else if (activeFilter === 'activeBuyer') {
      result = result.filter(user => user.role === 'buyer' && user.user_status === 'active');
    }

    // Apply search term filtering
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user =>
        (user.full_name && user.full_name.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term))
      );
    }

    // Sort by created_at in descending order (newest first)
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredUsers(result);
  }, [users, activeFilter, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center ${
            activeFilter === 'all'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Users className="h-4 w-4 mr-2" />
          All Users
        </button>
        <button
          onClick={() => setActiveFilter('seller')}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center ${
            activeFilter === 'seller'
              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Store className="h-4 w-4 mr-2" />
          Farmer
        </button>
        <button
          onClick={() => setActiveFilter('buyer')}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center ${
            activeFilter === 'buyer'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Buyers
        </button>
        {/* 
        <button
          onClick={() => setActiveFilter('activeBuyer')}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center ${
            activeFilter === 'activeBuyer'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Active Buyers
        </button>
        */}
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Showing {filteredUsers.length} of {users.length} users
      </div>
      
      <div className="overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No users found matching your criteria</p>
          </div>
        ) : (
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr
                  key={user.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => window.location.href = `/user/${user.id}`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{user.full_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{user.email || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{user.physical_address || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}