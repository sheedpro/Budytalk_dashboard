import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useBehavioralAnalytics } from './useBehavioralAnalyticsHook';

interface OrderDetail {
  id: number;
  date: string;
  totalPrice: number;
  items: {
    productTitle: string;
    quantity: number;
    price: number;
  }[];
}

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  orders: OrderDetail[];
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customerName,
  orders
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Order Details for {customerName}</DialogTitle>
          <DialogDescription>
            Complete order history and purchase details
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Date</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Items Purchased</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={order.id || index}>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      ${order.totalPrice.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="mb-1">
                        {item.productTitle}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="mb-1">
                        {item.quantity}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Example usage in parent component
export const BehavioralAnalyticsComponent = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<{
    name: string;
    orders: OrderDetail[];
  } | null>(null);

  const { rawData } = useBehavioralAnalytics();

  const handleViewDetails = (customerName: string) => {
    const customerOrders = rawData?.buyer_orders
      .filter(order => {
        const user = rawData.users.find(
          u => u.full_name === customerName && u.id === order.user_id
        );
        return user !== undefined;
      })
      .map(order => ({
        id: order.id,
        date: new Date(order.created_at).toLocaleDateString('en-US'),
        totalPrice: order.total_price,
        items: (rawData.buyer_order_items
          .filter(item => item.buyer_order_id === order.id)
          .map(item => {
            const product = rawData.products.find(p => p.id === item.product_id);
            return {
              productTitle: product?.product_title || 'Unknown Product',
              quantity: item.quantity,
              price: order.total_price
            };
          }) || [])
      })) || [];

    setSelectedCustomer({
      name: customerName,
      orders: customerOrders
    });
  };

  const customers = rawData?.users || []; // Assuming rawData.users contains the list of customers

  return (
    <>
      {/* Render a dropdown menu for each customer */}
      <DropdownMenu>
        <DropdownMenuContent>
          {customers.map(customer => (
            <DropdownMenuItem 
              key={customer.id} 
              onClick={() => handleViewDetails(customer.full_name)}
            >
              {customer.full_name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedCustomer && (
        <CustomerDetailsModal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          customerName={selectedCustomer.name}
          orders={selectedCustomer.orders}
        />
      )}
    </>
  );
};