import * as React from "react";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Package,
  SquareTerminal,
  User,
  NotebookPen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BookOpen } from "lucide-react";
import { apiRequests } from "@/context/apiRequests";
import { IMAGE_BASE_URL } from "@/context/apiRequests";
import { iconLogo } from "@/Constants";


const navMainData = [
  {
    title: "Dashboard",
    url: "/",
    icon: BookOpen,
    isActive: true,
  },
  {
    title: "Users Management",
    url: "/users",
    icon: BookOpen,
    isActive: false,
    // items: [
    //   { title: "User List", url: "/users-list" },
    //   { title: "Disabled Users", url: "/users/disabled" },
    //   { title: "Pending Deletion Users", url: "/users/pending-deletion" },
    //   { title: "User Reports", url: "/user-reports" },
    // ],
  },
  {
    title: "Posts",
    url: "/posts",
    icon: SquareTerminal,
    // isActive: false,
      items: [
        { title: "All Posts", url: "/posts" },
        { title: "Add new Post", url: "/add-post" },
        //{ title: "Pending Products", url: "/pending-products" },
        { title: "Add Post Name", url: "/create-post-type" },
        { title: "Post Names", url: "/post-types" },
        { title: "Post Type", url: "/post-type-names" },
      ],
  },
  {
    title: "Polls",
    url: "/polls",
    icon: Package,
      // items: [
      //   { title: "All Polls", url: "/polls" },
      //   { title: "Add new Poll", url: "/add-poll" },
      //   { title: "Poll Names", url: "/poll-names" },
      //   { title: "Poll Type", url: "/poll-type-names" },
      // ],
  },
  {
    title: "Approvals",
    url: "/product-actions",
    icon: NotebookPen,
    items: [
      // { title: "Pending Products", url: "/product-actions" },
    ],
  },
 
  // {
  //   title: "Reports",
  //   url: "/reports",
  //   icon: Package,
  // },
  // {
  //   title: "Template Management",
  //   url: "/template-management",
  //   icon: Package,
  // },
  // {
  //   title: "Admin Team",
  //   url: "/user-management",
  //   icon: User,
  //   items: [
  //     { title: "Overview", url: "/overview-admin" },
  //     { title: "Create Administator", url: "/create-admin" },
  //     { title: "Super Admin Controls", url: "/admin-controls" },
  //     { title: "Approve User Deletion", url: "/users/approve-deletion" },
  //     { title: "Trashed Admins", url: "/trashed-admins" },
  //     { title: "Audit Logs", url: "/audit-logs" },
  //   ],
  // },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState({
    full_name: "Unknown User",
    email: "unknown@example.com",
    avatar: "/avatars/default.jpg",
    roles: [],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiRequests.getUserProfile();

        const storedRoles = localStorage.getItem("user_roles");
        const userRoles = storedRoles ? JSON.parse(storedRoles) : [];

        if (response && response.status === 'SUCCESS' && response.profile) {
          const userData = response.profile;

          // Use email as display name if full_name is empty
          const displayName = userData.full_name && userData.full_name.trim() !== ""
            ? userData.full_name
            : userData.email.split('@')[0] || "Unknown User";

          setUser({
            full_name: displayName,
            email: userData.email || "unknown@example.com",
            avatar: userData.picture
              ? `${IMAGE_BASE_URL}${userData.picture}`
              : "/avatars/default.jpg",
            roles: userRoles,
          });
        } else {
          throw new Error("Invalid or unexpected response structure");
        }
      } catch (error) {
        // Fallback to localStorage data
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const storedRoles = localStorage.getItem("user_roles");
        const userRoles = storedRoles ? JSON.parse(storedRoles) : [];

        setUser({
          full_name: storedUser.full_name || "Unknown User",
          email: storedUser.email || "unknown@example.com",
          avatar: storedUser.picture
            ? `${IMAGE_BASE_URL}${storedUser.picture}`
            : "/avatars/default.jpg",
          roles: userRoles,
        });
      }
    };

    fetchUserProfile();
  }, []);

  const storedRoles = localStorage.getItem("user_roles");
  const userRoles = storedRoles ? JSON.parse(storedRoles) : [];
  const isSuperAdmin = userRoles.includes("super-admin");
  const isProductManager =
    userRoles.includes("product_stock_manager") ||
    userRoles.includes("super-admin") ||
    userRoles.includes("general_manager");
  const isUserAccountsManager =
    userRoles.includes("user_accounts_manager") ||
    userRoles.includes("super-admin") ||
    userRoles.includes("general_manager");
  const isLoyaltyManager =
    userRoles.includes("promotions_loyalty_manager") ||
    userRoles.includes("super-admin") ||
    userRoles.includes("general_manager");
  const isGeneralManager =
    userRoles.includes("general_manager") ||
    userRoles.includes("super-admin");
  const isOrderManager =
    userRoles.includes("order_placement_manager") ||
    userRoles.includes("order_fulfillment_manager") ||
    userRoles.includes("returns_refunds_manager") ||
    userRoles.includes("general_manager") ||
    userRoles.includes("super-admin");


  const filteredNavMain = navMainData.filter((item) => {
    if (!isSuperAdmin && item.title === "Admin Team") return false;
    if (!isProductManager && item.title === "Products") return false;
    if (!isProductManager && item.title === "Categories") return false;
    if (!isUserAccountsManager && item.title === "Users Management") return false;
    if (!isLoyaltyManager && item.title === "Promotions & Loyalty") return false;
    if (!isGeneralManager && item.title === "Approvals") return false;
    if (!isOrderManager && item.title === "Orders") return false;
    return true;
  });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
                <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src={iconLogo} className="w-8 h-8 rounded-sm" alt="logo" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Budytalk</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}