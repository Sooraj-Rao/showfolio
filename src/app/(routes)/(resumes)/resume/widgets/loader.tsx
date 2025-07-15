import React from "react";

export const Loader = ({ title }: { title?: string }) => {
  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium">
            Loading{title ? " " + title : ""}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
