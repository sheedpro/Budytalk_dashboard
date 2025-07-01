import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertCircle, Trash2 } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiRequests } from '@/context/apiRequests';
import { User } from './types';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  interface Segment {
    name: string;
    value: number;
  }

  interface UserStats {
    total: number;
    disabled: number;
    pendingDeletion: number;
    segments: Segment[];
  }

  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    disabled: 0,
    pendingDeletion: 0,
    segments: []
  });

  const [disabledUsers, setDisabledUsers] = useState<User[]>([]);
  const [pendingDeletionUsers, setPendingDeletionUsers] = useState<User[]>([]);

  const fetchDisabledUsers = async () => {
    try {
      const response = await apiRequests.get(`users/disabled`);
      if (response.data && response.data.data) {
        setDisabledUsers(response.data.data); // Updated to handle flat array
      }
    } catch (error) {
      console.error("Error fetching disabled users:", error);
    }
  };

  const fetchPendingDeletionUsers = async () => {
    try {
      const response = await apiRequests.get(`users/pending-deletion`);
      if (response.data && response.data.data) {
        setPendingDeletionUsers(response.data.data); // Updated to handle flat array
      }
    } catch (error) {
      console.error("Error fetching pending deletion users:", error);
    }
  };

  const handleEnable = async (userId: number) => {
    try {
      await apiRequests.post(`users/${userId}/enable`);
      setDisabledUsers(disabledUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error enabling user:", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'disabled') {
      fetchDisabledUsers();
    } else if (activeTab === 'pending') {
      fetchPendingDeletionUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const [totalResponse, disabledResponse, pendingDeletionResponse] = await Promise.all([
          apiRequests.get('users'),
          apiRequests.get('users/disabled'),
          apiRequests.get('users/pending-deletion')
        ]);

        const totalUsers = totalResponse.data.data?.length || 0;
        const disabledUsers = disabledResponse.data.data?.length || 0;
        const pendingDeletionUsers = pendingDeletionResponse.data.data?.length || 0;

        setUserStats({
          total: totalUsers,
          disabled: disabledUsers,
          pendingDeletion: pendingDeletionUsers,
          segments: [
            { name: 'Active', value: totalUsers - disabledUsers - pendingDeletionUsers },
            { name: 'Disabled', value: disabledUsers },
            { name: 'Pending Deletion', value: pendingDeletionUsers }
          ]
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, []);

  const tabContent = {
    overview: (
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>User Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={userStats.segments}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" className="text-gray-600 dark:text-gray-300" />
                <YAxis className="text-gray-600 dark:text-gray-300" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(243 244 246)',
                    borderColor: 'rgb(229 231 235)',
                    color: 'rgb(17 24 39)'
                  }}
                />
                <Bar dataKey="value" fill="#50266f" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    ),
    disabled: (
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Disabled Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {disabledUsers.map(user => (
              <div
                key={user.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{user.full_name}</h3>
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Disabled
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.account_types}
                    </p>
                    {user.seller && (
                      <p className="text-sm text-blue-600 mt-1">
                        Seller: {user.seller.b_name}
                      </p>
                    )}
                    {user.buyer && (
                      <p className="text-sm text-green-600 mt-1">
                        Buyer: {user.buyer.b_name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                    <Link
                      to={`/user/${user.id}`}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleEnable(user.id)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                    >
                      Enable User
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Disabled since: {new Date(user.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {disabledUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No disabled users found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    ),
    pending: (
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Pending Deletion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {pendingDeletionUsers.map(user => (
              <div
                key={user.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{user.full_name}</h3>
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Pending Deletion
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.account_types}
                    </p>
                    {user.seller && (
                      <p className="text-sm text-blue-600 mt-1">
                        Seller: {user.seller.b_name}
                      </p>
                    )}
                    {user.buyer && (
                      <p className="text-sm text-green-600 mt-1">
                        Buyer: {user.buyer.b_name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                    <Link
                      to={`/user/${user.id}`}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Pending deletion since: {new Date(user.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {pendingDeletionUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending deletion users found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  };

  return (
    <div className="w-full p-6 space-y-6 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management Dashboard</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#f3eaf7] dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#50266f] dark:text-[#d9c4e6]">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-[#50266f] dark:text-[#d9c4e6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#50266f] dark:text-[#d9c4e6]">
              {userStats.total}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#f3eaf7] dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#50266f] dark:text-[#d9c4e6]">
              Disabled Users
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-[#50266f] dark:text-[#d9c4e6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#50266f] dark:text-[#d9c4e6]">
              {userStats.disabled}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#f3eaf7] dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#50266f] dark:text-[#d9c4e6]">
              Pending Deletion
            </CardTitle>
            <Trash2 className="h-4 w-4 text-[#50266f] dark:text-[#d9c4e6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#50266f] dark:text-[#d9c4e6]">
              {userStats.pendingDeletion}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Tabs */}
      <div className="w-full">
        {/* Tab Headers */}
        <div className="flex space-x-1 bg-[#f3eaf7] dark:bg-gray-800 p-1 rounded-lg">
          {Object.keys(tabContent).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 px-4 py-2 text-sm font-medium rounded-md
                ${activeTab === tab
                  ? 'bg-[#d9c4e6] text-[#50266f] dark:bg-[#50266f] dark:text-[#f3eaf7]'
                  : 'text-[#50266f] hover:bg-[#e9d8f0] dark:text-[#d9c4e6] dark:hover:bg-gray-700'}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {tabContent[activeTab as keyof typeof tabContent]}
        </div>
      </div>
    </div>
  );
}