import React, { useEffect, useRef, useState } from "react";

const FOCUS_SECONDS_DEFAULT = 25 * 60;
const BREAK_SECONDS_DEFAULT = 5 * 60;

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m} min ${s} sec`;
}

export default function PomodoroTimer({
  focusSeconds = FOCUS_SECONDS_DEFAULT,
  breakSeconds = BREAK_SECONDS_DEFAULT,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(focusSeconds);
  const [cycleCount, setCycleCount] = useState(1);
  const rafRef = useRef(null);
  const lastTickRef = useRef(null);
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(1);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      pathRef.current.style.strokeDasharray = `${len} ${len}`;
      pathRef.current.style.strokeDashoffset = `${len}`;
    }
  }, []);

  useEffect(() => {
    function tick(ts) {
      if (!lastTickRef.current) lastTickRef.current = ts;
      const elapsed = ts - lastTickRef.current;
      if (elapsed >= 1000) {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        lastTickRef.current = ts;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    if (isRunning) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTickRef.current = null;
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastTickRef.current = null;
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (isFocus) {
        setCycleCount((c) => c + 1);
        setIsFocus(false);
        setSecondsLeft(breakSeconds);
      } else {
        setIsFocus(true);
        setSecondsLeft(focusSeconds);
      }
    }
  }, [secondsLeft, isFocus, focusSeconds, breakSeconds]);

  const currentTotal = isFocus ? focusSeconds : breakSeconds;
  const elapsed = Math.max(0, currentTotal - secondsLeft);
  const progressFraction = Math.min(1, elapsed / currentTotal);
  const dashOffset = Math.max(0, Math.round(pathLength * (1 - progressFraction)));

  const displayText = formatTime(secondsLeft);
  const cycleLabel = `${ordinal(cycleCount)} cycle`;

  function handleStartPause() {
    setIsRunning((r) => !r);
  }
  function handleReset() {
    setIsRunning(false);
    setIsFocus(true);
    setSecondsLeft(focusSeconds);
    setCycleCount(1);
  }
  function handleSkip() {
    if (isFocus) {
      setIsFocus(false);
      setSecondsLeft(breakSeconds);
      setCycleCount((c) => c + 1);
    } else {
      setIsFocus(true);
      setSecondsLeft(focusSeconds);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="w-full max-w-md">
        <div className="relative rounded-2xl bg-[#0b0b0b] p-6 shadow-2xl">
          <div className="text-center">
            <div className="text-5xl font-bold leading-tight select-none">
              {displayText}
            </div>
            <div className="text-xs text-gray-400 mt-2 select-none">{cycleLabel}</div>
          </div>

          {/* taller arc section */}
          <div className="mt-10 flex items-center justify-center">
            <svg
              viewBox="0 0 220 140"
              width="400"
              height="240"
              className="block overflow-visible"
              aria-hidden
            >
              {/* background track */}
              <path
                d="M 10 100 A 100 100 0 0 1 210 100"
                fill="none"
                stroke="#222"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* progress arc */}
              <path
                ref={pathRef}
                d="M 10 100 A 100 100 0 0 1 210 100"
                fill="none"
                stroke="#16a34a"
                strokeWidth="16"
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 0.5s linear",
                  strokeDashoffset: dashOffset,
                }}
              />
              {/* orange marker */}
              <g transform="translate(110,100)">
                <rect
                  x={-4}
                  y={-42}
                  width={8}
                  height={20}
                  rx={3}
                  fill="#f97316"
                />
                <circle cx={0} cy={-22} r={3.5} fill="#f97316" />
              </g>
            </svg>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={handleStartPause}
              className="px-5 py-2 rounded-full bg-white text-black font-semibold shadow hover:opacity-90 transition"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-2 rounded-full border border-gray-700 text-gray-200 hover:bg-gray-800 transition"
            >
              Skip
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-full border border-gray-700 text-gray-200 hover:bg-gray-800 transition"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 text-sm text-center text-gray-400">
            {isFocus ? "Focus session" : "Break"} • {isRunning ? "Running" : "Paused"}
          </div>
        </div>
      </div>
    </div>
  );
}
