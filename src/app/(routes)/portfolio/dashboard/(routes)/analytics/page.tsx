"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const portfolios = [
  { id: 1, name: "My Professional Portfolio" },
  { id: 2, name: "Creative Design Showcase" },
  { id: 3, name: "Tech Project Collection" },
];

const viewsData = [
  { month: "Jan", views: 65 },
  { month: "Feb", views: 59 },
  { month: "Mar", views: 80 },
  { month: "Apr", views: 81 },
  { month: "May", views: 56 },
  { month: "Jun", views: 55 },
];

const interactionsData = [
  { month: "Jan", interactions: 28 },
  { month: "Feb", interactions: 48 },
  { month: "Mar", interactions: 40 },
  { month: "Apr", interactions: 19 },
  { month: "May", interactions: 86 },
  { month: "Jun", interactions: 27 },
];

export default function Analytics() {
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolios[0].id);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Analytics</h1>
      <div className="mb-6">
        <label
          htmlFor="portfolio-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Portfolio
        </label>
        <select
          id="portfolio-select"
          value={selectedPortfolio}
          onChange={(e) => setSelectedPortfolio(Number(e.target.value))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {portfolios.map((portfolio) => (
            <option key={portfolio.id} value={portfolio.id}>
              {portfolio.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Views Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Views</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="rgba(75, 192, 192, 0.6)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Interactions Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Interactions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={interactionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="interactions"
                stroke="rgb(255, 99, 132)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
