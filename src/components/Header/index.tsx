import React from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTheme } from "../theme-provider";
import { Bell, Sun, Moon, LogOut, User, Settings, MessageCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Badge } from "@/components/ui/badge"
export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  return (
    <header className="flex h-16 items-center justify-between px-4 bg-white dark:bg-gray-900 shadow-sm">
      {/* Left Section: Sidebar Toggle and Search */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <SidebarTrigger className="text-gray-600 dark:text-gray-200">
          <Sun className="h-6 w-6" />
        </SidebarTrigger>

        <Separator orientation="vertical" className="h-6 bg-gray-300 dark:bg-gray-700" />

        {/* Search Box */}
        <div className="relative">
          <Input placeholder="Search..." className="pl-10" />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Sun className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Right Section: Notifications, Theme Toggle, and User Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Badge
            className="absolute top-0 right-0 h-2 w-2 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"
          />
        </div>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="h-4 w-4 mr-2 text-red-500" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
