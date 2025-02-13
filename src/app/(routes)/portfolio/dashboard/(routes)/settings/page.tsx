"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Settings() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Settings updated:", { name, email, notifications, theme });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Settings</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-700">
                Receive email notifications
              </span>
            </label>
          </div>
          <div className="mb-6">
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Theme
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <motion.button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Changes
          </motion.button>
        </form>
      </div>
    </div>
  );
}
