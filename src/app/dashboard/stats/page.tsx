// "use client"
// import React from "react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const statsData = {
//   kpis: [
//     { label: "Total Users", value: 1345 },
//     { label: "Total Revenue", value: "$45,320" },
//     { label: "Active Sessions", value: 232 },
//   ],
//   lineChartData: [
//     { name: "Jan", users: 400, revenue: 2400 },
//     { name: "Feb", users: 300, revenue: 2210 },
//     { name: "Mar", users: 500, revenue: 2290 },
//     { name: "Apr", users: 700, revenue: 4000 },
//     { name: "May", users: 600, revenue: 3500 },
//     { name: "Jun", users: 800, revenue: 3900 },
//   ],
//   barChartData: [
//     { name: "Product A", sales: 400 },
//     { name: "Product B", sales: 300 },
//     { name: "Product C", sales: 500 },
//     { name: "Product D", sales: 200 },
//   ],
//   pieChartData: [
//     { name: "Desktop", value: 50 },
//     { name: "Mobile", value: 35 },
//     { name: "Tablet", value: 15 },
//   ],
// };

// const COLORS = ["#4caf50", "#2196f3", "#ff9800"];

// const Stats = () => {
//   return (
//     <div className="flex">
//       <div className="flex-6 w-screen">
//         <div className="p-6">
//           <h1 className="text-2xl font-semibold text-gray-700 shadow-md text-center py-6 px-4 rounded-2xl bg-white/40 hover:bg-white">
//             Dashboard Statistics
//           </h1>

//           {/* KPI Cards */}
//           <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {statsData.kpis.map((kpi, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-lg shadow-lg border text-center hover:bg-green-50 transition duration-300"
//               >
//                 <h2 className="text-xl font-bold text-gray-800">{kpi.label}</h2>
//                 <p className="text-3xl font-extrabold text-green-500 mt-2">{kpi.value}</p>
//               </div>
//             ))}
//           </div>

//           {/* Line Chart Section */}
//           <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border">
//             <h2 className="text-xl font-semibold text-gray-600 mb-4">Monthly Users & Revenue</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={statsData.lineChartData}>
//                 <Line type="monotone" dataKey="users" stroke="#4caf50" strokeWidth={2} />
//                 <Line type="monotone" dataKey="revenue" stroke="#2196f3" strokeWidth={2} />
//                 <Tooltip />
//                 <Legend />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Combined Pie Chart and Bar Chart Section */}
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Pie Chart */}
//             <div className="bg-white p-6 rounded-lg shadow-lg border">
//               <h2 className="text-xl font-semibold text-gray-600 mb-4">Device Usage</h2>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={statsData.pieChartData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     fill="#4caf50"
//                     label
//                   >
//                     {statsData.pieChartData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Bar Chart */}
//             <div className="bg-white p-6 rounded-lg shadow-lg border">
//               <h2 className="text-xl font-semibold text-gray-600 mb-4">Product Sales</h2>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={statsData.barChartData}>
//                   <Bar dataKey="sales" fill="#4caf50" barSize={50} />
//                   <Tooltip />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Stats;


// app/stats/page.tsx
import { notFound } from "next/navigation";

export default function StatsPage() {
  notFound(); // will trigger Next.js 404 page
}

