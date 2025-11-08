import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// NOTE: 'glass-card' and style helpers are from AgentDashboard
const ControlsBar = ({ 
  searchTerm, 
  setSearchTerm, 
  filterRisk, 
  setFilterRisk, 
  sortBy, 
  setSortBy, 
  setViewMode, 
  viewMode, 
  inputRef 
}) => {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8">
      <div className="bg-white/80 glass-card border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <label htmlFor="search" className="sr-only">Search agents</label>
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-md border border-gray-100 bg-white">
              <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
            </div>
            <input
              id="search"
              ref={inputRef}
              className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-500"
              placeholder="Search by ID, name, owner — press / to focus"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search agents"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Risk Filter */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500">Risk</div>
              <select
                aria-label="Filter by risk"
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="p-2 rounded-md border bg-white text-sm"
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500">Sort</div>
              <select
                aria-label="Sort agents"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 rounded-md border bg-white text-sm"
              >
                <option value="score_desc">Score (high → low)</option>
                <option value="score_asc">Score (low → high)</option>
                <option value="recent">Most recent scan</option>
              </select>
            </div>

            <div className="hidden md:block h-8 w-px bg-gray-100 mx-2" />

            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-2">
              <div className="text-xs text-gray-500">View</div>
              <div className="inline-flex rounded-md p-1 bg-white border border-gray-100">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-2 rounded-md ${viewMode === "cards" ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
                  aria-pressed={viewMode === "cards"}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 rounded-md ${viewMode === "table" ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
                  aria-pressed={viewMode === "table"}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* micro helper line */}
        <div className="mt-3 text-xs text-gray-500">Tip: Use <kbd className="px-2 py-1 bg-gray-100 rounded">/</kbd> to focus search • <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl/⌘+N</kbd> to register new agent</div>
      </div>
    </section>
  );
};

export default ControlsBar;