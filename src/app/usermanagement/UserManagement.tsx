import { useEffect, useState } from "react";
import { UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRequests } from "@/context/apiRequests";
import { formatTimeDifference } from "@/lib/formatTime";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  interface Admin {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    roles: { name: string }[];
    last_seen_at: string | null;
    status: string;
    full_name: string;
  }

  interface Role {
    name: string;
    userCount: number;
  }

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeAdmins = admins.filter((admin) => admin.status === "active");

  const capitalize = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

  const getAllAdmins = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.get("all-admins");
      console.log("API Response:", response);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch admins");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAllAdmins();
        console.log("Raw API Data:", data);

        // Process admins to add full_name, but keep the status from the API
        const processedAdmins = data.admins.map((admin: any) => ({
          ...admin,
          full_name: `${admin.first_name} ${admin.last_name}`
        }));

        console.log("Processed Admins:", processedAdmins);
        setAdmins(processedAdmins);

        const roleCounts: { [key: string]: number } = {};
        data.admins.forEach((admin: any) => {
          admin.roles.forEach((role: any) => {
            roleCounts[role.name] = (roleCounts[role.name] || 0) + 1;
          });
        });

        const rolesArray = Object.keys(roleCounts).map((roleName) => ({
          name: roleName,
          userCount: roleCounts[roleName],
        }));

        setRoles(rolesArray);
      } catch (error) {
        console.error("Error fetching admins:", error);
        setError("Failed to fetch administrators");
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: "#50266f" }}></div>
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0 text-center sm:text-left">
          Administrators Management
        </h1>
        <button
          onClick={handleAddAdminClick}
          className="w-full sm:w-auto px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 hover:bg-[#3a1c50]"
          style={{ 
            backgroundColor: "#50266f",
            // Removed invalid hover property
          }}
        >
          <div className="flex items-center justify-center">
            Add New User
          </div>
        </button>
      </div>

      <Card className="mt-6 p-6">
        <div className="flex items-center mb-4">
          <UserCog className="w-5 h-5 mr-2" style={{ color: "#50266f" }} />
          <h2 className="text-lg font-semibold">Active Administrators</h2>
          <span className="ml-2 text-sm text-gray-500">
            ({activeAdmins.length} of {admins.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b" style={{ borderColor: "#d3b3e5" }}>
                <TableHead>Admin</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeAdmins.map((admin) => (
                <TableRow key={admin.id} className="border-b" style={{ borderColor: "#f5f0fa" }}>
                  <TableCell className="font-medium">{admin.full_name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {admin.roles.map(role => (
                      <Badge 
                        key={role.name} 
                        className="mr-1" 
                        style={{ backgroundColor: "#50266f" }}
                      >
                        {role.name}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    {admin.last_seen_at
                      ? formatTimeDifference(admin.last_seen_at)
                      : "No Activity record"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={admin.status === "active" ? "default" : "destructive"}
                      style={admin.status === "active" ? { backgroundColor: "#50266f" } : {}}
                    >
                      {capitalize(admin.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}