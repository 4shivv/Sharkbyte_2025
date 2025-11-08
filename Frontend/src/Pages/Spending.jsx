import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faUser } from "@fortawesome/free-solid-svg-icons";

const initialRoutes = [
  { id: "transport", label: "Transport", amount: 220, color: "#FBBF24" },
  { id: "food", label: "Food & Dining", amount: 360, color: "#EF4444" },
  { id: "entertainment", label: "Entertainment", amount: 95, color: "#6366F1" },
  { id: "bills", label: "Bills", amount: 420, color: "#14B8A6" },
];

export default function SpendingPage() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [savings, setSavings] = useState(0);
  const [timeRange, setTimeRange] = useState("monthly");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const totalSpend = routes.reduce((sum, r) => sum + r.amount, 0);
  const timeOptions = ["daily", "weekly", "monthly"];

  const transactions = [
    { name: "Uber Ride", amount: -15.2, category: "transport" },
    { name: "Starbucks", amount: -6.5, category: "food" },
    { name: "Spotify", amount: -9.99, category: "entertainment" },
    { name: "Internet Bill", amount: -60, category: "bills" },
    { name: "Grocery Store", amount: -85.4, category: "food" },
  ];

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
<div className="h-screen pt-20 flex pb-5 pr-5
    bg-[#F3EFEE]
    backdrop-blur-3xl"> 

    <div className="absolute inset-0 z-10 pointer-events-none opacity-60 ">
        <div className="w-full h-full bg-[linear-gradient(to_right,rgba(34,108,90,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,108,90,0.25)_1px,transparent_1px)] bg-[size:40px_40px] animate-[gridMove_12s_linear_infinite]" />
      </div>
    
    <div className="flex ml-5 z-15  max-w-full rounded-r-[4rem] rounded-l-[3rem] justify-end ">
      <div className=" text-white w-20 sm:w-25 h-[50vh] border  border-gray-400/50 bg-[#09231D]/95 background-blur-3xl font-poppins rounded-[4rem] flex flex-col items-center p-6 relative">
        {/* User Avatar */}
        <div className="bg-[#F3EFEE] text-forest w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faUser} className="text-2xl" />
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center text-center gap-1 mb-6 ">
          <span className="text-lg font-medium">Alex</span>
          
        </div>

      <button className="absolute text-sm text-white/80 bottom-8 hover:text-white  cursor-pointer transition-colors">
            Sign Out
          </button>
        {/* Optional Accent */}
        <div className="absolute bottom-16 w-12  h-1 rounded-full bg-gray-200" />
      </div>

    <div className={`  bg-white border border-gray-400/50 sm:ml-10 lg:ml-30 backdrop-blur-2xl rounded-[2rem]  text-gray-900 px-8 py-6 font-sans`}>
      {/* Header */}
      <header className="flex items-center justify-between mb-10 border-b border-gray-400/50 pb-4">
        <div className="">
          <h1 className="text-3xl font-semibold tracking-tight text-darkGreen">
            Welcome Back, Alex
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Visualize your spending and reroute it intelligently.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-gray-500">Monthly Spend</div>
            <div className="text-lg font-medium text-gray-900">
              ${totalSpend.toFixed(0)}
            </div>
          </div>
          <div className="bg-[#226C5A]/10 px-5 py-2 rounded-full text-[#226C5A] font-medium text-sm">
            Saved ${savings.toFixed(0)}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="grid grid-cols-12 gap-8">
        {/* LEFT — Chart + Transactions */}
        <section className="col-span-8 space-y-6">
          <div className="bg-white/50  rounded-3xl p-6 border-2 border-gray-200 ">
            {/* Header + Time Range */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-md font-semibold text-gray-800">
                  Spending Overview —{" "}
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                </h2>
                <p className="text-xs text-gray-500">
                  A clear look at where your money flows.
                </p>
              </div>

              {/* Dropdown */}
              <div className="relative " ref={dropdownRef} >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-2 py-1.5 bg-white border cursor-pointer border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-1"
                >
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                  <span
                    className={`transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faCaretDown} />
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32  bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden z-10">
                    {timeOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setTimeRange(option);
                          setDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-xs cursor-pointer ${
                          timeRange === option
                            ? "bg-[#226C5A]/10 text-[#226C5A] font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pill Chart */}
            <div className="relative w-full h-4 rounded-full  overflow-hidden bg-gray-100 mb-4">
              {routes.map((r) => {
                const widthPct = (r.amount / totalSpend) * 100;
                return (
                  <div
                    key={r.id}
                    style={{
                      width: `${widthPct}%`,
                      background: r.color,
                      transition: "all 0.4s ease",
                    }}
                    className="h-full"
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
              {routes.map((r) => (
                <div key={r.id} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: r.color }}
                  />
                  <span>{r.label}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-gray-200" />

            {/* Transactions */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                Recent Transactions
              </h4>
              <ul className="space-y-2 text-sm">
                {transactions.map((t, i) => {
                  const route = routes.find((r) => r.id === t.category);
                  return (
                    <li
                      key={i}
                      className="flex justify-between items-center bg-gray-50  hover:bg-gray-100 transition rounded-xl px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: route?.color }}
                        />
                        <span className="text-gray-700">{t.name}</span>
                      </div>
                      <span className="text-gray-600">
                        ${Math.abs(t.amount).toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* RIGHT — AI Suggestions */}
        <aside className="col-span-4 flex flex-col gap-5">
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 ">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              AI Suggestions
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Try shifting a few rides per week to public transit to reduce
              spending on transport.
            </p>
            <button className="w-full text-white py-2 px-1.5 rounded-full text-xs md:text-sm bg-[#226C5A] hover:bg-[#1c594a] active:bg-[#226C5A] transition-colors cursor-pointer">
              Apply Suggestion
            </button>
          </div>
        </aside>
      </main>
    </div>
    </div>
    </div>
  );
}
