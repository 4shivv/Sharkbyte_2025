import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faPencil, faSearch, faChartLine } from "@fortawesome/free-solid-svg-icons";

const RouteSection = ({ maxWidth = "max-w-5xl" }) => {
  const steps = [
    { id: 0, icon: faCompass, title: "Track", desc: "Visualize your spending." },
    { id: 1, icon: faPencil, title: "Plan", desc: "Design clear routes for saving and growth." },
    { id: 2, icon: faSearch, title: "Discover", desc: "Reveal insights that guide better habits." },
    { id: 3, icon: faChartLine, title: "Grow", desc: "Stay aligned and move with purpose." },
  ];

  return (
    <section className={`mx-auto ${maxWidth} bg-[#E8F5F1] backdrop-blur-xl rounded-4xl p-8 flex flex-col gap-8`}>
      {/* Top Row: Title and Description */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 lg:mb-12">
        <div className="flex-1">
          <h2 className="text-3xl font-poppins md:text-4xl font-semibold text-darkGreen leading-tight">
            Guiding Every Move, Maximizing Every Dollar
          </h2>
        </div>
        <div className="flex-1">
          <p className="text-[#3A5A4F] text-md mt-2">
            Every dollar tells a story, and every choice shapes your journey. Navigate your finances with intention,
            understand where your money flows, and make decisions that align with your goals. With clear AI insights and guidance, every step becomes purposeful.
          </p>
        </div>
      </div>

      {/* Vertical Step Cards */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-6 items-center justify-center">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center w-40 rounded-3xl sm:rounded-4xl transition-colors duration-200 p-2 lg:w-48 h-55 justify-between"
          >
            {/* Icon taking ~2/3 of card */}
            <div className="flex items-center justify-center flex-1 w-full text-darkGreen transition-colors duration-900 ">
              <FontAwesomeIcon icon={step.icon} className="text-6xl " />
            </div>

            {/* Title and Description */}
            <div className="flex flex-col mt-2">
              <h3 className="text-md md:text-lg font-semibold text-darkGreen">{step.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RouteSection;
