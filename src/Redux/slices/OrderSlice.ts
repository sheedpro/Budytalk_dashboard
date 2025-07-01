import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  unit: string;
  id: number;
  name: string;
  product_type_id: number;
  created_at: string | null;
  updated_at: string | null;
  laravel_through_key: number;
  picture?: string;
  price: string;
}

interface OrderItem {
  id: number;
  buyer_order_id: number;
  product_id: number;
  quantity: number;
  picture: string;
  price: string;
  created_at: string;
  updated_at: string;
  product: Product;
}

interface Buyer { 
  id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
}

interface Order {
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

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Get all orders
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    
    // Add new order
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    
    // Get order by ID
    getOrderById: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    setSelectedOrder: (state, action: PayloadAction<Order>) => {
      state.selectedOrder = action.payload;
      state.loading = false;
    },
    
    // Add product to order
    addProductToOrder: (
      state, 
      action: PayloadAction<{ orderId: number; product: Product; quantity: number }>
    ) => {
      const { orderId, product, quantity } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      
      if (order) {
        const existingProductIndex = order.items.findIndex(item => item.product_id === product.id);
        
        if (existingProductIndex >= 0) {
          // If product already exists, increase quantity
          order.items[existingProductIndex].quantity += quantity;
        } else {
          // Add new product
          const newItem: OrderItem = {
            id: Date.now(), // Temporary ID
            buyer_order_id: orderId,
            product_id: product.id,
            quantity: quantity,
            price: product.price,
            picture: product.picture ?? "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            product: product
          };
          order.items.push(newItem);
        }
        
        // Update total price
        const total = order.items.reduce(
          (sum, item) => sum + (Number(item.price) * item.quantity), 
          0
        );
        order.total_price = total.toString();
        
        // Update selected order if it's the same order
        if (state.selectedOrder && state.selectedOrder.id === orderId) {
          state.selectedOrder = {...order};
        }
      }
    },
    
    // Delete product from order
    deleteProductFromOrder: (
      state,
      action: PayloadAction<{ orderId: number; productId: number }>
    ) => {
      const { orderId, productId } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      
      if (order) {
        order.items = order.items.filter(item => item.product_id !== productId);
        
        // Update total price
        const total = order.items.reduce(
          (sum, item) => sum + (Number(item.price) * item.quantity),
          0
        );
        order.total_price = total.toString();
        
        // Update selected order if it's the same order
        if (state.selectedOrder && state.selectedOrder.id === orderId) {
          state.selectedOrder = {...order};
        }
      }
    },
    
    // Update product quantity in order
    updateProductQuantity: (
      state,
      action: PayloadAction<{ orderId: number; productId: number; quantity: number }>
    ) => {
      const { orderId, productId, quantity } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      
      if (order) {
        const item = order.items.find(item => item.product_id === productId);
        
        if (item) {
          item.quantity = quantity;
          
          // Update total price
          const total = order.items.reduce(
            (sum, item) => sum + (Number(item.price) * item.quantity),
            0
          );
          order.total_price = total.toString();
          
          // Update selected order if it's the same order
          if (state.selectedOrder && state.selectedOrder.id === orderId) {
            state.selectedOrder = {...order};
          }
        }
      }
    },
    
    // Update shipping address
    updateShippingAddress: (
      state,
      action: PayloadAction<{ orderId: number; shippingAddress: ShippingAddress }>
    ) => {
      const { orderId, shippingAddress } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      
      if (order) {
        order.shipping_address = JSON.stringify(shippingAddress); // Converting ShippingAddress to string
        
        // Update selected order if it's the same order
        if (state.selectedOrder && state.selectedOrder.id === orderId) {
          state.selectedOrder = {...order};
        }
      }
    },
    
    // Update order status
    updateOrderStatus: (
      state,
      action: PayloadAction<{ 
        id: number; 
        status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled' 
      }>
    ) => {
      const order = state.orders.find(order => order.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        
        // Update selected order if it's the same order
        if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
          state.selectedOrder = {...order};
        }
      }
    },
    
    // Delete order
    deleteOrder: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
      
      // Clear selected order if it's the deleted order
      if (state.selectedOrder && state.selectedOrder.id === action.payload) {
        state.selectedOrder = null;
      }
    },
    
    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  setOrders,
  addOrder, 
  getOrderById,
  setSelectedOrder,
  addProductToOrder,
  deleteProductFromOrder,
  updateProductQuantity,
  updateShippingAddress,
  updateOrderStatus, 
  deleteOrder,
  setError
} = orderSlice.actions;

export default orderSlice.reducer;