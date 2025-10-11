// SearchDrawer.jsx
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEllipsis } from "@fortawesome/free-solid-svg-icons";

export default function SearchDrawer({ onSearch, autocomplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]); // 🧩 start empty

  const inputRef = useRef(null);

  // Auto-focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  // Update autocomplete suggestions
  useEffect(() => {
    if (!autocomplete || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const request = { input: query };
    autocomplete.getPlacePredictions(request, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
      } else {
        setSuggestions([]);
      }
    });
  }, [query, autocomplete]);

  // Handle direct search (pressing arrow button)
  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(query.trim());

    const newEntry = {
      name: query.trim(),
      meta: "Just now",
    };
    setHistory((prev) => [newEntry, ...prev]);
    setQuery("");
    setSuggestions([]);
  };

  // Handle selecting an autocomplete suggestion
  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.description);
    setSuggestions([]);
    onSearch(suggestion.description);

    const newEntry = {
      name: suggestion.description,
      meta: "Just now",
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  // Clear history safely
  const clearHistory = (e) => {
    e.stopPropagation(); // 🧹 prevent drawer toggle
    setHistory([]);
  };

  return (
    <div className="fixed bottom-4 left-0 w-full z-50 pointer-events-none font-inter">
      <div
        className={`mx-auto max-w-3xl pointer-events-auto bg-gray-800 text-white rounded-t-[2rem]  sm:rounded-t-[3rem]  px-4 transform transition-transform duration-500 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-[70%]"}
        `}
      >
        {/* Drawer handle */}
        <div onClick={() => setIsOpen(!isOpen)} className="pt-3 cursor-pointer">
          <div className="mx-auto w-12 h-1.5 bg-gray-500 rounded-full mb-3" />
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <div className="flex gap-3 items-center mb-10">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search places, addresses or businesses"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => setQuery(e.target.value) }
              className="flex-1 font-poppins text-sm sm:text-md bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-4xl focus:outline-none"
            />
            <button
              type="button"
              onClick={() => query.trim() && handleSearch()}
              className="px-2 py-1.5 bg-[#226C5A] cursor-pointer hover:bg-jungle active:bg-[#226C5A] rounded-full text-white font-medium transition-colors"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && (
            <ul onClick={(e) => e.currentTarget.classList.add("hidden")} className="bg-gray-700 rounded-2xl mt-[-2rem] mb-3 max-h-50 overflow-y-auto no-scrollbar">
              {suggestions.map((s) => (
                <li
                  key={s.place_id}
                  onClick={() => handleSelectSuggestion(s)}
                  className="px-3 py-2 text-sm hover:bg-gray-600 cursor-pointer "
                >
                  {s.description}
                </li>
              ))}
            </ul>
          )}

          {/* Filter buttons */}
          {isOpen &&
           <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 rounded-full bg-[#226C5A] text-white text-sm cursor-pointer">
              Open Now
            </button>
            <button className="px-3 py-1 rounded-full bg-gray-700 text-gray-200 text-sm cursor-pointer">
              Price
            </button>
            <button className="px-3 py-1 rounded-full bg-gray-700 text-gray-200 text-sm cursor-pointer">
              Distance
            </button>
            <button className="px-3 py-1 rounded-full bg-gray-700 text-gray-200 text-sm cursor-pointer">
              Rating
            </button>
          </div>
          
          
          
          }
         
        </div>

        {/* Past Locations */}
        <div
          className={`px-4 pb-6 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <h3 className="text-sm font-semibold mt-3 mb-2">Past Locations</h3>
          {history.length === 0 ? (
            <p className="text-xs text-gray-400 mb-4">
              You haven’t searched for any places yet.
            </p>
          ) : (
            <ul className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
              {history.map((loc, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-700/40 hover:bg-gray-700/60 rounded-xl"
                >
                  <div>
                    <div className="text-sm font-normal">{loc.name}</div>
                    <div className="text-xs text-gray-400">{loc.meta}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      className="text-sm text-mint hover:underline"
                      onClick={() => onSearch(loc.name)}
                    >
                      Navigate
                    </button>
                    <button className="text-xs text-gray-400 cursor-pointer hover:text-white">
                      <FontAwesomeIcon icon={faEllipsis} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Footer buttons */}
          <div className="flex gap-3 mt-4 text-sm">
            <button
              onClick={clearHistory}
              className="flex-1 px-3 py-2 cursor-pointer rounded-full cursor-po bg-gray-700 hover:bg-gray-500 active:bg-gray-700 text-gray-200 transition-colors"
            >
              Clear History
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}
