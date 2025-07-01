import { Outlet } from "react-router";
import { useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, UserMinus, UserX, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import NewUsersChart from "@/components/DashBoard/NewUsersChart";
// import EngagementChart from "@/components/DashBoard/EngagementChart"; 
// import PostsActivityChart from "@/components/DashBoard/PostsActivityChart";
// import UserLocationMap from "@/components/DashBoard/UserLocations";
// import PopularPostsTable from "@/components/DashBoard/PopularPostsTable";
// import ActiveUsersTable from "@/components/DashBoard/ActiveUsersTable";

import { useUsers } from "@/hooks/useUsers";
import { useDashBoard } from "@/hooks/useDashBoard";
import { useEffect } from "react";

export interface TimeframeData {
  date: string;
  value: number;
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const {
    totalUsers,
    usersChange,
    makeCalls,
    dailyUsers,
    monthlyUsers,
    weeklyUsers,
    popularPosts,
    usersLocations,
    postEngagement,
    activeUsers,
    newConnections,
    totalPosts,
    postsChange,
    totalReactions,
    reactionsChange
  } = useDashBoard() as unknown as {
    totalUsers: number;
    usersChange: number;
    makeCalls: any;
    dailyUsers: TimeframeData | null;
    monthlyUsers: TimeframeData | null;
    weeklyUsers: TimeframeData | null;
    popularPosts: any;
    usersLocations: any;
    postEngagement: any;
    activeUsers: any;
    newConnections: any;
    totalPosts: number;
    postsChange: number;
    totalReactions: number;
    reactionsChange: number;
  };

  const { Users, makeUserCalls } = useUsers();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await makeCalls.getTotalUsers(dispatch);
        await makeCalls.getNewUsersChart(dispatch);
        await makeCalls.getPopularPosts(dispatch);
        await makeCalls.getUserLocations(dispatch);
        await makeCalls.getPostEngagement(dispatch);
        await makeUserCalls.fetchUsers(dispatch);
        await makeCalls.getTotalPosts(dispatch);
        await makeCalls.getTotalReactions(dispatch);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const defaultTimeframeData: TimeframeData = { date: "", value: 0 };
  
  const transformedDailyUsers = dailyUsers ?? defaultTimeframeData;
  const transformedMonthlyUsers = monthlyUsers ?? defaultTimeframeData;
  const transformedWeeklyUsers = weeklyUsers ?? defaultTimeframeData;

  const statsData = [
    {
      _id: 1,
      _title: "Total Users",
      total: totalUsers || 0,
      trend: usersChange || 0,
      icon: <UserCheck className="h-4 w-4 text-green-500" />
    },
    {
      _id: 2,
      _title: "Total Posts",
      total: totalPosts || 0,
      trend: postsChange || 0,
      icon: <User className="h-4 w-4 text-blue-500" />
    },
    {
      _id: 3,
      _title: "Total Reactions",
      total: totalReactions || 0,
      trend: reactionsChange || 0,
      icon: <UserMinus className="h-4 w-4 text-purple-500" />
    },
    {
      _id: 4,
      _title: "New Connections",
      total: newConnections?.total || 0,
      trend: newConnections?.change || 0,
      icon: <UserX className="h-4 w-4 text-orange-500" />
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
      <div className="w-full overflow-y-auto">
        <Outlet />

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((data) => (
            <Card key={data._id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{data._title}</CardTitle>
                {data.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.total}</div>
                <p className={`text-xs ${data.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {data.trend >= 0 ? '+' : ''}{data.trend}% from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Growth and Engagement Charts */}
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="w-full lg:w-1/2">
            {/* <NewUsersChart 
              daily={transformedDailyUsers} 
              monthy={transformedMonthlyUsers} 
              weekly={transformedWeeklyUsers}
            /> */}
          </div>
          {/* <div className="w-full lg:w-1/2">
            <EngagementChart data={postEngagement ?? []} />
          </div> */}
        </div>
        
        {/* User Locations and Posts Activity */}
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          {/* <div className="w-full lg:w-1/2">
            <UserLocationMap UserLocation={usersLocations ?? []} />
          </div> */}
          {/* <div className="w-full lg:w-1/2">
            <PostsActivityChart data={popularPosts ?? []} />
          </div> */}
        </div>

        {/* Popular Posts and Active Users Tables */}
        {/* <div className="mt-4">
          <PopularPostsTable posts={popularPosts ?? []} />
        </div> */}
        
        {/* <div className="mt-4">
          <ActiveUsersTable users={activeUsers ?? []} />
        </div> */}
      </div>
    </div>
  );
}