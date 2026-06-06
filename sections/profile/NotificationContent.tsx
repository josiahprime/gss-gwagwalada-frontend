"use client";

import {
  Bell,
  BellOff,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  Leaf,
  Star,
} from "lucide-react";

import { useEffect, useState, useRef, useCallback } from "react";
import useNotificationsStore from "store/notification/useNotificationStore";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import Button from "app/components/Button/Button";
import { useAuthStore } from "store/auth/useAuthStore";
import NotificationSkeleton from "app/components/ui/NotificationSkeleton";

const notificationIconMap = {
  order: { icon: Package, color: "text-orange-600", bgColor: "bg-orange-100" },
  delivered: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" },
  shipping: { icon: Truck, color: "text-blue-600", bgColor: "bg-blue-100" },
  promotion: { icon: Leaf, color: "text-emerald-600", bgColor: "bg-emerald-100" },
  alert: { icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-100" },
  review: { icon: Star, color: "text-yellow-600", bgColor: "bg-yellow-100" },
  default: { icon: Bell, color: "text-gray-600", bgColor: "bg-gray-100" },
};

export function NotificationsContent() {
  const [visibleCount, setVisibleCount] = useState(5);
  const observer = useRef<IntersectionObserver | null>(null);

  const searchParams = useSearchParams();
  const currentSection = searchParams.get("section");

  const userId = useAuthStore((state) => state.authUser?.id);
  const router = useRouter();

  const notifications = useNotificationsStore((state) => state.notifications);
  const fetchNotifications = useNotificationsStore((state) => state.fetchNotifications);
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const markAllAsSeen = useNotificationsStore((state) => state.markAllAsSeen);
  const isLoading = useNotificationsStore((state) => state.isLoading);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark all as seen when userId becomes available
  useEffect(() => {
    if (userId) markAllAsSeen(userId);
  }, [userId, markAllAsSeen]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  // const unreadCount = notifications.filter((n) => !n.seen).length;
  const visibleNotifications = notifications.slice(0, visibleCount);

  const handleNotificationClick = async (notificationId: string) => {
    const notification = notifications.find((n) => n.id === notificationId);

    if (notification && !notification.read) {
      const success = await markAsRead(notificationId);
      if (!success) {
        toast.error("Failed to mark notification as read.");
        return;
      }
    }

    router.push(`/account?section=${currentSection}&id=${notification?.id}`);
  };

  const handleLoadMore = () => {
    if (visibleCount < notifications.length) {
      setVisibleCount((prev) => prev + 5);
    }
  };

  const lastNotificationRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && visibleCount < notifications.length) {
            handleLoadMore();
          }
        },
        { rootMargin: "100px" }
      );

      if (node) observer.current.observe(node);
    },
    [visibleCount, notifications.length]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <NotificationSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl border border-green-100">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-2xl">
            <Bell className="w-6 h-6 text-green-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-gray-600 text-sm">
              Stay updated with your orders and farm news
            </p>
          </div>
        </div>

        {visibleCount < notifications.length && (
          <div className="flex justify-center mt-4">
            <div className="w-full max-w-xl p-5 rounded-2xl bg-white border border-gray-100 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-gray-200 w-10 h-10 flex-shrink-0"></div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button
          variant="outline"
          size="sm"
          className="border-green-300 text-green-600 hover:bg-green-50"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark All as Read
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-green-300 text-green-600 hover:bg-green-50"
        >
          Filter by Orders
        </Button>
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
          <BellOff className="w-16 h-16 mb-4 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            You&apos;re All Caught Up!
          </h3>
          <p className="text-sm max-w-sm">
            You don&apos;t have any notifications right now. We&apos;ll keep you updated
            when something comes up.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleNotifications.map((notification, index) => {
            const isLast = index === visibleNotifications.length - 1;

            const { icon: Icon, color, bgColor } =
              notificationIconMap[
                notification.type as keyof typeof notificationIconMap
              ] || notificationIconMap.default;

            return (
              <div
                key={notification.id}
                ref={isLast ? lastNotificationRef : null}
                onClick={() => handleNotificationClick(notification.id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent hover:border-green-200 hover:shadow-md transform hover:scale-[1.01] ${
                  !notification.seen
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${bgColor} shadow-inner`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4
                        className={`font-semibold text-gray-900 text-sm ${
                          !notification.seen ? "text-green-800" : ""
                        }`}
                      >
                        {notification.title}
                      </h4>

                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <p className="text-gray-600 text-xs leading-relaxed">
                      {notification.message}
                    </p>

                    <p className="text-green-600 text-xs mt-1 font-medium">
                      Click to read more...
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {visibleCount < notifications.length && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">Loading more notifications...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
