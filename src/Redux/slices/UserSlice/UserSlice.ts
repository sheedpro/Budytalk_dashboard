import { Users } from "./UserTypes";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Users = {
  buyers: [],
  buyerOrders: [],
  users: [],
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
      getBuyers: (state, action) => {
        state.buyers = action.payload;
      },
      getBuyerOrders: (state, action) => {
        state.buyerOrders = action.payload;
      },
      // Add other reducers here

      getUsers:(state,action)=>{
        state.users = action.payload;
      }
    },

})
export default usersSlice.reducer;
export const { getBuyers,getBuyerOrders,getUsers } = usersSlice.actions;

        