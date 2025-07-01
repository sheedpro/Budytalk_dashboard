import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequests } from "@/context/apiRequests";

interface Admin {
  id: string; // Could be number based on payload, adjust if needed
  first_name: string; // Added from payload
  last_name: string;  // Added from payload
  full_name: string;  // Computed field
  roles: { name: string }[];
  last_seen_at: string | null;
  status: string;
}

export default function RoleDetails() {
  const { roleName } = useParams<{ roleName: string }>();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const capitalize = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : '');

  const getAllAdmins = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.get("all-admins");
      return response.data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch admins");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAllAdmins();
        // Process admins to add full_name from first_name and last_name
        const processedAdmins = data.admins.map((admin: any) => ({
          ...admin,
          full_name: `${admin.first_name} ${admin.last_name}`,
        }));
        // Filter admins based on roleName
        const filteredAdmins = processedAdmins.filter((admin: Admin) =>
          admin.roles.some((role) => role.name === roleName)
        );
        setAdmins(filteredAdmins);
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [roleName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Users with Role: {capitalize(roleName || '')}
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Admin
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Last Seen
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{admin.full_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {admin.last_seen_at || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {capitalize(admin.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}