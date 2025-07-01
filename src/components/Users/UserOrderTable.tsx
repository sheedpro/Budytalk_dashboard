import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
// import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// import { OrderDetailsDialog } from "./order-details-dialog";
// import { UpdateStatusDialog } from "./update-status-dialog";

const statusColors: Record<string, string> = {
  pending: "yellow",
  processing: "blue",
  delivered: "green",
  cancelled: "red",
};

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
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
type orderProducts = {
  product_id: number;
  product_name: string;
  count: number;
};

type orderType = {
  buyer_order_id: number;
  buyer_id: number;
  payment_method: null | string;
  status: string;
  buyer_name: string;
  total_price: string;
  created_at: string;
  products: orderProducts;
}[];

interface UserOrdersTableProps {
  orders: orderType;
}
/**
 * 
 * @returns  "buyer_order_id": 31,
                "buyer_id": 2922,
                "payment_method": null,
                "status": "pending",
                "buyer_name": "Asheri Musa",
                "total_price": "5000.00",
                "created_at": "2024-12-23 18:12:11",
                "products": "[{\"product_id\": 1910, \"product_name\": \"Oranges\"}]"
 */
export function UserOrdersTable({ orders }: UserOrdersTableProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  //   const [orders, setOrders] = useState<Order[]>([]);
  const [] = useState<orderType[] | []>([]);
  const [, setDetailsOpen] = useState(false);
  const [, setStatusOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const itemsPerPage = 10;

  // Fetch orders from API
  //   useEffect(() => {
  //     const fetchOrders = async () => {
  //       try {
  //         //end point not ready
  //         const response = await fetch(
  //           "https://spareparts-backend.vercel.app/api/orders"
  //         ); // Replace with your API endpoint
  //         const data = await response.json();
  //         setOrders(data);
  //         console.log(data);
  //       } catch (error) {
  //         console.error("Error fetching orders:", error);
  //       }
  //     };

  //     fetchOrders();
  //   }, []);

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.buyer_order_id === Number(searchQuery) ||
      order.buyer_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle status filter change
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <Select value={statusFilter} onValueChange={handleStatusChange}>
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
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.buyer_order_id}>
                <TableCell className="font-medium">
                  {order.buyer_order_id}
                </TableCell>
                <TableCell>{order.buyer_name}</TableCell>
                <TableCell>
  {(() => {
    let products: orderProducts[] = [];

    try {
      // Ensure proper JSON parsing
      products =
        typeof order.products === "string"
          ? JSON.parse(order.products)
          : order.products;
    } catch (error) {
      console.error("Error parsing products JSON:", error);
    }

    // Group products and count duplicates
    const productsMap = products.reduce(
      (acc: Record<string, orderProducts & { count: number }>, product: orderProducts) => {
        if (acc[product.product_name]) {
          acc[product.product_name].count += 1;
        } else {
          acc[product.product_name] = { ...product, count: 1 };
        }
        return acc;
      },
      {}
    );

    // Explicitly type `uniqueProducts` as an array of `orderProducts`
    const uniqueProducts: (orderProducts & { count: number })[] = Object.values(productsMap);

    return uniqueProducts.map((item) => (
      <span key={item.product_id} className="block">
        {item.product_name} {item.count > 1 ? `x${item.count}` : ""}
      </span>
    ));
  })()}
</TableCell>


                <TableCell>{order.total_price}</TableCell>
                <TableCell>
                  <Badge
                    className={`bg-${
                      statusColors[order.status]
                    }-500 text-black`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.created_at}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          //setSelectedOrder(order);
                          setDetailsOpen(true);
                          navigate(`/orders/${order.buyer_order_id}`);
                        }}
                      >
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          //setSelectedOrder(order);
                          setStatusOpen(true);
                        }}
                      >
                        Update status
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
      {filteredOrders.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* <OrderDetailsDialog
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      <UpdateStatusDialog
        order={selectedOrder}
        open={statusOpen}
        onOpenChange={setStatusOpen}
      /> */}
    </div>
  );
}
