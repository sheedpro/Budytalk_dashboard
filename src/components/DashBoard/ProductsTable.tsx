import { useState } from 'react';
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
type UserStatus = 'approved' | 'pending' | 'rejected' | 'blocked';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  location: string;
  status: UserStatus;
  dateJoined: string;
  department: string;
  lastActive: string;
  avatarUrl: string;
}

const ProductsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 45;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const navigate = useNavigate()
  // Generate sample users
  const users: User[] = Array.from({ length: itemsPerPage }, (_, index) => ({
    id: index + 1,
    firstName: `Product{index + 1}`,
    lastName: "williams",
    email: `user${index + 1}@example.com`,
    role: "User",
    location: "New York, US",
    status: ["approved", "pending", "rejected", "blocked"][Math.floor(Math.random() * 4)] as UserStatus,
    dateJoined: "2024-01-15",
    department: "IT",
    lastActive: "2024-01-10",
    avatarUrl: "/api/placeholder/32/32"
  }));

  const getStatusColor = (status: UserStatus): string => {
    const colors: Record<UserStatus, string> = {
      approved: "text-green-600",
      pending: "text-yellow-600",
      rejected: "text-red-600",
      blocked: "text-gray-600"
    };
    return colors[status];
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg font-medium">Products  Table</CardTitle>
      <CardTitle className="text-sm text-green-400 font-medium cursor-pointer" onClick={()=>navigate('/allProducts')}>see all</CardTitle>
    </CardHeader>
    <CardContent>
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Product Name</TableHead>
              <TableHead>Qantity</TableHead>
              <TableHead>volume</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>
                  <span className={`${getStatusColor(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 border border-gray-200 hover:bg-gray-100"
                      >
                        <span className="text-xs text-gray-500 mr-2">Edit</span>
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem className="text-sm cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm cursor-pointer">
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm cursor-pointer">
                        Block
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm cursor-pointer text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-gray-500">
          SHOWING {startItem}-{endItem} OF {totalItems}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
              className="h-8 w-8 p-0"
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
    </CardContent>
  </Card>
    
  );
};

export default ProductsTable;