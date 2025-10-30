import React from "react";
import HeroSection from "../components/HeroSection";
import RouteSection from "../components/RouteSection";
import HowItWorks from "../components/HowItWorks";
import { Footer } from "../components/Footer";

const Homepage = () => {
  return (
    <div className="relative flex flex-col overflow-x-hidden bg-[#f8f6f4] min-h-screen">
      {/* Grid background (behind everything) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <div className="w-full h-full bg-[linear-gradient(to_right,rgba(34,108,90,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,108,90,0.25)_1px,transparent_1px)] bg-[size:40px_40px] animate-[gridMove_12s_linear_infinite]" />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center gap-24">
        <HeroSection />

        {/* Browser Mockup */}
        <div className="w-[90%] max-w-5xl rounded-2xl shadow-md border border-gray-200 overflow-hidden bg-white">
          {/* Browser top bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>
            <div className="mx-auto w-2/3 md:w-1/2 bg-white border border-gray-300 rounded-md text-gray-500 text-sm px-2 py-0.5 truncate text-center">
              https://WhiteFlow.com/dashboard
            </div>
            <div className="w-10" /> {/* spacer */}
          </div>

          {/* Demo content area (taller version) */}
          <div className="flex items-center justify-center h-[750px] bg-gray-50">
            <span className="text-gray-400 text-lg font-medium">
              Demo Screen
            </span>
          </div>
        </div>

        {/* Optional sections */}
        {/* <RouteSection /> */}
        {/* <HowItWorks /> */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
