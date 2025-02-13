"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Edit2, Eye, Trash2 } from "lucide-react";

const portfolios = [
  {
    id: 1,
    name: "My Professional Portfolio",
    views: 1234,
    lastUpdated: "2023-05-15",
  },
  {
    id: 2,
    name: "Creative Design Showcase",
    views: 567,
    lastUpdated: "2023-06-02",
  },
  {
    id: 3,
    name: "Tech Project Collection",
    views: 890,
    lastUpdated: "2023-06-10",
  },
];

export default function Dashboard() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<number | null>(
    null
  );
  console.log(selectedPortfolio);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        My Portfolios
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {portfolios.map((portfolio) => (
              <motion.tr
                key={portfolio.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ backgroundColor: "#f3f4f6" }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {portfolio.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {portfolio.views}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {portfolio.lastUpdated}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Link
                      href={`/edit/${portfolio.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/preview/${portfolio.id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => setSelectedPortfolio(portfolio.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Link
          href="/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Portfolio
        </Link>
      </div>
    </div>
  );
}
