import React, { useState, useEffect } from "react";
import { apiRequests } from "@/context/apiRequests";
import { useSearchParams } from "react-router-dom";
import { IMAGE_BASE_URL, PLACEHOLDER_IMAGE_URL } from "@/context/apiRequests";


const EditAdmin = () => {
  const [searchParams] = useSearchParams();
  const adminId = searchParams.get("adminId");
  
  const [admin, setAdmin] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    country: "",
    region: "",
    email: "",
    phone: "",
    location: "",
    picture: "",
    roles: [] as string[],
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateAdminDetails = async (
    adminId: string,
    details: { roles: string[]; status: string }
  ) => {
    setLoading(true);
    try {
      const response = await apiRequests.post('assign-role', {
        user_id: adminId,
        ...details
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error && (error as { response?: { data?: { message?: string } } }).response?.data) {
        console.error("Update admin details error details:", (error as unknown as { response: { data: any } }).response.data);
        setError((error as unknown as { response: { data: { message?: string } } }).response.data.message || 'Failed to update admin');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to update admin');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAdminDetails = async (adminId: string) => {
    setLoading(true);
    try {
      const response = await apiRequests.get(`admin-profile/${adminId}`);
      return response.data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error encountered in fetching admin details");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminId) return;

    const fetchAdmin = async () => {
      try {
        setLoading(true);
        console.log("Fetching admin details for ID:", adminId);
        const data = await getAdminDetails(adminId);
        console.log("Fetched admin data:", data);
        const roles = data.roles?.map((role: { name: string }) => role.name) || [];
        console.log("Extracted roles:", roles);
        setAdmin({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          country: data.country || "",
          region: data.region || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          picture: data.picture ? `${IMAGE_BASE_URL}${data.picture}` : PLACEHOLDER_IMAGE_URL,
          roles: roles,
          status: data.status || "",
        });
        setError("");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load admin details");
        } else {
          setError("Failed to load admin details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId]);

  const handleRoleChange = (role: string) => {
    setAdmin((prevAdmin) => {
      const roles = prevAdmin.roles.includes(role)
        ? prevAdmin.roles.filter((r) => r !== role)
        : [...prevAdmin.roles, role];
      return { ...prevAdmin, roles };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      console.log("Updating admin details with:", { roles: admin.roles, status: admin.status });
      if (adminId) {
        await updateAdminDetails(adminId, { roles: admin.roles, status: admin.status });
      } else {
        setError("Admin ID is missing");
      }
      setSuccess("Admin details updated successfully");
      setError("");
    } catch (err) {
      if (err instanceof Error && (err as { response?: { data?: { message?: string } } }).response?.data) {
        console.error("Update admin details error details:", (err as unknown as { response: { data: any } }).response.data);
        setError((err as unknown as { response: { data: { message?: string } } }).response.data.message || "Failed to update admin details");
      } else if (err instanceof Error) {
        setError(err.message || "Failed to update admin details");
      } else {
        setError("Failed to update admin details");
      }
      setSuccess("");
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

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-800 dark:border-gray-200 border-t-transparent"></div>
      </div>
    );
  }

  console.log("Rendered admin data:", admin);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full p-8 transition-all duration-300 mb-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 text-center mb-8 md:mb-0">
            <div className="relative group">
              <div className="relative w-48 h-48">
                <img
                  src={admin.picture || "/api/placeholder/300/300"}
                  alt="Profile Picture"
                  className="rounded-full w-48 h-48 object-cover border-4 border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:brightness-90"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {capitalizeFirstLetter(admin.first_name)} {capitalizeFirstLetter(admin.last_name)}
            </h1>
          </div>
          <div className="md:w-2/3 md:pl-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>
                <strong>First Name: </strong> {capitalizeFirstLetter(admin.first_name)}
              </li>
              <li>
                <strong>Last Name: </strong> {capitalizeFirstLetter(admin.last_name)}
              </li>
              <li>
                <strong>Date of Birth:</strong> {formatDate(admin.date_of_birth)}
              </li>
              <li>
                <strong>Gender:</strong> {capitalizeFirstLetter(admin.gender)}
              </li>
              <li>
                <strong>Country:</strong> {capitalizeFirstLetter(admin.country)}
              </li>
              <li>
                <strong>Region:</strong> {capitalizeFirstLetter(admin.region)}
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              {admin.email && (
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {admin.email}
                </li>
              )}
              {admin.phone && (
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 011.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {admin.phone}
                </li>
              )}
              {admin.region && (
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {capitalizeFirstLetter(admin.region)}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Admin Controls Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full p-8 transition-all duration-300">
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-800">
            {success}
          </div>
        )}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Admin Controls
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Roles Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: "user_accounts_manager", label: "User Accounts Manager" },
                { id: "product_stock_manager", label: "Product Stock Manager" },
                { id: "order_placement_manager", label: "Order Placement Manager" },
                { id: "order_fulfillment_manager", label: "Order Fulfillment Manager" },
                { id: "returns_refunds_manager", label: "Returns & Refunds Manager" },
                { id: "customer_success_manager", label: "Customer Success Manager" },
                { id: "promotions_loyalty_manager", label: "Promotions & Loyalty Manager" },
                { id: "content_editorial_manager", label: "Content & Editorial Manager" },
                { id: "general_manager", label: "General Manager" },
                { id: "super-admin", label: "Systems Manager" },
              ].map((role) => (
                <label
                  key={role.id}
                  className={`relative flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                    ${admin.roles.includes(role.id)
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={admin.roles.includes(role.id)}
                    onChange={() => handleRoleChange(role.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 mr-3 rounded border flex items-center justify-center
                        ${admin.roles.includes(role.id)
                          ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'
                          : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {admin.roles.includes(role.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`font-medium ${
                        admin.roles.includes(role.id)
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {role.label}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'active', label: 'Active', icon: '✓' },
                { id: 'inactive', label: 'Inactive', icon: '×' },
              ].map((status) => (
                <label
                  key={status.id}
                  className={`relative flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                    ${admin.status === status.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.id}
                    checked={admin.status === status.id}
                    onChange={(e) => setAdmin({ ...admin, status: e.target.value })}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 mr-3 rounded-full border flex items-center justify-center
                        ${admin.status === status.id
                          ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'
                          : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {admin.status === status.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className={`font-medium ${
                        admin.status === status.id
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {status.label}
                      </span>
                    </div>
                    <span className={`text-xl ${
                      admin.status === status.id
                        ? 'text-green-500 dark:text-green-400'
                        : 'text-gray-400 dark:text-gray-600'
                    }`}>
                      {status.icon}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-opacity-50 font-medium"
          >
            Update Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAdmin;