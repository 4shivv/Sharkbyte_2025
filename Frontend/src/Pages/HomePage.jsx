import React from "react";
import HeroSection from "../components/HeroSection";

const Homepage = () => {
  return (
    <div className="relative flex flex-col overflow-x-hidden bg-[#f8f6f4] min-h-screen">
      {/* Grid background: Changed color for a more corporate/financial feel */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        {/* Changed grid color from green to a dark blue/professional tone */}
        <div className="w-full h-full bg-[linear-gradient(to_right,rgba(26,52,109,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,52,109,0.25)_1px,transparent_1px)] bg-[size:40px_40px] animate-[gridMove_12s_linear_infinite]" />
      </div>


      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center gap-24">
        {/* Assuming HeroSection is updated with new EnTec content */}
        <HeroSection />



        {/* Optional sections */}
        {/* <RouteSection /> */}
        {/* <HowItWorks /> */}
      </main>

      {/* Footer */}

    </div>
  );
};

export default Homepage;
