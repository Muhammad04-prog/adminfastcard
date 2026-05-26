import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { TrendingUp, Tag, ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface ProductItem {
  id: number;
  productName: string;
  categoryName?: string;
  price: number;
  imageUrl?: string;
}

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://fastcard-1-o23z.onrender.com";

const chartOptions: any = {
  chart: {
    id: "sales-revenue-chart",
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
    sparkline: { enabled: false },
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 2500,
      animateGradually: { enabled: true, delay: 200 },
      dynamicAnimation: { enabled: true, speed: 1000 },
    },
  },
  colors: ["#2563eb"],
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 3.5 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  markers: { size: 0, hover: { size: 5 } },
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 3,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      style: { colors: "#94a3b8", fontSize: "11px", fontFamily: "inherit" },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    max: 50,
    tickAmount: 5,
    labels: {
      style: { colors: "#94a3b8", fontSize: "11px", fontFamily: "inherit" },
    },
  },
  tooltip: {
    theme: "dark",
    x: { show: true },
    y: { formatter: (val: number) => `${val} Orders` },
  },
};

const chartSeries = [
  {
    name: "Sales Revenue",
    data: [10, 5, 15, 10, 28, 25, 29, 45, 41, 25, 25, 35],
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [topProducts, setTopProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    api
      .get("/api/Product/get-products", {
        params: { PageNumber: 1, PageSize: 5 },
      })
      .then((res) => {
        const raw = res.data;
        if (raw?.data?.products && Array.isArray(raw.data.products)) {
          setTopProducts(
            raw.data.products.slice(0, 5).map((p: any) => ({
              id: p.id,
              productName: p.productName,
              categoryName: p.categoryName || "Products",
              price: p.price,
              imageUrl: p.image
                ? p.image.startsWith("http")
                  ? p.image
                  : `${BASE_URL}/uploads/${p.image}`
                : undefined,
            })),
          );
        }
      })
      .catch(() => {
        setTopProducts([
          {
            id: 1,
            productName: "Healthcare Erbology",
            categoryName: "Accessories",
            price: 13153,
          },
          {
            id: 2,
            productName: "Healthcare Erbology",
            categoryName: "Accessories",
            price: 13153,
          },
          {
            id: 3,
            productName: "Healthcare Erbology",
            categoryName: "Accessories",
            price: 13153,
          },
          {
            id: 4,
            productName: "Healthcare Erbology",
            categoryName: "Accessories",
            price: 13153,
          },
          {
            id: 5,
            productName: "Healthcare Erbology",
            categoryName: "Accessories",
            price: 13153,
          },
        ]);
      });
  }, []);

  const metrics = [
    {
      title: "Sales",
      value: "$152k",
      bgColor: "bg-[#fff5f5]",
      iconColor: "text-[#f87171] bg-[#fee2e2]",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Cost",
      value: "$99.7k",
      bgColor: "bg-[#fffbeb]",
      iconColor: "text-[#fbbf24] bg-[#fef3c7]",
      icon: <Tag className="w-6 h-6" />,
    },
    {
      title: "Profit",
      value: "$32.1k",
      bgColor: "bg-[#f0fdf4]",
      iconColor: "text-[#34d399] bg-[#dcfce7]",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
  ];

  const recentTransactions = [
    {
      name: "Jagarnath S.",
      date: "24.05.2023",
      amount: "$124.97",
      status: "Paid",
    },
    {
      name: "Anand G.",
      date: "23.05.2023",
      amount: "$55.42",
      status: "Pending",
    },
    { name: "Kartik S.", date: "23.05.2023", amount: "$89.90", status: "Paid" },
    {
      name: "Rakesh S.",
      date: "22.05.2023",
      amount: "$144.94",
      status: "Pending",
    },
    { name: "Anup S.", date: "22.05.2023", amount: "$70.52", status: "Paid" },
    { name: "Jimmy P.", date: "22.05.2023", amount: "$70.52", status: "Paid" },
  ];

  const topProductsUnitsSold = [
    {
      name: "Men Grey Hoodie",
      price: "$49.90",
      units: 204,
      color: "bg-blue-100/50",
    },
    {
      name: "Women Striped T-Shirt",
      price: "$34.90",
      units: 155,
      color: "bg-pink-100/50",
    },
    {
      name: "Wome White T-Shirt",
      price: "$40.90",
      units: 120,
      color: "bg-amber-100/50",
    },
    {
      name: "Men White T-Shirt",
      price: "$49.90",
      units: 204,
      color: "bg-purple-100/50",
    },
    {
      name: "Women Red T-Shirt",
      price: "$34.90",
      units: 155,
      color: "bg-rose-100/50",
    },
  ];

  return (
    <div className="space-y-6 select-none pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a] m-0">
          Dashboard
        </h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className={`${m.bgColor} p-6 rounded-2xl flex items-center gap-5 border border-slate-100/80`}
          >
            <div
              className={`${m.iconColor} p-3 rounded-2xl flex items-center justify-center`}
            >
              {m.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 m-0 uppercase tracking-wider">
                {m.title}
              </p>
              <h2 className="text-3xl font-extrabold text-slate-800 m-0 mt-1">
                {m.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Revenue Chart & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800 m-0">
              Sales Revenue
            </h3>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="relative h-64 w-full">
            <Chart
              key="sales-revenue-chart"
              options={chartOptions}
              series={chartSeries}
              type="area"
              height="100%"
              width="100%"
            />
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 m-0">
              Top selling products
            </h3>
            <button
              onClick={() => navigate("/products")}
              className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              See All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-400">
                Loading products...
              </div>
            ) : (
              topProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-1.5 border-b border-slate-100/60 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#e2e8f0]/60 flex items-center justify-center flex-shrink-0 border border-slate-100 overflow-hidden">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-6 h-6 text-slate-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M8 9h8v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9Z" />
                          <path d="M10 5h4v4h-4z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 m-0 truncate max-w-[130px]">
                        {p.productName}
                      </h4>
                      <p className="text-xs text-slate-400 m-0 mt-0.5">
                        in {p.categoryName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-bold text-emerald-500 m-0">
                      ${p.price.toLocaleString()}
                    </h4>
                    <p className="text-[10px] text-slate-400 m-0 mt-0.5">
                      price
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions & Top Products Units Sold */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800 m-0">
              Recent Transactions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-55/60 text-slate-700">
                {recentTransactions.map((tx, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-all duration-100"
                  >
                    <td className="py-3 text-sm font-semibold text-slate-850">
                      {tx.name}
                    </td>
                    <td className="py-3 text-sm text-slate-500">{tx.date}</td>
                    <td className="py-3 text-sm font-bold text-slate-800">
                      {tx.amount}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          tx.status === "Paid"
                            ? "bg-[#dcfce7] text-[#15803d]"
                            : "bg-[#f1f5f9] text-[#64748b]"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products by Units Sold */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800 m-0">
              Top Products by Units Sold
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-55/60 text-slate-700">
                {topProductsUnitsSold.map((p, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-all duration-100"
                  >
                    <td className="py-3 flex items-center gap-3">
                      {/* Product square placeholder */}
                      <div
                        className={`w-8 h-8 rounded-lg ${p.color} flex items-center justify-center flex-shrink-0`}
                      />
                      <span className="text-sm font-semibold text-slate-800">
                        {p.name}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-semibold text-slate-650">
                      {p.price}
                    </td>
                    <td className="py-3 text-sm font-bold text-slate-800">
                      {p.units}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
