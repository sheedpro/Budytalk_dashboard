import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { AppDispatch } from "@/Redux/store";
import {
  updateTotalUsers,
  updateNewUsersChart,
  updateProductsTrends,
  updateUserLocations,
  updateNewOrdersChart,
  updateTotalProducts,
  updateTotalProviders,
  updateTotalPendingProducts
} from "@/Redux/slices/MainDasboardSlice";
import { apiRequests } from "@/context/apiRequests";

interface DayData {
  day: string;
  total: number;
}

interface MonthData {
  month: string;
  total: number;
}

interface WeekData {
  week: string;
  total: number;
}

export const useDashBoard = () => {
  const totalUsers = useSelector(
    (state: RootState) => state.dashboard.totalUsers.totalUsers
  );
  const totalProducts = useSelector(
    (state: RootState) => state.dashboard.totalProducts.totalProducts
  );
  const productsChange = useSelector(
    (state: RootState) => state.dashboard.totalProducts.change
  );
  const totalPendingProducts = useSelector(
    (state: RootState) => state.dashboard.totalPendingProducts.totalPendingProducts
  );
  const PendingProductsChange = useSelector(
    (state: RootState) => state.dashboard.totalPendingProducts.change
  );
  const totalProviders = useSelector(
    (state: RootState) => state.dashboard.totalProviders.totalProviders
  );
  const totalProvidersChange = useSelector(
    (state: RootState) => state.dashboard.totalProviders.change
  );
  const dailyUsers = useSelector(
    (state: RootState) => state.dashboard.newUsersChart.daily
  );
  const monthlyUsers = useSelector(
    (state: RootState) => state.dashboard.newUsersChart.monthly
  );
  const weeklyUsers = useSelector(
    (state: RootState) => state.dashboard.newUsersChart.weekly
  );
  const weeklyOrders = useSelector(
    (state: RootState) => state.dashboard.newOrdersChart.weekly
  );
  const dailyOrders = useSelector(
    (state: RootState) => state.dashboard.newOrdersChart.daily
  );
  const monthlyOrders = useSelector(
    (state: RootState) => state.dashboard.newOrdersChart.monthly
  );
  const usersChange = useSelector(
    (state: RootState) => state.dashboard.totalUsers.change
  );
  const usersLocations = useSelector(
    (state: RootState) => state.dashboard.userLocations
  );
  const mostDemandedProducts = useSelector(
    (state: RootState) => state.dashboard.productsTrends.mostDemandedProducts
  );

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const makeCalls = {
    getTotalUsers: async (dispatch: AppDispatch) => {
      try {
        const response = await apiRequests.getTotalUsers();
        const data = response.data;
        dispatch(
          updateTotalUsers({
            totalUsers: data.total_users,
            change: data.percentage_change,
          })
        );
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    },

    getTotalProducts: async (dispatch: AppDispatch) => {
      try {
        const response = await apiRequests.getTotalProducts();
        const data = response.data;
        dispatch(
          updateTotalProducts({
            totalProducts: data.total_products,
            change: data.percentage_change,
          })
        );
      } catch (error) {
        console.error("Error fetching total products:", error);
      }
    },

    getTotalProviders: async (dispatch: AppDispatch) => {
      try {
        const response = await apiRequests.getTotalProviders();
        const data = response.data;
        dispatch(
          updateTotalProviders({
            totalProviders: data.total_providers,
            change: data.percentage_change,
          })
        );
      } catch (error) {
        console.error("Error fetching total providers:", error);
      }
    },

    getTotalPendingProducts: async (dispatch: AppDispatch) => {
      try {
        const response = await apiRequests.getPendingProducts();
        const data = response.data;
        dispatch(
          updateTotalPendingProducts({
            totalPendingProducts: data.total_pending_products,
            change: data.percentage_change,
          })
        );
      } catch (error) {
        console.error("Error fetching total pending products:", error);
      }
    },
    
    getNewUsersChart: async (dispatch: AppDispatch) => {
      try {
        await delay(1000);
        const [dailyResponse, monthlyResponse, weeklyResponse] = await Promise.all([
          apiRequests.getDailyUsers(),
          apiRequests.getMonthlyUsers(),
          apiRequests.getWeeklyUsers()
        ]);

        const dailyData = Array.isArray(dailyResponse.data.usersByDay) ? dailyResponse.data.usersByDay : [];
        const monthlyData = Array.isArray(monthlyResponse.data.usersByMonth) ? monthlyResponse.data.usersByMonth : [];
        const weeklyData = Array.isArray(weeklyResponse.data.usersByWeek) ? weeklyResponse.data.usersByWeek : [];

        dispatch(
          updateNewUsersChart({
            daily: {
              labels: dailyData.map((day: DayData) => day.day),
              values: dailyData.map((day: DayData) => day.total),
            },
            monthly: {
              labels: monthlyData.map((month: MonthData) => month.month),
              values: monthlyData.map((month: MonthData) => month.total),
            },
            weekly: {
              labels: weeklyData.map((week: WeekData) => week.week),
              values: weeklyData.map((week: WeekData) => week.total),
            },
          })
        );
      } catch (error) {
        console.error("Error fetching new users chart:", error);
      }
    },

    getNewOrdersChart: async (dispatch: AppDispatch) => {
      try {
        await delay(1000);
        const [dailyResponse, monthlyResponse, weeklyResponse] = await Promise.all([
          apiRequests.getDailyOrders(),
          apiRequests.getMonthlyOrders(), 
          apiRequests.getWeeklyOrders()
        ]);

        const dailyData = Array.isArray(dailyResponse.data.ordersByDay) ? dailyResponse.data.ordersByDay : [];
        const monthlyData = Array.isArray(monthlyResponse.data.ordersByMonth) ? monthlyResponse.data.ordersByMonth : [];
        const weeklyData = Array.isArray(weeklyResponse.data.ordersByWeek) ? weeklyResponse.data.ordersByWeek : [];

        dispatch(
          updateNewOrdersChart({
            daily: {
              labels: dailyData.map((day: DayData) => day.day),
              values: dailyData.map((day: DayData) => day.total),
            },
            monthly: {
              labels: monthlyData.map((month: MonthData) => month.month),
              values: monthlyData.map((month: MonthData) => month.total),
            },
            weekly: {
              labels: weeklyData.map((week: WeekData) => week.week),
              values: weeklyData.map((week: WeekData) => week.total),
            },
          })
        );
      } catch (error) {
        console.error("Error fetching orders chart:", error);
      }
    },

    getProductsTrends: async (dispatch: AppDispatch) => {
      try {
        const response = await apiRequests.getMostDemandedProducts();
        dispatch(
          updateProductsTrends({
            mostDemandedProducts: response.data,
          })
        );
      } catch (error) {
        console.error("Error fetching products trends:", error);
      }
    },

    getUserLocations: async (dispatch: AppDispatch) => {
      try {
        const response = await apiRequests.getUsersLocations();
        dispatch(updateUserLocations(response.data.usersLocation));
      } catch (error) {
        console.error("Error fetching user locations:", error);
      }
    }
  };

  return {
    totalUsers,
    usersChange,
    makeCalls,
    dailyUsers,
    monthlyUsers,
    weeklyUsers,
    mostDemandedProducts,
    usersLocations,
    weeklyOrders,
    monthlyOrders,
    dailyOrders,
    totalProducts,
    productsChange,
    totalPendingProducts,
    PendingProductsChange,
    totalProviders,
    totalProvidersChange
  };
};
