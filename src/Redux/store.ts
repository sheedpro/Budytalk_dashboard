import { configureStore } from '@reduxjs/toolkit';
import orderReducer from '../Redux/slices/OrderSlice';
import dashboardReducer from '../Redux/slices/MainDasboardSlice'
import userReducer from '../Redux/slices/UserSlice/UserSlice';
import postReducer from '../Redux/slices/PostSlice';
const store = configureStore({
  reducer: {
    orders: orderReducer,
    dashboard: dashboardReducer,
    users:userReducer,  
    posts:postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
console.log('Store:', store.getState());
export default store;
