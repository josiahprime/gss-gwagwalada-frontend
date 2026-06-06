
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Leaf,
  MoreHorizontal,
} from "lucide-react";
// import { useSearchParams } from "next/navigation";
import Link from "next/link";
import useNotificationsStore from "store/notification/useNotificationStore";
import { formatDistanceToNow } from "date-fns";

interface NotificationDetailProps {
  notificationId: string;
}

const NotificationDetail = ({ notificationId }: NotificationDetailProps) => {
  const notifications = useNotificationsStore((state) => state.notifications);
  // const searchParams = useSearchParams();
  // const id = searchParams.get("id");



  

  const notification = notifications.find((n) => n.id === notificationId);
  console.log('notification', notification)
  //rounded-lg bg-card text-card-foreground shadow-lg
  if (!notification) {
    return (
      <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center rounded-lg border bg-white text-slate-900 shadow-sm">
          <div className="p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-xl font-bold mb-2">Message Not Found</h1>
            <p className="text-gray-600 mb-6">
              The message you&apos;re looking for doesn&apos;t exist.
            </p>

            <Link href="/account">
              <button className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 w-full">
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const iconMap = {
    ORDER: CheckCircle,
    SHIPPING: Truck,
    PROMOTION: Leaf,
  };
  
 const IconComponent = iconMap[notification.type.toUpperCase() as keyof typeof iconMap] || AlertCircle;


  return (
    <div className="min-h-screen shadow-lg rounded-lg bg-card flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/account">
              <button className="h-9 px-3 flex items-center justify-center gap-2 text-sm font-medium rounded-md hover:bg-slate-100">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FF</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  RichField Farm And SmokeHouse LTD
                </h1>
                <div className="flex items-center gap-1 text-sm text-emerald-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
          <button className="h-9 px-3 flex items-center justify-center gap-2 text-sm font-medium rounded-md hover:bg-slate-100">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl px-4 py-8 flex-1 space-y-6">
        <div className="flex justify-center">
          <div className="bg-white px-3 py-1 rounded-full shadow-sm">
            <span className="text-xs text-slate-500 font-medium">
              Today, {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">FF</span>
          </div>
          <div className="flex-1 max-w-2xl">
            <div className="bg-white rounded-3xl rounded-tl-lg p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-full ${'text-blue-600'}`}>
                  <IconComponent className={`w-4 h-4 ${'bg-blue-100'}`} />
                </div>
                <h2 className="font-semibold text-slate-900 text-lg">
                  {notification.title}
                </h2>
              </div>
              <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed text-base">
                {notification.message}
              </p>

              {notification.id && (
                <div className="rounded-xl bg-white shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  
                  {/* Left Side - Sender */}
                  <div className="flex flex-col items-start space-y-1">
                    <p className="text-sm text-gray-500">Sender</p>
                    <div className="text-base font-semibold text-green-600">
                      Richfield Farms
                    </div>
                  </div>

                  {/* Right Side - Metadata */}
                  <div className="text-right sm:text-left">
                    <div className="text-xs text-slate-500 mb-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        notification.read ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {notification.read ? "Seen" : "Unseen"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            </div>
            <div className="flex items-center justify-between mt-2 px-2">
              
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-start pl-11">
          <div className="flex gap-2 flex-wrap">
            {notification.type === "order" && (
              <button className="h-9 px-3 flex items-center justify-center gap-2 text-sm font-medium rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
                <Package className="w-4 h-4" />
                View Order
              </button>
            )}
            {notification.type === "shipping" && (
              <button className="h-9 px-3 flex items-center justify-center gap-2 text-sm font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700">
                <Truck className="w-4 h-4" />
                Track Package
              </button>
            )}
            {notification.type === "promotion" && (
              <button className="h-9 px-3 flex items-center justify-center gap-2 text-sm font-medium rounded-full bg-orange-600 text-white hover:bg-orange-700">
                <Leaf className="w-4 h-4" />
                Shop Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 bg-slate-100 rounded-full px-4 py-3">
            <div className="flex-1">
              <p className="text-slate-500 text-sm">
                You cannot reply to Farm Fresh notifications
              </p>
            </div>
            <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
              <span className="text-slate-600 text-xs">🔒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;


