import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User } from './types';
import { apiRequests } from '@/context/apiRequests';
import BusinessProfileSection from './BusinessProfileSection';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPendingDeletion, setIsPendingDeletion] = useState(false);
  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await apiRequests.get(`users/${id}`);
        setUser(response.data.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDisable = async () => {
    try {
      await apiRequests.post(`users/${id}/disable`);
      setUser(prevUser => prevUser ? { ...prevUser, user_status: 'disabled' } : null);
      setIsDisabled(true);
    } catch (err) {
      console.error("Error disabling user:", err);
      setActionError('Failed to disable user');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePendingDeletion = async () => {
    try {
      await apiRequests.delete(`users/${id}`);
      setUser(prevUser => prevUser ? { ...prevUser, user_status: 'disabled,pending_deletion' } : null);
      setIsPendingDeletion(true);
    } catch (err) {
      console.error("Error setting user to pending deletion:", err);
      setActionError('Failed to set user to pending deletion');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link 
          to="/users-list" 
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Users
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{user.full_name}</h1>
            <p className="text-gray-500">{user.first_name} {user.last_name}</p>
          </div>
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
            {user.account_types}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p>{capitalize(user.phone || 'Not provided')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p>{capitalize(user.physical_address || user.location || 'Not provided')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Seen</h3>
                <p>{capitalize(user.online_status)}</p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Account Details</h2>
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                <p>{capitalize(user.user_status || 'Active')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Joined</h3>
                <p>{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Profiles */}
        {user.seller && <BusinessProfileSection profile={user.seller} type="seller" />}
        {user.buyer && <BusinessProfileSection profile={user.buyer} type="buyer" />}

        {/* Social Media */}
        {(user.fb_username || user.twitter_username || user.linkedin_username || user.youtube_username) && (
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Social Media</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.fb_username && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Facebook</h3>
                  <p>{user.fb_username}</p>
                </div>
              )}
              {user.twitter_username && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Twitter</h3>
                  <p>{user.twitter_username}</p>
                </div>
              )}
              {user.linkedin_username && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">LinkedIn</h3>
                  <p>{user.linkedin_username}</p>
                </div>
              )}
              {user.youtube_username && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">YouTube</h3>
                  <p>{user.youtube_username}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          {!isDisabled && (
            <button
              onClick={handleDisable}
              className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
            >
              Disable User
            </button>
          )}
          {!isPendingDeletion && (
            <button
              onClick={handlePendingDeletion}
              className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
            >
              Set Pending Deletion
            </button>
          )}
        </div>
        {actionError && <div className="text-red-500 mt-4">{actionError}</div>}
      </div>
    </div>
  );
}