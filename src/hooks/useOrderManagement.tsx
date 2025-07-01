import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequests } from "@/context/apiRequests";
import { RootState } from "@/Redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSelectedOrder } from "@/Redux/slices/OrderSlice";
export interface Product {
  id: number;
  name: string;
  product_type_id: number;
  unit: string;
  created_at: string | null;
  updated_at: string | null;
  laravel_through_key: number;
}

interface OrderItem {
  id: number;
  buyer_order_id: number;
  product_id: number;
  quantity: number;

  price: string;
  created_at: string;
  updated_at: string;
  picture: string;
  product: Product;
}

interface Buyer {
  id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  shipping_address: string;
  status: string;
  total_price: string;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
  delivery_slot_id: number | null;
  delivery_date: string;
  time_slot: string;
  payment_status: string | null;
  stage: string;
  priority_score: number | null;
  priority_level: string | null;
  items: OrderItem[];
  buyer: Buyer;
}

const useOrderManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //state data
  const selectedOrder = useSelector(
    (state: RootState) => state.orders.selectedOrder
  );
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.post("order/all-orders");
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };
  // Get order by ID
  const getOrderById = async (orderId: number) => {
    setLoading(true);
    try {
      const response = await apiRequests.getOrderById(orderId);
      dispatch(setSelectedOrder(response.data));

      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to fetch order details");
      setLoading(false);
      return null;
    }
  };
  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch =
      order?.order_number?.toString().includes(searchQuery.toLowerCase()) ||
      order?.buyer?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order?.status === statusFilter;

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

  // View order details
  const viewOrderDetails = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };
  const addItemToOrder = async (
    orderId: number,
    productId: number,
    quantity: number,
    price: number
  ) => {
    setLoading(true);
    try {
      const response = await apiRequests.addItemToOrder(
        orderId,
        productId,
        quantity,
        price
      );
      console.log({ response });
    } catch (error) {
      console.error("Error adding item to order:", error);
      setError("Failed to add item to order");
      setLoading(false);
    }
  };

  // Delete item from order
  const deleteOrderItem = async (orderId: number, itemId: number) => {
    setLoading(true);
    try {
      const response = await apiRequests.deleteOrderItem(orderId, itemId);
      console.log({ response });
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error deleting item from order:", error);
      setError("Failed to delete item from order");
      setLoading(false);
      return null;
    }
  };
  const updateDeliveryTime = async (orderId: number, delivery_date: string) => {
    try {
      const response = await apiRequests.updateDeliveryDate(
        orderId,
        delivery_date
      );
      console.log({ response });
    } catch (err) {
      console.log({ err });
    }
  };
  // Update order item quantity
  const updateOrderItemQuantity = async (
    orderId: number,
    itemId: number,
    quantity: number
  ) => {
    setLoading(true);
    try {
      const response = await apiRequests.updateOrderItemQuantity(
        orderId,
        itemId,
        quantity
      );
      console.log({ response });
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error updating order item quantity:", error);
      setError("Failed to update order item quantity");
      setLoading(false);
      return null;
    }
  };

  // Update shipping address
  const updateShippingAddress = async (orderId: number, newAddress: string) => {
    setLoading(true);
    try {
      // Call API to update shipping address
      const response = await apiRequests.updateOrderShipping(
        orderId,
        newAddress
      );

      console.log({ response });

      // Refresh orders to get updated data
      await fetchOrders();
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error updating shipping address:", error);
      setError("Failed to update shipping address");
      setLoading(false);
      return null;
    }
  };
  // Update order status
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    console.log({ orderId, newStatus });
    setLoading(true);
    try {
      if (newStatus === "dispatched") {
        // For shipped status, we need shipping address
        // This is a placeholder - you would get the actual shipping address
        //await apiRequests.updateOrderShipping(orderId);
        await apiRequests.markOrderAsShipped(orderId);
      } else if (newStatus === "delivered") {
        const responseDelivered = await apiRequests.markOrderAsDelivered(
          orderId
        );
        console.log({ responseDelivered });
      } else if (newStatus === "completed") {
        const responseCompleted = await apiRequests.markOrderAsCompleted(
          orderId
        );
        console.log({ responseCompleted });
      } else if (newStatus === "cancelled") {
        const responseCancelled = await apiRequests.markOrderAsCancelled(
          orderId
        );
        console.log({ responseCancelled });
      }
      if (newStatus === "confirmed") {
        const responseConfirmed = await apiRequests.confirmOrder(orderId);
        console.log({ responseConfirmed });
      }
      if (newStatus === "preparing") {
        const responsePreparing = await apiRequests.makeOrderPrepared(orderId);
        console.log({ responsePreparing });
      }
      // Refresh orders after update
      await fetchOrders();
      setLoading(false);
    } catch (err) {
      setError("Failed to update order status");
      setLoading(false);
    }
  };

  return {
    orders,
    setOrders,
    fetchOrders,
    filteredOrders,
    paginatedOrders,
    selectedOrder,
    setSelectedOrder,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    statusFilter,
    searchQuery,
    setSearchQuery,
    handlePageChange,
    handleStatusChange,
    viewOrderDetails,
    updateOrderStatus,
    getOrderById,
    updateShippingAddress,
    updateOrderItemQuantity,
    addItemToOrder,
    deleteOrderItem,
    updateDeliveryTime,
  };
};

export default useOrderManagement;
