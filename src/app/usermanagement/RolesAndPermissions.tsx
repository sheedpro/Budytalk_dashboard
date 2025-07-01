import { useEffect, useState } from "react";
import { UserCog, Shield } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function AdminControls() {
  interface Admin {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    roles: {
      id: number; name: string
    }[];
    last_seen_at: string | null;
    status: string;
  }

  interface Role {
    id: number;
    name: string;
    userCount: number;
  }

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [, setRoleIds] = useState<{ [key: string]: number }>({});
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const activeAdmins = admins.filter((admin) => admin.status === "active");
  const navigate = useNavigate();
  const [revokingAdminId, setRevokingAdminId] = useState<string | null>(null);

  const capitalize = (text: string) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

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
  }

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

  const handleRevokeAccess = async (adminId: string) => {
    if (!window.confirm('Are you sure you want to revoke access for this administrator?')) {
      return;
    }

    try {
      setRevokingAdminId(adminId);
      const response = await updateAdminDetails(adminId, {
        roles: admins.find(admin => admin.id === adminId)?.roles.map(role => role.name) || [],
        status: 'inactive'
      });

      if (response.status === 'SUCCESS') {
        setAdmins(prevAdmins =>
          prevAdmins.map(admin =>
            admin.id === adminId
              ? { ...admin, status: 'inactive' }
              : admin
          )
        );

        const data = await getAllAdmins();
        setAdmins(data.admins);

        toast.success('Administrator access revoked successfully');
      } else {
        toast.error(response.message || 'Failed to revoke administrator access');
      }
    } catch (error: any) {
      console.error('Revoke access error:', error);
      toast.error('Failed to revoke administrator access');
    } finally {
      setRevokingAdminId(null);
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
        setAdmins(processedAdmins);

        const roleCounts: { [key: string]: number } = {};
        const fetchedRoleIds: { [key: string]: number } = {};

        processedAdmins.forEach((admin: Admin) => {
          admin.roles.forEach((role) => {
            roleCounts[role.name] = (roleCounts[role.name] || 0) + 1;
            fetchedRoleIds[role.name] = role.id;
          });
        });

        const rolesArray = Object.keys(roleCounts).map((roleName) => ({
          name: roleName,
          userCount: roleCounts[roleName],
          id: fetchedRoleIds[roleName]
        }));

        setRoles(rolesArray);
        setRoleIds(fetchedRoleIds);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const handleEditRole = (roleName: string) => {
    navigate(`/roles/${roleName}`);
  };

  // Custom styles for the grape purple theme
  const purpleStyles = {
    primary: "#50266f",
    hoverPurple: "#3a1c50",
    lightPurple: "#f5f0fa",
    borderPurple: "#d3b3e5"
  };

  return (
    <div>
      {/* Role Management Card - Responsive with 2 columns on larger screens */}
      <Card className="p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 mr-2" style={{ color: purpleStyles.primary }} />
          <h2 className="text-lg font-semibold">Role Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <div
              key={role.name}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center">
                <UserCog className="w-5 h-5 text-muted-foreground mr-3" />
                <div>
                  <p className="font-medium">{capitalize(role.name)}</p>
                  <p className="text-sm text-muted-foreground">
                    {role.userCount} {role.userCount === 1 ? 'user' : 'users'} assigned
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => handleEditRole(role.name)}
                className="ml-2 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                style={{ color: purpleStyles.primary }}
              >
                Show
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Administrators Table */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <UserCog className="w-5 h-5 mr-2" style={{ color: purpleStyles.primary }} />
          <h2 className="text-lg font-semibold">Active Administrators</h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b" style={{ borderColor: purpleStyles.borderPurple }}>
                <TableHead>Admin</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeAdmins.map((admin) => (
                <TableRow key={admin.id} className="border-b" style={{ borderColor: purpleStyles.borderPurple }}>
                  <TableCell className="font-medium">
                    {admin.full_name}
                  </TableCell>
                  <TableCell>
                    {admin.roles.map((role) => capitalize(role.name)).join(", ")}
                  </TableCell>
                  <TableCell>
                    {admin.last_seen_at
                      ? formatTimeDifference(admin.last_seen_at)
                      : "No activity"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        admin.status === "active" ? "default" : "destructive"
                      }
                      className={admin.status === "active" ? "" : ""}
                      style={admin.status === "active" ? { backgroundColor: purpleStyles.primary } : {}}
                    >
                      {capitalize(admin.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate(`/edit-admin?adminId=${admin.id}`)} 
                      className="mr-2 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                      style={{ color: purpleStyles.primary }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-destructive hover:bg-red-100 dark:hover:bg-red-900/20"
                      onClick={() => handleRevokeAccess(admin.id)}
                      disabled={revokingAdminId === admin.id}
                    >
                      {revokingAdminId === admin.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        'Revoke Access'
                      )}
                    </Button>
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