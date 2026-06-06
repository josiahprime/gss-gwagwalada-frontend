"use client";

import React from "react";
import { useThemeStore } from "store/theme/themeStore";
import { 
  Mail, 
  Phone, 
  Home, 
  Calendar, 
  Shield, 
  Key, 
  Package, 
  Activity, 
  CreditCard, 
  Users,
  ShoppingCart, 
  BarChart2, 
  Settings, 
  Truck, 
  MessageSquare 
} from "lucide-react";

const mockAdmin = {
  name: "Prime Codes",
  role: "Super Admin",
  status: "Active",
  email: "samuel.greenfield@farmhub.com",
  phone: "+234 801 234 5678",
  farm: "RichField Farm and SmokeHouse LTD",
  location: "Abuja, Nigeria",
  memberSince: "Jan 2022",
  permissions: [
    { name: "Manage Products", icon: Package, active: true },
    { name: "Handle Payments", icon: CreditCard, active: true },
    { name: "View Analytics", icon: BarChart2, active: true },
    { name: "Manage Shipping", icon: Truck, active: true },
    { name: "View Orders", icon: ShoppingCart, active: true },
    { name: "Manage Staff", icon: Users, active: true },
    { name: "System Settings", icon: Settings, active: true },
    { name: "Customer Support", icon: MessageSquare, active: false },
  ],
  activity: {
    lastLogin: "Today, 9:42 AM",
    totalProducts: 1247,
    totalOrders: 389,
    revenue: 156432,
  },
  security: {
    passwordUpdated: "Mar 2023",
    twoFactorEnabled: true,
  },
};

const InfoCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="bg-white shadow-sm rounded-xl p-4 flex items-start space-x-4">
    <div className="bg-green-100 p-2 rounded-md">
      <Icon className="w-5 h-5 text-green-600" />
    </div>
    <div>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 py-3">
    <div className="bg-green-100 p-2 rounded-md">
      <Icon className="w-5 h-5 text-green-600" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  </div>
);



const PermissionItem = ({ icon: Icon, name, active }) => (
  <div className={`flex items-center space-x-2 p-3 rounded-md ${active ? "bg-green-50" : "bg-gray-100"} justify-between`}>
    <div className="flex items-center space-x-2">
      <div className={`${active ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"} p-2 rounded-md`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`${active ? "text-gray-900" : "text-gray-400"} font-medium`}>{name}</span>
    </div>
    {active && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
  </div>
);

export default function AdminProfilePage() {
  const theme = useThemeStore((s) => s.theme);
  return (
    <div
      className={`shadow-md p-5 m-5 space-y-8 rounded-lg transition-colors duration-500
        ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}
    >
      
      {/* Profile Header */}
      <section className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-green-600 text-white flex items-center justify-center rounded-full text-2xl font-bold">
            {mockAdmin.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mockAdmin.name}</h1>
            <p className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">{mockAdmin.role}</span>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{mockAdmin.status}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Managing agricultural operations and e-commerce platform</p>
          </div>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center space-x-2">
          <span>Edit Profile</span>
        </button>
      </section>


      {/* Activity Summary */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InfoCard icon={Activity} title="Last Login" value={mockAdmin.activity.lastLogin} subtitle="Session active" />
        <InfoCard icon={Package} title="Products Managed" value={mockAdmin.activity.totalProducts.toLocaleString()} subtitle="Total catalog items" />
        <InfoCard icon={Activity} title="Orders Reviewed" value={mockAdmin.activity.totalOrders.toLocaleString()} subtitle="This month" />
        <InfoCard icon={CreditCard} title="Revenue Handled" value={`$${mockAdmin.activity.revenue.toLocaleString()}`} subtitle="This quarter" />
      </section>

      


      {/* Account Information */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm rounded-xl p-6 space-y-0.5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <InfoItem icon={Mail} label="Email Address" value={mockAdmin.email} />
          <hr className="border-gray-200" />
          <InfoItem icon={Phone} label="Phone Number" value={mockAdmin.phone} />
          <hr className="border-gray-200" />
          <InfoItem icon={Home} label="Farm / Organization" value={mockAdmin.farm} />
          <hr className="border-gray-200" />
          <InfoItem icon={Home} label="Location" value={mockAdmin.location} />
          <hr className="border-gray-200" />
          <InfoItem icon={Calendar} label="Member Since" value={mockAdmin.memberSince} />
        </div>


        {/* Role & Permissions */}
        <div className="bg-white shadow-sm rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Role & Permissions</h2>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{mockAdmin.role}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockAdmin.permissions.map((perm, idx) => (
              <PermissionItem key={idx} icon={perm.icon} name={perm.name} active={perm.active} />
            ))}
          </div>
        </div>
      </div>


      

      {/* Security Section */}
      <section className="bg-white shadow-sm rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 text-gray-700">
              <Key className="w-5 h-5 text-green-500"/>
              <span>Password updated {mockAdmin.security.passwordUpdated}</span>
            </div>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">Change Password</button>
          </div>
          <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 text-gray-700">
              <Shield className="w-5 h-5 text-green-500"/>
              <span>2FA {mockAdmin.security.twoFactorEnabled ? "Enabled" : "Disabled"}</span>
            </div>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">Manage Security</button>
          </div>
        </div>
      </section>

    </div>
  );
}
