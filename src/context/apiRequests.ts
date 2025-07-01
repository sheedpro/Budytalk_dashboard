import axios from "axios";

// Create Axios instance
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
 baseURL: "http://localhost:4000"
  ,

  
});

// Add this constant for image URLs
// export const IMAGE_BASE_URL = "https://test.farmsell.net/storage/";
export const IMAGE_BASE_URL = "https://dev.farmsell.net/storage/"
//export const IMAGE_BASE_URL = "http://127.0.0.1:8000/storage/";
// export const IMAGE_BASE_URL = "https://prod.farmsell.net/storage/";
export const PLACEHOLDER_IMAGE_URL = "https://i0.wp.com/port2flavors.com/wp-content/uploads/2022/07/placeholder-614.png?fit=1200%2C800&ssl=1";


// Request Interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(new Error(error.message || "Request failed"))
);

// Response Interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request, logging out...");
      localStorage.removeItem("token"); // Remove token if unauthorized
      // Optionally, redirect user to login
    }
    return Promise.reject(new Error(error.message || "Request failed"));
  }
);

// API CRUD Methods
export const apiRequests = {
  get: (url: string, params?: any) => api.get(url, { params }),
  getWithHeaders: (url: string, params?: any, headers?: any) =>
    api.get(url, { params, headers }),

  post: (url: string, data?: any) => api.post(url, data),
  postWithHeaders: (url: string, data?: any, headers?: any) =>
    api.post(url, data, { headers }),

  put: (url: string, data?: any) => api.put(url, data),
  putWithHeaders: (url: string, data?: any, headers?: any) =>
    api.put(url, data, { headers }),

  patch: (url: string, data?: any) => api.patch(url, data),
  patchWithHeaders: (url: string, data?: any, headers?: any) =>
    api.patch(url, data, { headers }),

  delete: (url: string, _p0?: { reason: string; }) => api.delete(url),
  deleteWithHeaders: (url: string, headers?: any) =>
    api.delete(url, { headers }),

  // Get stored token for decoding
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Add login method
  login: (data: { email: string; password: string }) =>
    api.post("login", data),

 
  // Add getAdminDetails method
  getAdminDetails: async (adminId: string) => {
    try {
      const response = await api.get(`admin-profile/${adminId}`);
      console.log("Get admin details response:", response);
      console.log("Admin data:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Get admin details error:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      console.error("Unknown error:", error);
      throw { message: "An unknown error occurred" };
    }
  },


  // New admin user management methods
  updatePassword: async (passwordData: {
    new_password: string;
    new_password_confirmation: string;
  }) => {
    try {
      const response = await api.post("reset", passwordData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Update password error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },

  addProfileDetails: async (profileData: {
    first_name: string;
    last_name: string;
    //date_of_birth: string;
    phone: string;
    gender: string;
    country: string;
    region: string;
  }) => {
    try {
      const response = await api.post("profile", profileData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Handle validation errors
        if (error.response.status === 422) {
          const errorMessages = Object.values(error.response.data.errors)
            .flat()
            .join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(error.response.data?.message || 'Failed to update profile');
      }
      throw new Error(error.message || 'Network error');
    }
  },
  
  // Dashboard API calls
  getTotalUsers: () => api.get("/users"),
  getTotalProducts: () => api.get("dashboard/total-products"),
  getTotalProviders: () => api.get("dashboard/total-providers"),
  getPendingProducts: () => api.get("dashboard/total-pending-products-change"),
  getDailyUsers: () => api.get("dashboard/new-users-by-day-month-week"),
  getMonthlyUsers: () => api.get("dashboard/monthly-users"),
  getWeeklyUsers: () => api.get("dashboard/users-per-week-in-the-month"),
  getMostDemandedProducts: () => api.get("dashboard/most-demanded-products-and-the-change"),
  getUsersLocations: () => api.get("dashboard/users-location-and-some-profile-data"),

  // Orders chart API calls
  getDailyOrders: () => api.get("dashboard/total-orders-by-day"),
  getMonthlyOrders: () => api.get("dashboard/total-orders-by-month"),
  getWeeklyOrders: () => api.get("dashboard/total-orders-by-week"),
  // Update the getUserProfile method to handle first/last name

  // Users API calls
  getBuyers: () => api.get("users/buyers"),
  getBuyerOrders: (buyerId: number) => api.get(`users/buyer-orders/${buyerId}`),
  getUsers: () => api.get("/users"),
  getPosts: () => api.get("/posts/1071866c-8219-4cc0-8667-8fe7d67f669f"),
  getUserProfile: async () => {
    try {
      const response = await api.get("admin-profile");
      // Transform response if needed
      if (response.data && response.data.profile) {
        response.data.profile.full_name = 
          `${response.data.profile.first_name || ''} ${response.data.profile.last_name || ''}`.trim();
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Get user profile error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },
    updateDeliveryDate: async (orderId:number,delivery_date:string)=> {
   const  response =  await api.post('order/update-delivery-date',{orderId,delivery_date})
    return response.data
  },

  uploadProfilePicture: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('picture', file);  // Ensure parameter name matches backend expectation
      
      const response = await api.post("upload-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Upload error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        throw error.response?.data || { 
          message: error.message,
          status: error.response?.status
        };
      }
      throw { 
        message: "An unknown error occurred",
        originalError: error 
      };
    }
  },


  addRole: async (adminId: number, role: string) => {
    try {
      const response = await api.post(`add-role/${adminId}`, {
        role,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Add role error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },

  removeRole: async (adminId: number, role: string) => {
    try {
      const response = await api.post(`remove-role/${adminId}`, {
        role,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Remove role error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },
  // Add adminLogout method
  adminLogout: async () => {
    try {
      const response = await api.post("/auth/admin/logout");
      localStorage.removeItem("token"); // Remove token from local storage
      window.location.href = "/login"; // Redirect to login page
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Admin logout error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },

  // Order status update methods
  updateOrderShipping: async (orderId: number, shipping_address: string) => {
    try {
      const response = await api.post("/order/update-shipping", {
        orderId,
        shipping_address,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Update shipping error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },
    markOrderAsCancelled: async (orderId: number) => {
    try {
      const response = await api.post("/order/cancel-order", {
        orderId,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Mark as cancelled error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },
  markOrderAsDelivered: async (orderId: number) => {
    try {
      const response = await api.post("/order/delivered-order", {
        orderId,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Mark as delivered error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },

  markOrderAsCompleted: async (orderId: number) => {
    try {
      const response = await api.post("/order/completed-order", {
        orderId,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Mark as completed error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },

  markOrderAsShipped: async (orderId: number) => {
    try {
      const response = await api.post("/order/shipped-order", {
        orderId,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Mark as shipped error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },
  confirmOrder: async (orderId: number) => {
    try {
      const response = await api.post("/order/confirmed-order", {
        orderId,
      }); 
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Confirm order error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },  
      makeOrderPrepared: async (orderId: number) => {
    try {
      const response = await api.post("/order/preparing-order", {
        orderId,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Make order prepared error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },
  getOrderById: async (orderId: number) => {
    try {
      const response = await api.get(`/order/get-order?orderId=${orderId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Get order by ID error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },
  updateOrderItemQuantity: async (
    orderId: number,
    itemId: number,
    quantity: number
  ) => {
    try {
      const response = await api.put("/order/update-quantity", {
        orderId,
        itemId,
        quantity,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Update order item quantity error details:",
          error.response?.data
        );
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },

  addItemToOrder: async (
    orderId: number,
    productId: number,
    quantity: number,
    price: number
  ) => {
    try {
      const response = await api.post("/order/add-item", {
        orderId,
        productId,
        quantity,
        price,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Add item to order error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },

  deleteOrderItem: async (orderId: number, itemId: number) => {
    try {
      const response = await api.delete(`/order/delete-item`, {
        params: {
          orderId,
          itemId,
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Delete order item error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },

  getAllProducts: async () => {
    try {
      const response = await api.get("/product/all-approved-products");
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Get all products error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },

  // Reports API calls
  getOrdersReport: async (params: any) => {
    try {
      const response = await api.get("/order/order-report", { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Get orders report error details:", error.response?.data);
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unknown error occurred" };
    }
  },
};

export default api;