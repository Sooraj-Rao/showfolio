import { LoaderCircle } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <span className=" animate-spin">
      <LoaderCircle />
    </span>
  );
};

export default Loader;
