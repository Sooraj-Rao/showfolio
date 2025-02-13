"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react"; // Added import for React

const sections = [
  {
    title: "Personal Information",
    fields: [
      { name: "name", label: "Full Name", type: "text" },
      { name: "title", label: "Professional Title", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "location", label: "Location", type: "text" },
    ],
  },
  {
    title: "About Me",
    fields: [{ name: "bio", label: "Bio", type: "textarea" }],
  },
  {
    title: "Experience",
    fields: [
      { name: "company", label: "Company Name", type: "text" },
      { name: "position", label: "Position", type: "text" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "description", label: "Job Description", type: "textarea" },
    ],
  },
  {
    title: "Education",
    fields: [
      { name: "school", label: "School/University", type: "text" },
      { name: "degree", label: "Degree", type: "text" },
      { name: "graduationDate", label: "Graduation Date", type: "date" },
    ],
  },
  {
    title: "Skills",
    fields: [
      { name: "skills", label: "Skills (comma-separated)", type: "text" },
    ],
  },
  {
    title: "Projects",
    fields: [
      { name: "projectName", label: "Project Name", type: "text" },
      {
        name: "projectDescription",
        label: "Project Description",
        type: "textarea",
      },
      { name: "projectUrl", label: "Project URL", type: "url" },
    ],
  },
];

export default function CreatePortfolioForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Submit the form data and redirect to the dashboard
      console.log("Form data:", formData);
      router.push("/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Create Your Portfolio
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {sections[currentSection].title}
          </h2>
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {sections[currentSection].fields.map((field) => (
              <div key={field.name} className="mb-4">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={3}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          {currentSection > 0 && (
            <motion.button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={handlePrevious}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </motion.button>
          )}
          <motion.button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentSection === sections.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </motion.button>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <div className="flex space-x-2">
          {sections.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSection ? "bg-indigo-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
