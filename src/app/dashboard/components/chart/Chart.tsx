"use client";

import { useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardStore } from "store/dashboard/useDashboardStore";
import { parseISO, format } from "date-fns";

interface ChartProps {
  title: string;
  aspect: number;
}

const Chart = ({ aspect, title }: ChartProps) => {
  const { monthlyRevenue, loadingRevenue, fetchMonthlyRevenue } = useDashboardStore();
  console.log('monthly revenue', monthlyRevenue)

  useEffect(() => {
    fetchMonthlyRevenue();
  }, [fetchMonthlyRevenue]);

  // Transform backend data into Recharts format
  const chartData = monthlyRevenue.map(item => ({
    name: format(parseISO(item.month + "-01"), "MMM"), // "Jan", "Feb", etc.
    Total: item.revenue,
  }));

  if (loadingRevenue) return <div>Loading chart...</div>;

  return (
    <div className="flex-[4] shadow-md p-3 text-gray-500">
      <div className="mb-5 font-semibold">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e1e1" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
