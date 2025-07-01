import { dashboardTypes } from "./DashboardTypes";
import { createSlice } from "@reduxjs/toolkit";
const initialState: dashboardTypes = {
  totalUsers: { totalUsers: 0, change: 0 },
  totalProducts: { totalProducts: 0, change: 0 },
  totalProviders: { totalProviders: 0, change: 0 },
  totalPendingProducts: { totalPendingProducts: 0, change: 0 },
  newUsersChart: {
    daily: [],
    monthly: [],
    weekly: [],
  },
  productsTrends: {
    mostDemandedProducts: [],
  },
  userLocations: [],
  newOrdersChart: {
    daily: [],
    monthly: [],
    weekly: [],
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateTotalUsers: (state, action) => {
      state.totalUsers = action.payload;
    },
    updateTotalProducts: (state, action) => {
      state.totalProducts = action.payload;
    },
    updateTotalProviders: (state, action) => {
      state.totalProviders = action.payload;
    },

    updateTotalPendingProducts: (state, action) => {
      state.totalPendingProducts = action.payload;
    },
    updateNewUsersChart: (state, action) => {
      state.newUsersChart = action.payload;
    },
    updateProductsTrends: (state, action) => {
      state.productsTrends = action.payload;
    },
    updateUserLocations: (state, action) => {
      state.userLocations = action.payload;
    },

    updateNewOrdersChart: (state, action) => {
      state.newOrdersChart = action.payload;
    },
  },
});

export const {
  updateTotalUsers,
  updateNewUsersChart,
  updateProductsTrends,
  updateUserLocations,
  updateNewOrdersChart,
  updateTotalProducts,
  updateTotalPendingProducts,
  updateTotalProviders,

} = dashboardSlice.actions;
export default dashboardSlice.reducer;
