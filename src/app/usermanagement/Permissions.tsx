import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequests } from "@/context/apiRequests";
import { Shield, Plus, Minus, Loader2 } from "lucide-react";

interface Permission {
  id: string;
  name: string;
}

export default function Permissions() {
  const { permissionName } = useParams<{ permissionName: string }>();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [roleName, setRoleName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const capitalize = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.get("permissions");
      return response.data.permissions;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch permissions"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addPermissionToRole = async (
    roleId: string,
    permissionId: string,
    permissions: { id: string; name: string }[]
  ) => {
    setLoading(true);
    try {
      // Find the permission name corresponding to the ID
      const permissionName = permissions.find(
        (p) => p.id === permissionId
      )?.name;

      const response = await apiRequests.post(
        `permissions/add/${roleId}`,
        {
          permissions: [permissionName], // Send permission name
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error adding permission to role:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to add permission to role"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removePermissionFromRole = async (
    roleId: string,
    permissions: string[],
    allPermissions: { id: string; name: string }[]
  ) => {
    setLoading(true);
    try {
      // Find the permission names corresponding to the IDs
      const permissionNames = permissions
        .map(
          (permissionId) =>
            allPermissions.find((p) => p.id === permissionId)?.name
        )
        .filter(Boolean);

      const response = await apiRequests.post(
        `permissions/remove/${roleId}`,
        {
          permissions: permissionNames, // Send permission names
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error removing permission from role:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove permission"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchRolePermissions = async (roleId: string) => {
    setLoading(true);
    try {
      const response = await apiRequests.get(`permissions/${roleId}`);
      return response.data.permissions;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch role permissions"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getRoleDetails = async (roleId: string) => {
    setLoading(true);
    try {
      const response = await apiRequests.get(`roles/${roleId}`);
      console.log("Role details fetched:", response.data); // Log role details
      return response.data;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch role details"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllPermissions = async () => {
      try {
        const allPermissions = await fetchPermissions();
        setPermissions(allPermissions);

        if (permissionName) {
          console.log(`Fetching permissions for role ID: ${permissionName}`); // Log role ID
          const rolePerms = await fetchRolePermissions(permissionName);
          setRolePermissions(rolePerms);

          // Fetch role details to get the role name
          const roleDetails = await getRoleDetails(permissionName);
          setRoleName(roleDetails.role.name); // Access the nested role object
          console.log("Role name set:", roleDetails.role.name); // Log role name
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllPermissions();
  }, [permissionName]);

  const handleAddPermission = async (permissionId: string) => {
    try {
      const roleId = permissionName; // Assuming permissionName is actually the roleId
      await addPermissionToRole(roleId!, permissionId, permissions);
      const updatedRolePermissions = await fetchRolePermissions(roleId!);
      setRolePermissions(updatedRolePermissions);
    } catch (error) {
      console.error("Error adding permission to role:", error);
      setError(error instanceof Error ? error.message : 'Failed to add permission');
    }
  };

  const handleRemovePermission = async (permissionId: string) => {
    try {
      const roleId = permissionName; // Assuming permissionName is actually the roleId
      await removePermissionFromRole(roleId!, [permissionId], permissions);
      const updatedRolePermissions = await fetchRolePermissions(roleId!);
      setRolePermissions(updatedRolePermissions);
    } catch (error) {
      console.error("Error removing permission from role:", error);
      setError(error instanceof Error ? error.message : 'Failed to remove permission');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading permissions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Role Permissions:{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
            {capitalize(roleName || '')}
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Role Permissions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Current Role Permissions
            </h2>
            <div className="space-y-2">
              {rolePermissions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No permissions assigned
                </p>
              ) : (
                rolePermissions.map((perm) => (
                  <div
                    key={perm.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md group hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-200">
                      {capitalize(perm.name)}
                    </span>
                    <button
                      onClick={() => handleRemovePermission(perm.id)}
                      className="flex items-center space-x-1 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700 dark:hover:text-red-300"
                    >
                      <Minus className="w-4 h-4" />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Available Permissions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Available Permissions
            </h2>
            <div className="space-y-2">
              {permissions
                .filter((p) => !rolePermissions.find((rp) => rp.id === p.id))
                .map((perm) => (
                  <div
                    key={perm.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md group hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-200">
                      {capitalize(perm.name)}
                    </span>
                    <button
                      onClick={() => handleAddPermission(perm.id)}
                      className="flex items-center space-x-1 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-green-700 dark:hover:text-green-300"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Add</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
