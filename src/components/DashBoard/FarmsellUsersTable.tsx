import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequests } from "@/context/apiRequests";
import { userTypes } from "@/Redux/slices/UserSlice/UserTypes";

export type UsersInterface = {
  users: userTypes[];
};

// const statusOptions = [
//   { value: "all", label: "All" },
//   { value: "buyers", label: "Buyers" },
//   { value: "sellers", label: "Sellers" },
// ];

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

const FarmsellUsersTable = () => {
  const [users, setUsers] = useState<userTypes[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<userTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter] = useState("all");

  const itemsPerPage = 10;

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.get("users");
      if (response.data && response.data.data) {
        const userData = Array.isArray(response.data.data) ? response.data.data : response.data.data.data;
        if (Array.isArray(userData)) {
          setUsers(userData);
          setFilteredUsers(userData);
        } else {
          throw new Error("Invalid data format received from server: user data is not an array");
        }
      } else {
        throw new Error("Invalid data format received from server: missing data");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((user) => user.user_status === statusFilter);
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          (user.full_name && user.full_name.toLowerCase().includes(term)) ||
          (user.location && user.location.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term))
      );
    }

    setFilteredUsers(result);
  }, [users, statusFilter, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle status filter change
  // const handleStatusChange = (status: string) => {
  //   setStatusFilter(status);
  //   setCurrentPage(1); // Reset to first page when filter changes
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {/* <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">User Name</TableHead>
              <TableHead className="w-1/4">Email</TableHead>
              <TableHead className="w-1/4">Location</TableHead>
              <TableHead className="w-1/4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="w-1/4">{user.full_name}</TableCell>
                <TableCell className="w-1/4">{user.email}</TableCell>
                <TableCell className="w-1/4">{user.location}</TableCell>
                <TableCell className="w-1/4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <a href={`/userDetails/${user.id}`}>View details</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a href={`/users/edit/${user.id}`}>Edit user</a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default FarmsellUsersTable;
