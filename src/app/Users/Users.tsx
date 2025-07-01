import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User } from "./types";
import { apiRequests } from "@/context/apiRequests";
import BusinessProfileSection from "./BusinessProfileSection";
import OrdersList from "./OrderList";
import {
  ArrowLeft, Mail, Phone, MapPin, Clock, Calendar,
  AlertCircle, User as UserIcon, Facebook,
  Twitter, Linkedin, Youtube, Shield, Activity, X
} from 'lucide-react';
import { toast } from 'react-toastify';

// Modal component for confirmation actions
interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onConfirm: () => void;
  actionText: string;
  reason: string;
  setReason: (reason: string) => void;
  buttonColor?: string;
}

const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  title,
  onConfirm,
  actionText,
  reason,
  setReason,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="mb-4 text-gray-600 dark:text-gray-300">Please provide a reason for this action:</p>
          <input
            type="text"
            placeholder="Enter reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              {actionText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UserDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setActionError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPendingDeletion, setIsPendingDeletion] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [disableReason, setDisableReason] = useState("");
  const [deletionReason, setDeletionReason] = useState("");

  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);

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
    if (!disableReason) {
      setActionError("Reason is required to disable user");
      return;
    }
    try {
      await apiRequests.post(`users/${id}/disable`, { reason: disableReason });
      setUser((prevUser) =>
        prevUser ? { ...prevUser, user_status: "disabled" } : null
      );
      setIsDisabled(true);
      setShowDisableModal(false);
      toast.success("User disabled successfully");
    } catch (err) {
      console.error("Error disabling user:", err);
      setActionError("Failed to disable user");
    }
  };

  const handlePendingDeletion = async () => {
    if (!deletionReason) {
      setActionError("Reason is required to mark user for deletion");
      return;
    }
    try {
      await apiRequests.post(`users/${id}/delete`, { reason: deletionReason });
      setUser((prevUser) =>
        prevUser
          ? { ...prevUser, user_status: "disabled,pending_deletion" }
          : null
      );
      setIsPendingDeletion(true);
      setShowDeletionModal(false);
      toast.success("User deletion requested successfully");
    } catch (err) {
      console.error("Error setting user to pending deletion:", err);
      setActionError("Failed to set user to pending deletion");
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

  const getStatusBadgeColor = (status: string) => {
    if (status.includes("disabled") || status.includes("pending_deletion")) {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    } else if (status === "active") {
      return "bg-[#e9d8f0] text-[#50266f] dark:bg-[#50266f] dark:text-[#d9c4e6]";
    } else {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getAccountTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "seller":
        return "bg-[#e9d8f0] text-[#50266f] dark:bg-[#50266f] dark:text-[#d9c4e6]";
      case "buyer":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#50266f] dark:border-[#d9c4e6] mb-4"></div>
          <p className="text-purple-800 dark:text-purple-300 text-lg font-medium">Loading user details...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-red-100 dark:border-red-900">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
          <p className="text-red-600 dark:text-red-400 text-lg font-medium">{error}</p>
          <Link to="/users-list" className="mt-4 px-4 py-2 bg-purple-600 text-white dark:bg-purple-700 dark:hover:bg-purple-800 rounded-md hover:bg-purple-700 transition-colors">
            Return to Users List
          </Link>
        </div>
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center">
          <UserIcon className="h-12 w-12 text-purple-700 dark:text-purple-500 mb-4" />
          <p className="text-purple-800 dark:text-purple-300 text-lg font-medium">User not found</p>
          <Link to="/users-list" className="mt-4 px-4 py-2 bg-purple-600 text-white dark:bg-purple-700 dark:hover:bg-purple-800 rounded-md hover:bg-purple-700 transition-colors">
            Return to Users List
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            to="/users-list"
            className="inline-flex items-center text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors font-medium"
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8 border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-[#50266f] to-[#d9c4e6] px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-full mr-5 shadow-md">
                  <UserIcon className="w-12 h-12 text-[#50266f] dark:text-[#d9c4e6]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.full_name}</h1>
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 text-[#d9c4e6] mr-2" />
                    <p className="text-[#d9c4e6]">{user.email}</p>
                  </div>
                  {user.phone && (
                    <div className="flex items-center mt-1">
                      <Phone className="w-4 h-4 text-[#d9c4e6] mr-2" />
                      <p className="text-[#d9c4e6]">{user.phone}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {!isDisabled && (
                  <button
                    onClick={() => setShowDisableModal(true)}
                    className="px-3 py-1.5 bg-white dark:bg-gray-700 text-[#50266f] dark:text-[#d9c4e6] text-sm font-medium rounded-md hover:bg-[#e9d8f0] dark:hover:bg-[#50266f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#50266f]"
                  >
                    Disable User
                  </button>
                )}

                {!isPendingDeletion && (
                  <button
                    onClick={() => setShowDeletionModal(true)}
                    className="px-3 py-1.5 bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 text-sm font-medium rounded-md hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Mark for Deletion
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 text-sm font-medium ${activeTab === "profile"
                  ? "border-b-2 border-[#50266f] text-[#50266f] dark:text-[#d9c4e6]"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#50266f] dark:hover:text-[#d9c4e6] hover:border-gray-200 dark:hover:border-gray-600"
                  } transition-colors`}
              >
                Profile
              </button>
              {(user.seller || user.buyer) && (
                <button
                  onClick={() => setActiveTab("business")}
                  className={`px-6 py-4 text-sm font-medium ${activeTab === "business"
                    ? "border-b-2 border-[#50266f] text-[#50266f] dark:text-[#d9c4e6]"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#50266f] dark:hover:text-[#d9c4e6] hover:border-gray-200 dark:hover:border-gray-600"
                    } transition-colors`}
                >
                  Business Profiles
                </button>
              )}
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-6 py-4 text-sm font-medium ${activeTab === "orders"
                  ? "border-b-2 border-[#50266f] text-[#50266f] dark:text-[#d9c4e6]"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#50266f] dark:hover:text-[#d9c4e6] hover:border-gray-200 dark:hover:border-gray-600"
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <UserIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Basic Information</h2>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                      <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                      <p className="text-gray-900 dark:text-white font-medium">{capitalize(user.phone || "Not provided")}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</h3>
                      <p className="text-gray-900 dark:text-white font-medium">{capitalize(user.age?.toString() || "Not provided")}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Income</h3>
                      <p className="text-gray-900 dark:text-white font-medium">Ugx. {capitalize(user.income || "Not provided")}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Education</h3>
                      <p className="text-gray-900 dark:text-white font-medium">{capitalize(user.education || "Not provided")}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</h3>
                      <p className="text-gray-900 dark:text-white font-medium">{capitalize(user.gender || "Not provided")}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {capitalize(user.physical_address || user.location || "Not provided")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Seen</h3>
                      <p className="text-gray-900 dark:text-white font-medium">{capitalize(user.online_status)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details Card */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Account Details</h2>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</h3>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(user.user_status || "active")}`}>
                          {capitalize(user.user_status || "Active")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Activity className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</h3>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeBadge(user.account_types)}`}>
                          {capitalize(user.account_types)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined</h3>
                      <p className="text-gray-900 dark:text-white font-medium">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="md:col-span-1">
              {(user.fb_username || user.twitter_username || user.linkedin_username || user.youtube_username) ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Social Media</h2>
                  </div>

                  <div className="space-y-5">
                    {user.fb_username && (
                      <div className="flex items-start">
                        <Facebook className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Facebook</h3>
                          <p className="text-gray-900 dark:text-white font-medium">{user.fb_username}</p>
                        </div>
                      </div>
                    )}

                    {user.twitter_username && (
                      <div className="flex items-start">
                        <Twitter className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter</h3>
                          <p className="text-gray-900 dark:text-white font-medium">{user.twitter_username}</p>
                        </div>
                      </div>
                    )}

                    {user.linkedin_username && (
                      <div className="flex items-start">
                        <Linkedin className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">LinkedIn</h3>
                          <p className="text-gray-900 dark:text-white font-medium">{user.linkedin_username}</p>
                        </div>
                      </div>
                    )}

                    {user.youtube_username && (
                      <div className="flex items-start">
                        <Youtube className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">YouTube</h3>
                          <p className="text-gray-900 dark:text-white font-medium">{user.youtube_username}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Social Media</h2>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 italic">No social media profiles linked</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "business" && (
          <div className="space-y-8">
            {user.seller && (
              <BusinessProfileSection profile={user.seller} type="seller" />
            )}

            {user.buyer && (
              <BusinessProfileSection profile={user.buyer} type="buyer" />
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <ShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Orders History</h2>
            </div>
            <OrdersList userId={id} />
          </div>
        )}
      </div>

      <ActionModal
        isOpen={showDisableModal}
        onClose={() => {
          setShowDisableModal(false);
          setActionError(null);
        }}
        title="Disable User Account"
        onConfirm={handleDisable}
        actionText="Disable Account"
        reason={disableReason}
        setReason={setDisableReason}
        buttonColor="red"
      />

      <ActionModal
        isOpen={showDeletionModal}
        onClose={() => {
          setShowDeletionModal(false);
          setActionError(null);
        }}
        title="Mark User for Deletion"
        onConfirm={handlePendingDeletion}
        actionText="Request Deletion"
        reason={deletionReason}
        setReason={setDeletionReason}
        buttonColor="amber"
      />
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