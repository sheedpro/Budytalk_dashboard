import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiRequests } from "@/context/apiRequests";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  AlertCircle,
  ShoppingCart,
  Tag,
  Layers,
  FileText,
  DollarSign,
} from "lucide-react";
import { IMAGE_BASE_URL } from "@/context/apiRequests";

interface OrderItem {
  id: number;
  buyer_order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  picture: string;
  product_title: string;
  product_description: string;
  product_picture: string;
  product_price: string;
  category_name: string;
  subcat_name: string;
}

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
  items: OrderItem[];
}

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await apiRequests.get(`users/${orderId}/details`);
        setOrder(response.data.data);
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    switch (capitalizedStatus) {
      case "Completed":
        return "bg-purple-100 text-purple-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-indigo-100 text-indigo-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mb-4"></div>
            <p className="text-purple-800 text-lg font-medium">
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-purple-700 hover:text-purple-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Orders</span>
            </button>
          </div>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
          <div className="flex flex-col items-center">
            <Package className="h-12 w-12 text-purple-700 mb-4" />
            <p className="text-purple-800 text-lg font-medium">
              Order not found
            </p>
            <Link
              to="/orders"
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Return to Orders
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/user/${order.user_id}`)}
            className="inline-flex items-center text-purple-700 hover:text-purple-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Orders</span>
          </button>
        </div>

        {/* Order header section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-purple-100">
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center">
                <div className="bg-white p-3 rounded-full mr-5 shadow-md">
                  <Package className="w-10 h-10 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Order #{order.id}
                  </h1>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 text-purple-100 mr-2" />
                    <p className="text-purple-100">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100 mb-8">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-purple-800">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-5">
                <div className="flex items-start">
                  <Tag className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Order ID
                    </h3>
                    <p className="text-gray-900 font-medium">#{order.id}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <DollarSign className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Price
                    </h3>
                    <p className="text-gray-900 font-medium">
                      UGX {order.total_price}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Status
                    </h3>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Order Date
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Payment Method
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {order.payment_method}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-purple-800">
                  Shipping Information
                </h2>
              </div>

              <div className="space-y-5">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Shipping Address
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>

                {order.delivery_slot_id && (
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Delivery Slot
                      </h3>
                      <p className="text-gray-900 font-medium">
                        #{order.delivery_slot_id}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Last Updated
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {formatDate(order.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-purple-100">
                <div className="flex items-center">
                  <ShoppingCart className="w-5 h-5 text-purple-600 mr-2" />
                  <h2 className="text-lg font-semibold text-purple-800">
                    Order Items
                  </h2>
                </div>
              </div>

              <div className="divide-y divide-purple-100">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col md:flex-row">
                      {item.product_picture && (
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                          <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={`${IMAGE_BASE_URL}cover/${item.product_picture}`}
                              alt={item.product_title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error(`Failed to load image: ${e.currentTarget.src}`);
                                e.currentTarget.src = "/api/placeholder/300/300"; // Fallback image
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.product_title}
                            </h3>
                            <div className="mt-1 flex items-center">
                              <Layers className="w-4 h-4 text-purple-500 mr-1" />
                              <span className="text-sm text-gray-500">
                                {item.category_name} / {item.subcat_name}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {item.product_description}
                            </p>
                          </div>

                          <div className="mt-4 md:mt-0 flex flex-col items-end">
                            <div className="text-lg font-medium text-gray-900">
                              UGX. {item.product_price}
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              Qty: {item.quantity}
                            </div>
                            <div className="mt-1 text-sm font-medium text-purple-700">
                              Subtotal: UGX. 
                              {parseFloat(item.price) * item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-xl font-bold text-purple-700">
                    UGX. {order.total_price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;