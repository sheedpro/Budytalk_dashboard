import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from './types';
import { apiRequests } from '@/context/apiRequests';

export default function PendingDeletionUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const capitalize = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchPendingDeletionUsers = async () => {
    try {
      const response = await apiRequests.get(`users/pending-deletion`);
      if (response.data && response.data.data) {
        // Handle both paginated and non-paginated responses
        const userData = Array.isArray(response.data.data) ? response.data.data : response.data.data.data || [];
        setUsers(userData);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error("Error fetching pending deletion users:", err);
      setError('Failed to fetch pending deletion users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDeletionUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Pending Deletion Users</h2>
      <div className="grid gap-4">
        {users.map(user => (
          <div 
            key={user.id} 
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{capitalize(user.full_name)}</h3>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Pending Deletion
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {capitalize(user.account_types)}
                </p>
                {user.seller && (
                  <p className="text-sm text-blue-600 mt-1">
                    Seller: {capitalize(user.seller.b_name)}
                  </p>
                )}
                {user.buyer && (
                  <p className="text-sm text-green-600 mt-1">
                    Buyer: {capitalize(user.buyer.b_name)}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Deletion Reason: {capitalize(user.deletion_reason)}
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                <Link
                  to={`/user/${user.id}`}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Pending deletion since: {formatDate(user.updated_at)}</p>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No pending deletion users found
          </div>
        )}
      </div>
    </div>
  );
}