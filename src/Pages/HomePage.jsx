import React from "react";
import HeroSection from "../components/HeroSection";
import RouteSection from "../components/RouteSection";
import HowItWorks from "../components/HowItWorks";
import { Footer } from "../components/Footer";

const Homepage = () => {
  return (
    <div className="flex flex-col overflow-x-hidden bg-white">
      {/* Footer stays fixed behind everything */}
       

      {/* Main content scrolls above it */}
      <main className="relative z-0  flex flex-col items-center ">

      <div className="absolute inset-0 z-10 pointer-events-none opacity-60 ">
        <div className="w-full h-full bg-[linear-gradient(to_right,rgba(34,108,90,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,108,90,0.25)_1px,transparent_1px)] bg-[size:40px_40px] animate-[gridMove_12s_linear_infinite]" />
      </div>

      <div className="relative">
        <HeroSection />
        
        </div>

        <div className="bg-none mr-15 ml-15 mb-15 z-15"><RouteSection/></div>
         

        {/* Spacer to allow scroll to reveal footer */}
       
      </main>
      <div className="bg-black">
          <HowItWorks /></div>
      <Footer />
    </div>
  );
};

export default Homepage;
