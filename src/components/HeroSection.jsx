import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChalkboard,
  faLocationArrow,
  faHandPointer,
  faICursor,
  faSquareRootVariable,
  faChartPie,
  faUpDownLeftRight,
} from "@fortawesome/free-solid-svg-icons";

const HeroSection = () => {
  const [showArrow, setShowArrow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowArrow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-screen min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Hero Text */}
      <div className="z-20 flex flex-col items-center justify-center px-6 animate-fadeInUp">
        <span className="bg-white/60 border mb-2 font-medium backdrop-blur-md border-gray-300 px-4 py-1.5 rounded-full text-sm">
          <FontAwesomeIcon icon={faChalkboard} className="mr-2 text-gray-500" />
          Whiteboard
        </span>

        <h1 className="text-[2.75rem] md:text-[4rem] font-inter font-semibold text-[#111] leading-snug tracking-tight">
          Plan, <span className="font-caveat text-[#1a1a1a]">sketch,</span> and share
          <br />
          <span className="text-[#1a1a1a]/90">all in one place</span>
        </h1>

        <p className="mt-5 text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed font-inter">
          Collaborate in real time on an intuitive online whiteboard
          <br />
          built for teams, teachers, and creators.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center font-inter animate-fadeInSlow">
          <Link
            to="/signup"
            className="px-10 py-3 bg-[#1a1a1a] text-white rounded-full text-sm font-medium tracking-wide hover:bg-[#2b2b2b] transition-all duration-300 shadow-md"
          >
            Start for free
          </Link>
          <Link
            to="/docs"
            className="px-10 py-3 bg-white/60 backdrop-blur-md text-gray-800 rounded-full text-sm font-medium border border-gray-300 hover:bg-white transition-all duration-300"
          >
            Learn more
          </Link>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-element burst-top-left">
        <FontAwesomeIcon icon={faHandPointer} className="text-[#ffc9c9] text-3xl" />
        <div className="bg-[#ffc9c9] text-[#5C1F1F] text-xs px-3 py-1 rounded-full font-medium shadow">
          Alex
        </div>
      </div>

      <div className="floating-element burst-bottom-right">
        <FontAwesomeIcon
          icon={faLocationArrow}
          className="text-[#ccdeff] text-2xl -rotate-90 self-start"
        />
        <div className="bg-[#dce8ff] self-end ml-5 text-gray-700 text-xs px-3 py-1 rounded-full font-medium shadow">
          Leo
        </div>
      </div>

      <div className="floating-element burst-top-right">
        <FontAwesomeIcon icon={faICursor} className="text-[#e2d5ff] text-2xl" />
        <div className="bg-[#e2d5ff] text-[#2E2172] text-xs px-3 py-1 rounded-full font-medium shadow">
          Maya
        </div>
      </div>

      <div className="floating-element burst-bottom-left">
        <FontAwesomeIcon
          icon={faUpDownLeftRight}
          className="text-[#a6feb0] text-2xl rotate-180"
        />
        <div className="bg-[#cbffd1] text-[#214B2A] text-xs px-3 py-1 rounded-full font-medium shadow">
          Sofia
        </div>
      </div>

      <div className="floating-element burst-icon-left">
        <FontAwesomeIcon icon={faSquareRootVariable} className="text-black text-4xl" />
      </div>

      <div className="floating-element burst-icon-right">
        <FontAwesomeIcon icon={faChartPie} className="text-black text-5xl" />
      </div>

      {/* Down Arrow */}
      {showArrow && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-fadeInSlow">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className="animate-bounce text-gray-700 text-2xl"
            />
          </button>
        </div>
      )}

      {/* Animations */}
      <style>{`
        /* Text + fade animations */
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInSlow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        /* One-time burst animation */
        @keyframes gatherAndBurst {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
          }
          40% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 1;
            transform: translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y))) scale(1);
          }
        }

        /* Floating idle animation (runs after burst) */
        @keyframes floatIdle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .animate-fadeInUp { animation: fadeInUp 1.2s ease-out forwards; }
        .animate-fadeInSlow { animation: fadeInSlow 2s ease-out forwards; }

        .floating-element {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          opacity: 0;
          animation: gatherAndBurst 2.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* Burst directions */
        .burst-top-left { --burst-x: -400px; --burst-y: -200px; animation-delay: 0.1s; }
        .burst-top-right { --burst-x: 350px; --burst-y: -180px; animation-delay: 0.1s; }
        .burst-bottom-left { --burst-x: -300px; --burst-y: 220px; animation-delay: 0.1s; }
        .burst-bottom-right { --burst-x: 380px; --burst-y: 260px; animation-delay: 0.s; }
        .burst-icon-left { --burst-x: -350px; --burst-y: 150px; animation-delay: 0.1s; }
        .burst-icon-right { --burst-x: 300px; --burst-y: 250px; animation-delay: 0.1s; }

        /* Subtle float starts after burst ends */
        .floating-element > * {
          animation: floatIdle 4s ease-in-out infinite;
          animation-delay: 2.6s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
