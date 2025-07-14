"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsChartProps {
  data: Array<{
    name: string;
    views: number;
    downloads: number;
  }>;
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="views" fill="#8884d8" />
        <Bar dataKey="downloads" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
