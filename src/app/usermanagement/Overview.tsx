import { useEffect, useState } from "react";
import { apiRequests } from "@/context/apiRequests";
import { Users, UserPlus, UserMinus, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface Admin {
  full_name: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image_url: string | null;
  gender: string | null;
  country: string | null;
  region: string | null;
  verification_status: string | null;
  country_code: string | null;
  phone: string | null;
  date_of_birth: string | null;
  auth_code: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  last_seen_at: string | null;
  picture: string | null;
  roles: Array<{
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: {
      model_type: string;
      model_id: number;
      role_id: number;
    };
  }>;
  status: string; // Make status required
}

const capitalizeFirstLetter = (string: string | undefined | null) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function UserManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [deletingAdminId, setDeletingAdminId] = useState<number | null>(null);

  const getAllAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequests.get("all-admins");
      return response.data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch admins");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAdmin = async (adminId: number) => {
    setIsLoading(true);
    try {
      const response = await apiRequests.delete(`delete/${adminId}`);
      return response.data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete admin");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: number) => {
    if (!window.confirm("Are you sure you want to delete this administrator?")) {
      return;
    }

    try {
      setDeletingAdminId(adminId);
      const response = await deleteAdmin(adminId);

      if (response.status === "SUCCESS") {
        setAdmins(admins.filter((admin) => admin.id !== adminId));
        toast.success("Administrator deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete administrator");
      }
    } catch (error: any) {
      console.error("Delete admin error:", error);
      const errorMessage = error.message || "Failed to delete administrator";
      toast.error(errorMessage);
    } finally {
      setDeletingAdminId(null);
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllAdmins();
        console.log("API Response:", response);

        if (response && response.admins && Array.isArray(response.admins)) {
          const processedAdmins = response.admins.map((admin: any) => ({
            ...admin,
            full_name: `${admin.first_name} ${admin.last_name}` // Create full_name for display
          }));
          setAdmins(processedAdmins);
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Error fetching admins:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch administrators"
        );
        setAdmins([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleAddAdminClick = () => {
    navigate("/create-admin");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-2xl w-full">
          <h2 className="text-red-800 dark:text-red-200 text-lg font-semibold mb-2">
            Error Loading Administrators
          </h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900">
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
          Administrators Management
        </h1>
        <button
          onClick={handleAddAdminClick}
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-200 mx-auto"
        >
          <div className="flex items-center justify-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Add New User
          </div>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <div className="p-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Roles
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {admins.length > 0 ? (
                        admins.map((admin) => (
                          <tr
                            key={admin.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {admin.full_name || `${admin.first_name} ${admin.last_name}`}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {admin.phone || 'No phone'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {admin.email}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white flex flex-wrap">
                                {admin.roles && admin.roles.length > 0
                                  ? admin.roles.map((role, index) => (
                                      <span
                                        key={index}
                                        className="mr-2 mb-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs"
                                      >
                                        {capitalizeFirstLetter(role.name.replace(/_/g, ' '))}
                                      </span>
                                    ))
                                  : "No role assigned"}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  admin.status === "active"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                }`}
                              >
                                {capitalizeFirstLetter(admin.status)}
                              </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() =>
                                  navigate(`/edit-admin?adminId=${admin.id}`)
                                }
                                className="text-blue-600 dark:text-blue-400 w-11 hover:text-blue-900 dark:hover:text-blue-300 mr-4 transition-colors duration-200"
                              >
                                <UserCog className="w-5 h-5" />
                              </button>

                              <button
                                onClick={() => handleDeleteAdmin(admin.id)}
                                disabled={deletingAdminId === admin.id}
                                className={`text-red-600 dark:text-red-400 w-11 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200 ${
                                  deletingAdminId === admin.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                title="Delete Administrator"
                              >
                                {deletingAdminId === admin.id ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 dark:border-red-400"></div>
                                ) : (
                                  <UserMinus className="w-5 h-5" />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                          >
                            No administrators found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}