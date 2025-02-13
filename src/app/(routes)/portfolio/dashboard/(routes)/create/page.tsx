"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const templates = [
  { id: 1, name: "Professional", image: "/placeholder.svg" },
  { id: 2, name: "Creative", image: "/placeholder.svg" },
  { id: 3, name: "Minimalist", image: "/placeholder.svg" },
  { id: 4, name: "Tech", image: "/placeholder.svg" },
  { id: 5, name: "Artistic", image: "/placeholder.svg" },
  { id: 6, name: "Corporate", image: "/placeholder.svg" },
];

export default function CreatePortfolio() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Choose a Template
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer ${
              selectedTemplate === template.id ? "ring-2 ring-indigo-500" : ""
            }`}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <Image
              src={template.image || "/placeholder.svg"}
              alt={template.name}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {template.name}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>
      {selectedTemplate && (
        <div className="mt-6">
          <Link
            href={`/create/${selectedTemplate}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Use This Template
          </Link>
        </div>
      )}
    </div>
  );
}
