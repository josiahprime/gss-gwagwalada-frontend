"use client";

import Link from "next/link";
import { useThemeStore } from "store/theme/themeStore";
import {
  Home, User, CreditCard, Truck, Store, BarChart2, 
  Settings, LogOut, Bell, UserCircle, Tag, Percent, Bug
} from "lucide-react";

const Sidebar = () => {
  const setTheme = useThemeStore((s) => s.setTheme);
  const theme = useThemeStore((s) => s.theme);

  const sidebarTheme =
    theme === "dark"
      ? "bg-gray-900 text-white border-r border-gray-800"
      : "bg-white text-gray-900 border-r border-gray-200";

  return (
    <div className={`fixed left-0 top-[50px] bottom-0 w-40 flex flex-col p-2 shadow-lg transition-colors duration-500 ease-in-out ${sidebarTheme}`}>
      {/* Navigation */}
      <div className="pl-2 flex-grow">
        <ul className="list-none m-0 p-0 space-y-1">
          <SidebarSection title="MAIN" />
          <SidebarItem to="/dashboard" icon={<Home size={18} />} label="Dashboard" />

          <SidebarSection title="LISTS" />
          <SidebarItem to="/dashboard/users" icon={<User size={18} />} label="Users" />
          <SidebarItem to="/dashboard/products" icon={<Store size={18} />} label="Products" />
          <SidebarItem to="/dashboard/orders" icon={<CreditCard size={18} />} label="Orders" />
          <SidebarItem to="/dashboard/delivery" icon={<Truck size={18} />} label="Delivery" />
          <SidebarItem to="/dashboard/discounts" icon={<Tag size={18} />} label="Discounts" />
          <SidebarItem 
            to="/dashboard/promotions" 
            icon={<Percent size={18} />} 
            label="Promotions" 
          />


          <SidebarSection title="USEFUL" />
          {/* <SidebarItem to="/dashboard/stats" icon={<BarChart2 size={18} />} label="Stats" /> */}
          <SidebarItem to="/dashboard/notifications" icon={<Bell size={18} />} label="Notifications" />

          <SidebarSection title="SERVICE" />
          <SidebarItem to="/dashboard/system-health" icon={<Settings size={18} />} label="System Health" />
          <SidebarItem to="/dashboard/logs" icon={<Percent size={18} />} label="Logs" />
          <SidebarItem to="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />

          <SidebarSection title="USER" />
          <SidebarItem to="/dashboard/profile" icon={<UserCircle size={18} />} label="Profile" />
          <SidebarItem to="/dashboard/bug-reports" icon={<Bug size={18} />} label="Bug Report" />
          <SidebarItem to="/dashboard/logout" icon={<LogOut size={18} />} label="Logout" />
        </ul>

        {/* Dark Mode Toggle */}
        <div className="flex items-center p-2 mt-2">
          <div
            className={`w-5 h-5 rounded-sm border border-indigo-600 cursor-pointer bg-gray-200 ${theme === "light" ? "ring-2 ring-indigo-500" : ""}`}
            onClick={() => setTheme("light")}
          ></div>

          <div
            className={`w-5 h-5 rounded-sm border border-indigo-600 cursor-pointer mx-1 bg-gray-800 ${theme === "dark" ? "ring-2 ring-indigo-500" : ""}`}
            onClick={() => setTheme("dark")}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ to, icon, label }) => (
  <Link href={to} className="flex items-center p-1 cursor-pointer hover:bg-indigo-50 hover:text-gray-800 rounded-md transition-colors duration-500 ease-in-out">
    <span className="text-green-500 text-lg">{icon}</span>
    <span className="ml-2 text-sm font-semibold">{label}</span>
  </Link>
);

// Sidebar Section Title
const SidebarSection = ({ title }) => (
  <p className="text-xs font-bold text-gray-500 mt-1 mb-1 transition-colors duration-500 ease-in-out">{title}</p>
);

export default Sidebar;
