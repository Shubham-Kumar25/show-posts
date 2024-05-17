import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-20 h-20 border-b-2 border-orange-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
