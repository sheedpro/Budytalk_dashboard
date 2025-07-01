import { createBrowserRouter } from "react-router-dom";
import "./index.css";



import Dashboard from './app/dashboard/DashBoard.tsx';

import Login from './app/dashboard/Pages/Login.tsx';


import UserDashboard from "./app/pages/Users/usersDasboard.tsx";

import AuthGuard from "./utils/AuthGard.ts";

import Page from "./app/pages/page.tsx";




//import ReportsPage from "./components/loyalty/ReportsPage.tsx";


import AdminOtp from "./app/otp/Otp.tsx";
import RequestOtp from "./app/otp/RequestOtp.tsx";




// import { DeliveryDashboard } from "./components/DeliveryManagement/delivery-dashboard.tsx";
import PasswordReset from "./app/usermanagement/normal-admin/SetPassword.tsx";
import AdminSignIn from "./app/usermanagement/normal-admin/InitialSignIn.tsx";
import PostsDashboard from "./app/pages/Posts/PostsDasboard.tsx";
import PollsDashboard from "./app/pages/Polls/PollsDasboard.tsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password",
    element: <PasswordReset />,
  },
  { 
    path: "/initial-sign-in", 
    element: <AdminSignIn />
  },
  {
    path: "/request-otp",
    element: <RequestOtp />,
  },
  {
    path: "/verify-otp",
    element: <AdminOtp />,
  },
  {
    path: "/",
    element: <Page />,
    children: [
      /*********** DASHBOARD********************************************* */
      { path: "/", element: <Dashboard /> },
      { path: "/set-password", element: <PasswordReset /> },

      /*********** INVENTORY********************************************* */
     
{ path: "/users", element: <UserDashboard /> },

      
      { path: "/posts", element: <PostsDashboard /> },
      { path: "/polls", element: <PollsDashboard /> },

   
     
    ],
  },
]);