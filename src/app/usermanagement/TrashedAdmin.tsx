import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCcw, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiRequests } from "@/context/apiRequests";
import { toast } from "sonner";





interface Admin {
  id: number;
  name: string;
  email: string;
  deleted_at: string;
  roles?: string[];
}

// Add these methods to the apiRequests object in your actual code
const trashedAdminApi = {
  getTrashedAdmins: async () => {
    try {
      const response = await apiRequests.get("soft-deleted");
      return response.data; // Return the data directly
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  getTrashedAdminById: async (id: number) => {
    try {
      const response = await apiRequests.get(`soft-deleted/${id}`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  permanentlyDeleteAdmin: (id: number) => apiRequests.delete(`soft-deleted/${id}`),
  restoreAdmin: (id: number) => apiRequests.patch(`restore/${id}`), // Updated endpoint
};

export default function TrashedAdmin() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [adminToRestore, setAdminToRestore] = useState<number | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Fetch trashed admins on component mount
  useEffect(() => {
    fetchTrashedAdmins();
  }, []);

  // Fetch all trashed admins
  const fetchTrashedAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await trashedAdminApi.getTrashedAdmins();
      console.log("API Response:", response);
      
      // Check if the response has the expected structure
      if (response && response.admins && Array.isArray(response.admins)) {
        // Map the response to match our expected Admin interface
        const formattedAdmins = response.admins.map((admin: { id: any; first_name: any; last_name: any; email: any; deleted_at: any; roles: any[]; }) => ({
          id: admin.id,
          name: `${admin.first_name || ''} ${admin.last_name || ''}`.trim(),
          email: admin.email,
          deleted_at: admin.deleted_at,
          roles: admin.roles ? admin.roles.map(role => role.name) : []
        }));
        setAdmins(formattedAdmins);
      } else {
        console.error("Unexpected API response structure:", response);
        setAdmins([]);
        toast.error("Unexpected API response structure");
      }
    } catch (error) {
      console.error("Failed to fetch trashed admins:", error);
      setAdmins([]);
      toast.error("Failed to fetch trashed administrators");
    } finally {
      setIsLoading(false);
    }
  };

 

  // Handle permanent deletion
  const handlePermanentDelete = async () => {
    if (!adminToDelete) return;
    
    setActionInProgress(true);
    try {
      await trashedAdminApi.permanentlyDeleteAdmin(adminToDelete);
      setAdmins(admins.filter(admin => admin.id !== adminToDelete));
      toast.success("Administrator permanently deleted");
    } catch (error) {
      console.error("Failed to permanently delete admin:", error);
      toast.error("Failed to permanently delete administrator");
    } finally {
      setAdminToDelete(null);
      setIsDeleteDialogOpen(false);
      setActionInProgress(false);
    }
  };

  // Handle restore admin
  const handleRestoreAdmin = async () => {
    if (!adminToRestore) return;
    
    setActionInProgress(true);
    try {
      await trashedAdminApi.restoreAdmin(adminToRestore);
      setAdmins(admins.filter(admin => admin.id !== adminToRestore));
      toast.success("Administrator restored successfully");
    } catch (error) {
      console.error("Failed to restore admin:", error);
      toast.error("Failed to restore administrator");
    } finally {
      setAdminToRestore(null);
      setIsRestoreDialogOpen(false);
      setActionInProgress(false);
    }
  };

  // Filter admins based on search term
  const filteredAdmins = admins.filter(
    admin =>
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <Card className="border-t-4 border-t-[#50266f]">
        <CardHeader className="bg-gray-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-[#50266f]">
              Trashed Administrators
            </CardTitle>
            <Button
              variant="outline"
              onClick={fetchTrashedAdmins}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search bar */}
          <div className="flex items-center mb-6 relative">
            <Search className="w-5 h-5 absolute left-3 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#50266f]" />
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {searchTerm ? "No matching administrators found" : "No trashed administrators found"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Deleted At</TableHead>
                    <TableHead className="font-semibold">Roles</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins && filteredAdmins.length > 0 ? (
                    filteredAdmins.map((admin) => (
                      <TableRow key={admin.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{admin.id}</TableCell>
                        <TableCell>{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          {new Date(admin.deleted_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {admin.roles && admin.roles.length > 0 ? (
                              admin.roles.map((role, idx) => (
                                <Badge key={idx} variant="outline" className="bg-[#50266f]/10">
                                  {role}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">No roles</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewAdminDetails(admin.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button> */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => {
                                setAdminToRestore(admin.id);
                                setIsRestoreDialogOpen(true);
                              }}
                            >
                              <RefreshCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setAdminToDelete(admin.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        No administrators found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Admin Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#50266f]">Administrator Details</DialogTitle>
            <DialogDescription>
              Information about the deleted administrator.
            </DialogDescription>
          </DialogHeader>

          {selectedAdmin && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold">ID:</span>
                <span className="col-span-2">{selectedAdmin.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold">Name:</span>
                <span className="col-span-2">{selectedAdmin.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold">Email:</span>
                <span className="col-span-2">{selectedAdmin.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold">Deleted:</span>
                <span className="col-span-2">
                  {new Date(selectedAdmin.deleted_at).toLocaleString()}
                </span>
              </div>
              {selectedAdmin.roles && selectedAdmin.roles.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Roles:</span>
                  <div className="col-span-2 flex flex-wrap gap-2">
                    {selectedAdmin.roles.map((role, index) => (
                      <Badge key={index} variant="outline" className="bg-[#50266f]/10">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <div className="flex space-x-2 justify-between w-full">
              <Button
                variant="outline"
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  if (selectedAdmin) {
                    setAdminToRestore(selectedAdmin.id);
                    setIsRestoreDialogOpen(true);
                  }
                }}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Restore
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  if (selectedAdmin) {
                    setAdminToDelete(selectedAdmin.id);
                    setIsDeleteDialogOpen(true);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Permanently
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete Administrator</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              administrator from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionInProgress}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={actionInProgress}
            >
              {actionInProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Permanently
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Restore Dialog */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Administrator</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the administrator account and they will be able to
              log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionInProgress}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreAdmin}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={actionInProgress}
            >
              {actionInProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Restore Administrator
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}