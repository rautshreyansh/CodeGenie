import React from "react";
import { FaUser } from "react-icons/fa";

const Navbar = () => {

  const showLoginSoon = () => {
    alert("Login coming soon...");
  };

  return (

      <div className="nav flex items-center justify-between px-4 md:px-20 lg:px-28 h-[70px] border-b dark:border-gray-700">

      <div className="logo">
        <h3 className="text-[25px] font-bold bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent">
          CodeGenie
        </h3>
      </div>

      <div className="flex items-center gap-[20px] text-[20px]">

        {/* Login Icon Only */}
        <div
          onClick={showLoginSoon}
          className="cursor-pointer hover:opacity-75"
          title="Login"
        >
          <FaUser />
        </div>

      </div>
    </div>
  );
};

export default Navbar;

