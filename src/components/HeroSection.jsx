import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const HeroSection = () => {
  const [showArrow, setShowArrow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowArrow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-screen bg-white ">
      {/* Background base — gives it its own color */}
     

      {/* Moving grid lines layered above bg but below content */}
     

      {/* Foreground content */}
      <section className="relative z-20 min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
        <div className="flex flex-col items-center justify-center gap-3 animate-fadeInUp">
          <h1 className="flex flex-col text-5xl md:text-6xl font-poppins font-semibold text-darkGreen mb-1 tracking-tight leading-tight">

            <span>Move with <span className="text-pine">purpose</span>, spend </span>
            <span> with meaning.</span>
          </h1>
          <p className="text-base md:text-lg font-inter text-gray-600 max-w-md leading-relaxed">
            Navigate your finances with clarity and confidence.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-row gap-5 font-inter animate-fadeInSlow">
          <Link
            to="/checkin"
            className="flex items-center px-8 py-2.5 bg-forest text-white rounded-full hover:bg-[#1a5547] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
          <Link
            to="/"
            className="flex items-center px-8 py-2.5 bg-transparent text-forest rounded-full border-2 border-forest hover:bg-forest/10 transition-all duration-300"
          >
            Learn More
          </Link>
        </div>

        {/* Bounce Arrow */}
        {showArrow && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 animate-fadeInSlow">
            <button
              onClick={() => navigate("/")}
              className="cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faArrowDown}
                className="animate-bounce text-forest text-2xl hover:scale-110 transition-transform"
              />
            </button>
          </div>
        )}
      </section>

      {/* Tailwind animations */}
      <style>
        {`
          @keyframes gridMove {
            0% { background-position: 0 0, 0 0; }
            100% { background-position: 40px 40px, 40px 40px; }
          }

          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeInSlow {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }

          .animate-fadeInUp {
            animation: fadeInUp 1s ease-out forwards;
          }

          .animate-fadeInSlow {
            animation: fadeInSlow 1.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default HeroSection;
