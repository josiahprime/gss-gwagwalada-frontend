'use client'

import Featured from "./components/featured/Featured";
// import Sidebar from "./components/sidebar/Sidebar";
import { useEffect } from "react";
// import Navbar from "./components/navbar/Navbar";
import Widget from "./components/widget/Widget";
import Chart from "./components/chart/Chart";
import OrdersTable from "./components/table/Table";
import { useDashboardStore } from "store/dashboard/useDashboardStore";
import DashboardSkeleton from "app/components/ui/DashboardSkeleton";
import { useThemeStore } from "store/theme/themeStore";

// import { useAuthStore } from "../../../store/useAuthStore";

const Home = () => {
  const theme = useThemeStore((s) => s.theme);
  const { stats, fetchStats, loading } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading || !stats) return <DashboardSkeleton />;

  // Clean destructure
  const {
    newUsers,
    totalOrders,
    earnings,
    completedOrdersCount
  } = stats.data;

  // console.log('earnings type',typeof(earnings))



  return (
    <div className="flex">
      <div className="flex-[6]">
        <div className="flex gap-5 p-5">
          <Widget type="user" value={newUsers} />
          <Widget type="order" value={totalOrders} />
          <Widget type="earning" value={earnings} />
          <Widget type="completed" value={completedOrdersCount} />
        </div>

        <div className="flex gap-5 px-5">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>

        <div
          className={`shadow-md p-5 m-5 rounded-lg transition-colors duration-500
            ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}
        >
          <h2 className="font-medium mb-4">Latest Transactions</h2>
          <OrdersTable />
        </div>
      </div>
    </div>
  );
};


export default Home;
