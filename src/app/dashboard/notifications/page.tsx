"use client";

import React, { useEffect } from "react";
import { useAdminAlertStore } from "store/adminAlert/useAdminAlert";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import {
  Bell,
  BellOff,
  Package,
  AlertCircle,
  Clock,
  Star,
  CheckCircle,
  Info,
  BellRing,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import EmptyState from "app/components/ui/EmptyState";

// Map backend alert types to icons
const notificationIconMap = {
  order: { icon: Package, color: "text-orange-600", bgColor: "bg-orange-100" },
  alert: { icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-100" },
  feedback: { icon: Star, color: "text-yellow-600", bgColor: "bg-yellow-100" },
  info: { icon: Info, color: "text-blue-600", bgColor: "bg-blue-100" },
  default: { icon: Bell, color: "text-gray-600", bgColor: "bg-gray-100" },
};

const DashboardNotificationsPage = () => {
  const { alerts, loading, fetchAdminAlerts, markAllRead } =
    useAdminAlertStore();

  useEffect(() => {
    fetchAdminAlerts();
  }, [fetchAdminAlerts]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border min-h-[85dvh] border-gray-200">
          {/* HEADER */}
          <DashboardHeader
            title="Notifications"
            description="Stay updated with your latest activities and alerts"
            badgeText="Alerts"
            BadgeIcon={Bell}
            infoLabel="View Notifications"
            InfoIcon={BellRing}
          />


          {/* QUICK ACTIONS */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={markAllRead}
              className="flex items-center px-4 py-2 border border-green-300 text-green-600 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All as Read
            </button>
          </div>

          {/* LIST */}
          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-500 text-sm">
              Loading notifications...
            </div>
          ) : alerts.length === 0 ? (
            <EmptyState
              icon={<BellOff size={48} className="text-green-500" />}
              title="You’re all caught up"
              description="No new notifications at the moment."
            />
          ) : (
            <div className="space-y-4">
              {alerts.map((notification) => {
                const { icon: Icon, color, bgColor } =
                  notificationIconMap[
                    notification.type as keyof typeof notificationIconMap
                  ] || notificationIconMap.default;

                return (
                  <div
                    key={notification.id}
                    className={`p-5 rounded-2xl cursor-pointer transition-all duration-300
                      border border-transparent hover:border-green-200 hover:shadow-md shadow
                      transform hover:scale-[1.01]
                      ${
                        !notification.seen
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500"
                          : "bg-gray-50"
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`p-3 rounded-2xl ${bgColor} shadow-inner`}
                      >
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4
                            className={`font-semibold text-sm ${
                              !notification.seen
                                ? "text-green-800"
                                : "text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </h4>

                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true }
                            )}
                          </span>
                        </div>

                        <p className="text-gray-600 text-xs leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardNotificationsPage;
