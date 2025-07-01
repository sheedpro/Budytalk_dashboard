import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "../Users/types";
import { apiRequests } from "@/context/apiRequests";
import { X } from "lucide-react";
import { toast } from "react-toastify";

// Modal component for confirmation actions
interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onConfirm: () => void;
  actionText: string;
  reason: string;
  setReason: (reason: string) => void;
  showReasonInput?: boolean; // New prop to control reason input visibility
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
  showReasonInput = true, // Default to showing reason input
  buttonColor = "red",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {showReasonInput ? (
            <>
              <p className="mb-4 text-gray-600">
                Please provide a reason for this action:
              </p>
              <input
                type="text"
                placeholder="Enter reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              />
            </>
          ) : (
            <p className="mb-4 text-gray-600">
              Are you sure you want to {title.toLowerCase()}?
            </p>
          )}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 bg-${buttonColor}-600 text-white rounded-md hover:bg-${buttonColor}-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${buttonColor}-500`}
            >
              {actionText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ApproveDeletion() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDeletionModal, setShowCancelDeletionModal] = useState(false);
  const [showApproveDeletionModal, setShowApproveDeletionModal] = useState(false); // New state for approve deletion modal
  const [cancelDeletionReason, setCancelDeletionReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const capitalize = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

  const fetchPendingDeletionUsers = async () => {
    try {
      const response = await apiRequests.get(`users/pending-deletion`);
      if (response.data && response.data.data) {
        // Handle both paginated and non-paginated responses
        const userData = Array.isArray(response.data.data) ? response.data.data : response.data.data.data || [];
        setUsers(userData);
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error fetching pending deletion users:", err);
      setError("Failed to fetch pending deletion users");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchPendingDeletionUsers();
  }, []);

  const handleApproveDelete = async (userId: number) => {
    try {
      await apiRequests.post(`users/${userId}/approve-deletion`);
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deletion approved successfully");
    } catch (err) {
      console.error("Error approving deletion:", err);
      setError("Failed to approve deletion");
    }
  };

  const handleCancelDeletion = async () => {
    if (!selectedUserId) return;
    try {
      await apiRequests.post(`users/${selectedUserId}/disable`, {
        reason: cancelDeletionReason,
      });
      setUsers(users.filter((user) => user.id !== selectedUserId));
      setShowCancelDeletionModal(false);
      setCancelDeletionReason("");
      toast.success("User deletion cancelled successfully");
    } catch (err) {
      console.error("Error cancelling deletion:", err);
      setError("Failed to cancel deletion");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Pending Deletion Users</h2>
      <div className="grid gap-4">
        {users.map((user) => (
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
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
                <button
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setShowApproveDeletionModal(true); // Open approve deletion modal
                  }}
                  className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                >
                  Approve Deletion
                </button>
                <button
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setShowCancelDeletionModal(true);
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                >
                  Cancel Deletion
                </button>
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

      {/* Cancel Deletion Modal */}
      <ActionModal
        isOpen={showCancelDeletionModal}
        onClose={() => {
          setShowCancelDeletionModal(false);
          setError(null);
          setCancelDeletionReason("");
        }}
        title="Cancel User Deletion"
        onConfirm={handleCancelDeletion}
        actionText="Cancel Deletion"
        reason={cancelDeletionReason}
        setReason={setCancelDeletionReason}
        showReasonInput={true}
        buttonColor="blue"
      />

      {/* Approve Deletion Modal */}
      <ActionModal
        isOpen={showApproveDeletionModal}
        onClose={() => {
          setShowApproveDeletionModal(false);
          setError(null);
          setSelectedUserId(null); // Reset selected user
        }}
        title="Approve User Deletion"
        onConfirm={() => {
          if (selectedUserId) {
            handleApproveDelete(selectedUserId); // Call approve deletion
            setShowApproveDeletionModal(false);
            setSelectedUserId(null);
          }
        }}
        actionText="Approve Deletion"
        reason="" // Not used, but required by ActionModal
        setReason={() => {}} // Empty function, as reason is not needed
        showReasonInput={false} // Hide reason input
        buttonColor="red"
      />
    </div>
  );
}