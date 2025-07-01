import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Users, UserX, UserCheck, UserMinus, User } from "lucide-react";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { useUsers } from "@/hooks/useUsers";
import { useDispatch } from "react-redux";

// Types
interface Follower {
  id: string;
  isConnectionAccepted: boolean;
}

interface User {
  id: string;
  email: string;
  user_name: string;
  firstName: string | null;
  lastName: string | null;
  password: string;
  country: string | null;
  position: string | null;
  company: string | null;
  role: string;
  about: string | null;
  userBio: string | null;
  birthDate: string | null;
  profilePhotoUrl: string | null;
  gender: string | null;
  coverPhotoUrl: string | null;
  phone_Number: string | null;
  location: string | null;
  userHeadline: string | null;
  username: string | null;
  currentPosition: string | null;
  industry: string | null;
  websiteUrl: string | null;
  fcm_token: string | null;
  authenticationSource: string;
  dateCreated: string;
  headLine: string | null;
  city: string | null;
  UserProfile: any | null;
  following: Follower[];
  followers: Follower[];
}

interface DashboardData {
  newUsers: { month: string; count: number }[];
  activeUsers: number;
  deletedUsers: number;
  bannedUsers: number;
  notAuthenticatedUsers: number;
  users: User[];
}

// Mock data
const mockData: DashboardData = {
  newUsers: [
    { month: "Jan", count: 120 },
    { month: "Feb", count: 150 },
    { month: "Mar", count: 180 },
    { month: "Apr", count: 200 },
    { month: "May", count: 230 },
  ],
  activeUsers: 1500,
  deletedUsers: 50,
  bannedUsers: 25,
  notAuthenticatedUsers: 100,
  users: [
    {
      id: "e388f1f3-674d-4bfa-ad76-a96a7d5bc14a",
      email: "mike@gmail.com",
      user_name: "Mike",
      firstName: null,
      lastName: null,
      password: "$2b$12$olS3T5OuxAHnoB/HO1GElOjwNOCeB8nMgkZvUpg2MNUe4BZmwIv3C",
      country: "uganda",
      position: null,
      company: null,
      role: "User",
      about: null,
      userBio: null,
      birthDate: null,
      profilePhotoUrl: null,
      gender: null,
      coverPhotoUrl: null,
      phone_Number: null,
      location: null,
      userHeadline: null,
      username: null,
      currentPosition: null,
      industry: null,
      websiteUrl: null,
      fcm_token: "f5l0JToUR5qZoKhYU9TH22:APA91bGsTs0dZ4A5825oKd_UxAwzSRo69fCXj3Y0qkJcIHgYXj5B_uJIGCVIQhc7ryXYKMmtdJjHOIrc1C_on2LwPbGh_TdX2RD_znnq_gUkGzmDpqdLqgg",
      authenticationSource: "Self",
      dateCreated: "2024-10-19T16:55:22.642Z",
      headLine: null,
      city: null,
      UserProfile: null,
      following: [{ id: "f65da0ba-6760-4157-9f78-9c1bc261630c", isConnectionAccepted: false }],
      followers: [
        { id: "746400f7-d41c-4455-9b42-3d62d6fec2e5", isConnectionAccepted: false },
        { id: "0f357378-23ff-46cb-b29f-3d62d6fba4", isConnectionAccepted: false },
      ],
    },
  ],
};

// User Stats Card Component
const UserStatsCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

// New Users Chart Component
const NewUsersChart: React.FC<{ data: { month: string; count: number }[] }> = ({ data }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>New Users per Month</CardTitle>
    </CardHeader>
    <CardContent>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
    </CardContent>
  </Card>
);

// Users Table Component
const UsersTable: React.FC<{ users: User[]; onViewUser: (user: User) => void; onOpen: (open: boolean) => void }> = ({ users, onViewUser, onOpen }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Users</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.user_name || "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.country || "N/A"}</TableCell>
              <TableCell>{new Date(user.dateCreated).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => {
                  onViewUser(user);
                  onOpen(true);
                }}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

// User Detail Component
const UserDetail: React.FC<{ user: User | null; }> = ({ user }) => {
  if (!user) return null;
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Username:</h3>
            <p>{user.user_name || "N/A"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Email:</h3>
            <p>{user.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">Role:</h3>
            <p>{user.role}</p>
          </div>
          <div>
            <h3 className="font-semibold">Country:</h3>
            <p>{user.country || "N/A"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Date Created:</h3>
            <p>{new Date(user.dateCreated).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="font-semibold">Followers:</h3>
            <p>{user.followers.length} ({user.followers.filter(f => f.isConnectionAccepted).length} accepted)</p>
          </div>
          <div>
            <h3 className="font-semibold">Following:</h3>
            <p>{user.following.length} ({user.following.filter(f => f.isConnectionAccepted).length} accepted)</p>
          </div>
          <div>
            <h3 className="font-semibold">Authentication Source:</h3>
            <p>{user.authenticationSource}</p>
          </div>
          {/* <Button onClick={onClose}>Close</Button> */}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const AdminDashboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const { Users, makeUserCalls } = useUsers();
  const dispatch = useDispatch();
  useEffect(() => {
    makeUserCalls.fetchUsers(dispatch);
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">BudyTalk Users Management</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserStatsCard title="Active Users" value={Users.length} icon={<UserCheck className="h-4 w-4 text-green-500" />} />
        <UserStatsCard title="Deleted Users" value={Users.length} icon={<UserMinus className="h-4 w-4 text-red-500" />} />
        <UserStatsCard title="Banned Users" value={Users.length} icon={<UserX className="h-4 w-4 text-orange-500" />} />
        <UserStatsCard title="Not Authenticated" value={Users.length} icon={<User className="h-4 w-4 text-gray-500" />} />
      </div>

      {/* New Users Chart */}
      <NewUsersChart data={mockData.newUsers} />

      {/* Users Table */}
      <UsersTable users={Users} onViewUser={setSelectedUser} onOpen={setOpen} />

      {/* User Detail Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
       <UserDetail user={selectedUser} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;