import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User } from "./types";
import { apiRequests } from "@/context/apiRequests";
import BusinessProfileSection from "./BusinessProfileSection";
import OrdersList from "./OrderList";
import { 
  ArrowLeft, Mail, Phone, MapPin, Clock, Calendar, 
  AlertCircle, User as UserIcon, Facebook, 
  Twitter, Linkedin, Youtube, Shield, Activity
} from 'lucide-react';

export default function UserDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPendingDeletion, setIsPendingDeletion] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const capitalize = (text: string | null | undefined): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await apiRequests.get(`users/${id}`);
        setUser(response.data.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDisable = async () => {
    try {
      await apiRequests.post(`users/${id}/disable`);
      setUser((prevUser) =>
        prevUser ? { ...prevUser, user_status: "disabled" } : null
      );
      setIsDisabled(true);
    } catch (err) {
      console.error("Error disabling user:", err);
      setActionError("Failed to disable user");
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
      setUser((prevUser) =>
        prevUser
          ? { ...prevUser, user_status: "disabled,pending_deletion" }
          : null
      );
      setIsPendingDeletion(true);
    } catch (err) {
      console.error("Error setting user to pending deletion:", err);
      setActionError("Failed to set user to pending deletion");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    if (status.includes("disabled") || status.includes("pending_deletion")) {
      return "bg-red-100 text-red-800";
    } else if (status === "active") {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-blue-100 text-blue-800";
    }
  };

  const getAccountTypeBadge = (type: string) => {
    switch(type.toLowerCase()) {
      case 'seller':
        return "bg-indigo-100 text-indigo-800";
      case 'buyer':
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-green-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
          <p className="text-green-800 text-lg font-medium">Loading user details...</p>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <Link to="/users-list" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Return to Users List
          </Link>
        </div>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-green-100">
        <div className="flex flex-col items-center">
          <UserIcon className="h-12 w-12 text-green-700 mb-4" />
          <p className="text-green-800 text-lg font-medium">User not found</p>
          <Link to="/users-list" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Return to Users List
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            to="/users-list"
            className="inline-flex items-center text-green-700 hover:text-green-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Users</span>
          </Link>
          
          <div className="flex space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getAccountTypeBadge(user.account_types)}`}>
              {capitalize(user.account_types)}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.user_status || "active")}`}>
              {capitalize(user.user_status || "Active")}
            </span>
          </div>
        </div>

        {/* User header section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-green-100">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center">
                <div className="bg-white p-3 rounded-full mr-5 shadow-md">
                  <UserIcon className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.full_name}</h1>
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 text-green-100 mr-2" />
                    <p className="text-green-100">{user.email}</p>
                  </div>
                  {user.phone && (
                    <div className="flex items-center mt-1">
                      <Phone className="w-4 h-4 text-green-100 mr-2" />
                      <p className="text-green-100">{user.phone}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <div className="text-green-100 text-sm mb-2">
                  <span className="font-medium">Member since:</span> {formatDate(user.created_at)}
                </div>
                <div className="flex space-x-2">
                  {!isDisabled && (
                    <button
                      onClick={handleDisable}
                      className="px-3 py-1.5 bg-white text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Disable User
                    </button>
                  )}
                  
                  {!isPendingDeletion && (
                    <button
                      onClick={handlePendingDeletion}
                      className="px-3 py-1.5 bg-white text-amber-600 text-sm font-medium rounded-md hover:bg-amber-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      Mark for Deletion
                    </button>
                  )}
                </div>
                {actionError && <div className="text-red-200 mt-2 text-sm">{actionError}</div>}
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-b border-green-100">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "profile"
                    ? "border-b-2 border-green-500 text-green-700"
                    : "text-gray-500 hover:text-green-700 hover:border-green-200"
                } transition-colors`}
              >
                Profile
              </button>
              {(user.seller || user.buyer) && (
                <button
                  onClick={() => setActiveTab("business")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "business"
                      ? "border-b-2 border-green-500 text-green-700"
                      : "text-gray-500 hover:text-green-700 hover:border-green-200"
                  } transition-colors`}
                >
                  Business Profiles
                </button>
              )}
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "orders"
                    ? "border-b-2 border-green-500 text-green-700"
                    : "text-gray-500 hover:text-green-700 hover:border-green-200"
                } transition-colors`}
              >
                Orders
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Information Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                <div className="flex items-center mb-4">
                  <UserIcon className="w-5 h-5 text-green-600 mr-2" />
                  <h2 className="text-lg font-semibold text-green-800">Basic Information</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="text-gray-900 font-medium">{capitalize(user.phone || "Not provided")}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="text-gray-900 font-medium">
                        {capitalize(user.physical_address || user.location || "Not provided")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Last Seen</h3>
                      <p className="text-gray-900 font-medium">{capitalize(user.online_status)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <h2 className="text-lg font-semibold text-green-800">Account Details</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(user.user_status || "active")}`}>
                          {capitalize(user.user_status || "Active")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Activity className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeBadge(user.account_types)}`}>
                          {user.account_types}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Joined</h3>
                      <p className="text-gray-900 font-medium">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="md:col-span-1">
              {(user.fb_username || user.twitter_username || user.linkedin_username || user.youtube_username) ? (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                  <div className="flex items-center mb-4">
                    <Globe className="w-5 h-5 text-green-600 mr-2" />
                    <h2 className="text-lg font-semibold text-green-800">Social Media</h2>
                  </div>
                  
                  <div className="space-y-5">
                    {user.fb_username && (
                      <div className="flex items-start">
                        <Facebook className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Facebook</h3>
                          <p className="text-gray-900 font-medium">{user.fb_username}</p>
                        </div>
                      </div>
                    )}
                    
                    {user.twitter_username && (
                      <div className="flex items-start">
                        <Twitter className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Twitter</h3>
                          <p className="text-gray-900 font-medium">{user.twitter_username}</p>
                        </div>
                      </div>
                    )}
                    
                    {user.linkedin_username && (
                      <div className="flex items-start">
                        <Linkedin className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">LinkedIn</h3>
                          <p className="text-gray-900 font-medium">{user.linkedin_username}</p>
                        </div>
                      </div>
                    )}
                    
                    {user.youtube_username && (
                      <div className="flex items-start">
                        <Youtube className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">YouTube</h3>
                          <p className="text-gray-900 font-medium">{user.youtube_username}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                  <div className="flex items-center mb-4">
                    <Globe className="w-5 h-5 text-green-600 mr-2" />
                    <h2 className="text-lg font-semibold text-green-800">Social Media</h2>
                  </div>
                  <p className="text-gray-500 italic">No social media profiles linked</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "business" && (
          <div className="space-y-8">
            {/* Business Profiles */}
            {user.seller && (
              <BusinessProfileSection profile={user.seller} type="seller" />
            )}
            
            {user.buyer && (
              <BusinessProfileSection profile={user.buyer} type="buyer" />
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center mb-6">
              <ShoppingBag className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-green-800">Orders History</h2>
            </div>
            <OrdersList userId={id} />
          </div>
        )}
      </div>
    </div>
  );
}

// Add missing icon imports
function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ShoppingBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}