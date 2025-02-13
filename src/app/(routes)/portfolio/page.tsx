"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const templates = [
  { id: 1, name: "Minimalist", description: "Clean and simple design" },
  { id: 2, name: "Creative", description: "Artistic and expressive layout" },
  { id: 3, name: "Professional", description: "Sleek and corporate style" },
  { id: 4, name: "Tech", description: "Modern and tech-focused design" },
  { id: 5, name: "Elegant", description: "Sophisticated and refined look" },
  { id: 6, name: "Bold", description: "Strong and impactful presentation" },
  { id: 7, name: "Playful", description: "Fun and energetic layout" },
  { id: 8, name: "Vintage", description: "Retro-inspired design" },
  { id: 9, name: "Nature", description: "Organic and earthy aesthetics" },
  {
    id: 10,
    name: "Futuristic",
    description: "Forward-thinking and innovative style",
  },
];

export default function PortfolioTemplates() {
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Choose Your Portfolio Template
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredTemplate(template.id)}
              onHoverEnd={() => setHoveredTemplate(null)}
            >
              <div className="h-48 bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-600">
                  {template.name}
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {template.name}
                </h2>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <Link href={`/portfolio/create/${template.id}`} passHref>
                  <motion.a
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Select Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.a>
                </Link>
              </div>
              {hoveredTemplate === template.id && (
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-white text-lg font-semibold">
                    Preview Template
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
