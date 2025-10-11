import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMap,
  faRoad,
  faLightbulb,
  faEye,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";

const HowItWorks = () => {
  const features = [
    {
      icon: faEye,
      title: "Visualize Your Finances",
      desc: "See your spending as a map, not a list. Understand your flow instantly.",
    },
    {
      icon: faRoute,
      title: "Set Your Routes",
      desc: "Define paths for budgets and goals. Every dollar knows where to go.",
    },
    {
      icon: faRoad,
      title: "Stay On Course",
      desc: "AI insights guide you when your journey drifts off track.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#FAF3E7] rounded-b-[2rem] sm:rounded-b-[3rem] z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Left side mock visual */}
        <div className="flex-1 relative">
          <div className=" hidden md:block sm:w-full sm:h-72 bg-gradient-to-tr from-[#E4EDEA] to-[#F9F6F1] rounded-3xl shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(34,108,90,0.12),transparent_60%)] animate-mapGlow" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,108,90,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,108,90,0.15)_1px,transparent_1px)] bg-[size:40px_40px] animate-gridMove" />
          </div>
        </div>

        {/* Right side text */}
        <div className="flex-1 space-y-8">
          <h2 className="text-3xl font-semibold text-darkGreen">
            How Navora Works
          </h2>
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-4 hover:translate-x-1 transition-transform duration-500"
            >
              <FontAwesomeIcon
                icon={f.icon}
                className="text-forest text-xl mt-1"
              />
              <div>
                <h3 className="text-lg font-semibold text-darkGreen">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes gridMove {
            0% { background-position: 0 0; }
            100% { background-position: 40px 40px; }
          }
          .animate-gridMove {
            animation: gridMove 10s linear infinite;
          }

          @keyframes mapGlow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          .animate-mapGlow {
            animation: mapGlow 6s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
};

export default HowItWorks;
