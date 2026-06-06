"use client"
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BsFillCheckCircleFill, BsExclamationTriangleFill } from "react-icons/bs";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { useThemeStore } from "store/theme/themeStore";
import { FaServer } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { Activity, ShieldCheck } from "lucide-react";

const SystemHealth = () => {
  const cpuData = [{ name: "Used", value: 70 }, { name: "Free", value: 30 }];
  const memoryData = [{ name: "Used", value: 60 }, { name: "Free", value: 40 }];
  const theme = useThemeStore((s) => s.theme);

  const COLORS = ["#4caf50", "#d9d9d9"]; // Green for used, Gray for free

  return (

    <div className="flex">
      {/* Main Content */}
      <div
        className={`shadow-md p-4 m-4 w-full rounded-lg transition-colors duration-500
          ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}
      >

        <div className="p-6">     
        <DashboardHeader
          title="System Health Dashboard"
          description="Monitor system performance, uptime, and service status"
          badgeText="System"
          BadgeIcon={ShieldCheck}
          infoLabel="Live system status"
          InfoIcon={Activity}
          theme={theme}
        />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Server Status */}
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaServer className="text-green-500 mr-2" /> Server Status
              </h2>
              <p className="text-gray-600">
                <BsFillCheckCircleFill className="text-green-500 mr-2 inline" />
                Database: Connected
              </p>
              <p className="text-gray-600">
                <BsFillCheckCircleFill className="text-green-500 mr-2 inline" />
                API: Online
              </p>
              <p className="text-gray-600">
                <BsExclamationTriangleFill className="text-yellow-500 mr-2 inline" />
                Pending Updates: 2
              </p>
            </div>

            {/* CPU Usage */}
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">CPU Usage</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={cpuData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cpuData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-gray-600 text-center mt-4">70% Used</p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Memory Usage</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={memoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {memoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-gray-600 text-center mt-4">60% Used</p>
            </div>

            {/* Network Health */}
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MdSecurity className="text-blue-500 mr-2" /> Network Health
              </h2>
              <p className="text-gray-600">
                <BsFillCheckCircleFill className="text-green-500 mr-2 inline" />
                Bandwidth Usage: 40%
              </p>
              <p className="text-gray-600">
                <BsFillCheckCircleFill className="text-green-500 mr-2 inline" />
                Average Response Time: 200ms
              </p>
              <p className="text-gray-600">
                <BsExclamationTriangleFill className="text-yellow-500 mr-2 inline" />
                Minor Latency Detected
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 col-span-1 md:col-span-2 lg:col-span-3">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                System Uptime
              </h2>
              <p className="text-gray-600">
                <BsFillCheckCircleFill className="text-green-500 mr-2 inline" />
                System has been running for <strong>14 days</strong> without issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
