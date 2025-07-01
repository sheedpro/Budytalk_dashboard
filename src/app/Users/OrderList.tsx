import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequests } from '@/context/apiRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: number;
  user_id: number;
  shipping_address: string;
  status: string;
  total_price: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  delivery_slot_id: number | null;
}

interface OrdersListProps {
  userId: string;
}

const OrdersList: React.FC<OrdersListProps> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiRequests.get(`users/${userId}/orders`);
        if (response.data && response.data.data) {
          setOrders(response.data.data);
        } else {
          setError('No orders found for this user');
        }
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleOrderClick = (orderId: number) => {
    navigate(`/user/orders/${orderId}`);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-[#e9d8f0] text-[#50266f] border-[#d9c4e6]';
      case 'processing':
        return 'bg-[#d9c4e6] text-[#50266f] border-[#e9d8f0]';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX'
    }).format(parseFloat(amount));
  };

  const capitalize = (text: string): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-[#50266f] animate-spin" />
        <span className="ml-2 text-[#50266f]">Loading orders...</span>
      </div>
    );
  }

  return (
    <Card className="border-[#e9d8f0] shadow-sm">
      <CardHeader className="bg-[#e9d8f0] border-b border-[#d9c4e6]">
        <CardTitle className="text-[#50266f]">Customer Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-center text-[#50266f]">No orders found for this customer</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#e9d8f0]">
                <TableRow>
                  <TableHead className="text-[#50266f]">Order ID</TableHead>
                  <TableHead className="text-[#50266f]">Date</TableHead>
                  <TableHead className="text-[#50266f]">Status</TableHead>
                  <TableHead className="text-[#50266f]">Payment Method</TableHead>
                  <TableHead className="text-[#50266f] text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="hover:bg-[#d9c4e6] border-b border-[#e9d8f0] cursor-pointer"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>
                      <Badge className={`font-normal ${getStatusColor(order.status)}`}>
                        {capitalize(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{order.payment_method}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.total_price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersList;