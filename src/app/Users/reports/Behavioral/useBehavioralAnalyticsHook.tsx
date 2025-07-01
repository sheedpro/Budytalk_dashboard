import { useState, useEffect, useMemo } from "react";
import { apiRequests } from "@/context/apiRequests";

// Interfaces to match the raw data structure
interface BuyerOrder {
  id: number;
  user_id: number;
  total_price: number;
  created_at: string;
}

interface Buyer {
  id: number;
  user_id: number;
}

interface User {
  id: number;
  full_name: string;
}

interface BuyerOrderItem {
  id: number;
  buyer_order_id: number;
  product_id: number;
  quantity: number;
}

interface Product {
  id: number;
  product_title: string;
}

// Interface for processed customer behavior
interface CustomerBehavior {
  id: string;
  customerName: string;
  totalPurchases: number;
  averageOrderValue: number;
  lastPurchaseDate: string;
  purchaseFrequency: string;
  productPreference: string;
  timeSinceLastPurchase: string;
}

export const useBehavioralAnalytics = () => {
  // State to store raw data
  const [rawData, setRawData] = useState<{
    buyer_orders: BuyerOrder[];
    buyers: Buyer[];
    users: User[];
    buyer_order_items: BuyerOrderItem[];
    products: Product[];
  } | null>(null);

  // Processed customer behavior data
  const [reportData, setReportData] = useState<CustomerBehavior[]>([]);

  // Fetch raw data
  const fetchRawData = async () => {
    try {
      const response = await apiRequests.get(
        "behavioral-analytics/raw-data"
      );
      setRawData(response.data);
    } catch (error) {
      console.error("Error fetching behavioral analytics data:", error);
    }
  };

  // Process raw data into customer behavior
  const processRawData = useMemo(() => {
    if (!rawData) return [];

    // Create maps for efficient lookup
    const userMap = new Map(
      rawData.users.map((user) => [user.id, user.full_name])
    );

    // Group orders by user
    const userOrders = new Map<number, BuyerOrder[]>();
    rawData.buyer_orders.forEach((order) => {
      const userId = order.user_id;
      if (!userOrders.has(userId)) {
        userOrders.set(userId, []);
      }
      userOrders.get(userId)?.push(order);
    });

    // Group order items by order
    const orderItemsMap = new Map<number, BuyerOrderItem[]>();
    rawData.buyer_order_items.forEach((item) => {
      if (!orderItemsMap.has(item.buyer_order_id)) {
        orderItemsMap.set(item.buyer_order_id, []);
      }
      orderItemsMap.get(item.buyer_order_id)?.push(item);
    });

    // Product map
    const productMap = new Map(
      rawData.products.map((product) => [product.id, product.product_title])
    );

    // Process customer behaviors
    const behaviors: CustomerBehavior[] = [];

    userOrders.forEach((orders, userId) => {
      if (orders.length > 0) {
        // Sort orders by date
        const sortedOrders = orders.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Most recent order
        const latestOrder = sortedOrders[0];

        // Calculate total purchases and average order value
        const totalPurchases = orders.length;
        const averageOrderValue = orders.reduce((sum, order) => {
            // Remove '$' and convert to number, defaulting to 0 if invalid
            const price = parseFloat(String(order.total_price).replace('$', '')) || 0;
            return sum + price;
          }, 0) / (orders.length || 1);

          
        // Determine product preference
        const productPreferences = new Map<string, number>();
        orders.forEach((order) => {
          const orderItems = orderItemsMap.get(order.id) || [];
          orderItems.forEach((item) => {
            const productTitle = productMap.get(item.product_id) || "Unknown";
            productPreferences.set(
              productTitle,
              (productPreferences.get(productTitle) || 0) + item.quantity
            );
          });
        });

        // Find most preferred product
        const mostPreferredProduct = Array.from(
          productPreferences.entries()
        ).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

        // Calculate time since last purchase
        const timeSinceLastPurchase = (() => {
          const daysDiff = Math.floor(
            (new Date().getTime() -
              new Date(latestOrder.created_at).getTime()) /
              (1000 * 3600 * 24)
          );

          if (daysDiff < 7) return `${daysDiff} days`;
          if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} weeks`;
          if (daysDiff < 365) return `${Math.floor(daysDiff / 30)} months`;
          return `${Math.floor(daysDiff / 365)} years`;
        })();

        // Determine purchase frequency
        const purchaseFrequency = (() => {
          if (sortedOrders.length < 2) return "Irregular";

          const intervals = sortedOrders
            .slice(1)
            .map((order, index) =>
              Math.floor(
                (new Date(sortedOrders[index].created_at).getTime() -
                  new Date(order.created_at).getTime()) /
                  (1000 * 3600 * 24)
              )
            );

          const averageInterval =
            intervals.reduce((a, b) => a + b, 0) / intervals.length;

          if (averageInterval <= 30) return "Monthly";
          if (averageInterval <= 90) return "Quarterly";
          if (averageInterval <= 180) return "Bi-Annually";
          return "Irregular";
        })();

        behaviors.push({
          id: userId.toString(),
          customerName: userMap.get(userId) || "Unknown",
          totalPurchases,
          averageOrderValue: Number(averageOrderValue.toFixed(2)),
          lastPurchaseDate: new Date(latestOrder.created_at).toLocaleDateString(
            "en-US"
          ),
          purchaseFrequency,
          productPreference: mostPreferredProduct,
          timeSinceLastPurchase,
        });
      }
    });

    return behaviors;
  }, [rawData]);

  // Effect to process data when raw data changes
  useEffect(() => {
    if (rawData) {
      const processedData = processRawData;
      setReportData(processedData);
    }
  }, [rawData, processRawData]);

  return {
    fetchRawData,
    reportData,
    rawData,
  };
};
