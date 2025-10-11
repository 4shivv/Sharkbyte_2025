import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className=" left-0 w-full z-0 bg-black py-10 px-6 md:px-16 flex flex-col justify-center items-center ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0 w-full max-w-6xl">
        
        {/* Left side: tagline */}
        <div className="flex flex-col items-start text-white font-poppins">
          <span className="text-md font-medium">Money that moves.</span>
        </div>

        {/* Right side: Quick Links */}
        <div className="flex flex-wrap md:flex-nowrap gap-6 text-sm font-poppins text-gray-300">
          <Link to="/about" className="hover:text-pine transition-colors duration-200">About</Link>
          <Link to="/features" className="hover:text-pine transition-colors duration-200">Features</Link>
          <Link to="/pricing" className="hover:text-pine transition-colors duration-200">Pricing</Link>
          <Link to="/contact" className="hover:text-pine transition-colors duration-200">Contact</Link>
        </div>
      </div>
    </footer>
  );
};
