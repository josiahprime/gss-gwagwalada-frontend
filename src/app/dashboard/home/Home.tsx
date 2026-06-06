import Sidebar from "../components/sidebar/Sidebar";
import { useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Widget from "../components/widget/Widget";
import Featured from "../components/featured/Featured";
import Chart from "../components/chart/Chart";
import OrdersTable from "../components/table/Table";
import { useDashboardStore } from "../../../store/dashboard/useDashboardStore";
import DashboardSkeleton from "../../components/ui/DashboardSkeleton";

// import { useAuthStore } from "../../../store/useAuthStore";

const Home = () => {
  const { stats, fetchStats, loading } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading || !stats) return <DashboardSkeleton />;

  console.log('stats ',stats)

  // Clean destructure
  const {
    newUsers,
    totalOrders,
    earnings,
    completedOrdersCount
  } = stats.data;

  

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

        <div className="shadow-md p-5 m-5 bg-white rounded-lg">
          <h2 className="text-gray-500 font-medium mb-4">Latest Transactions</h2>
          <OrdersTable />
        </div>
      </div>
    </div>
  );
};


export default Home;
