
import { getBuyers,getBuyerOrders ,getUsers} from "@/Redux/slices/UserSlice/UserSlice";
import { AppDispatch } from "@/Redux/store";
import { RootState } from "@/Redux/store";
import { useSelector } from "react-redux";
  import { apiRequests } from "@/context/apiRequests";
export const useUsers = () => {
  const Buyers = useSelector((state: RootState) => state.users.buyers);
  const Users = useSelector((state: RootState) => state.users.users);
  const BuyersOrders = useSelector((state: RootState) => state.users.buyerOrders);
  const makeUserCalls = {
    fetchBuyers: async (dispatch: AppDispatch) => {
            const response = await apiRequests.getBuyers();
      dispatch(getBuyers(response.data.buyers.data));
      console.log("Fetched buyers", response.data.buyers.data);
    },
    fetchBuyerOrders: async (dispatch: AppDispatch, buyerId: number) => {
      const response = await apiRequests.getBuyerOrders(buyerId);
      dispatch(getBuyerOrders(response.data.buyerOrders.data));
      console.log("Fetched buyer orders", response.data.buyer_orders.data);
    },
    fetchUsers: async (dispatch: AppDispatch) => {
      const response = await apiRequests.getUsers();
      dispatch(getUsers(response.data.data));
      console.log("Fetched total users", response.data.users.data);
    },
    // Add more API calls as needed
  
  };
  return {
    makeUserCalls,
    Buyers,
    BuyersOrders,
    Users,
    // Add more state variables as needed
  };
};
