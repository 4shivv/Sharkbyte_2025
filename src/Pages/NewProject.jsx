// src/components/ProjectOverview.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faShieldHalved, // Used for Project/Security focus
  faUser,
  faCalendarAlt, // New for deadlines
  faChartLine, // New for status/metrics
  faTachometerAlt,
  faEdit,
  faHistory,
  faArrowRight,
  faChevronDown,
  faDownload,
  faEllipsisV,
  faUsers, // New for team size
  faDollarSign, // New for budget
} from "@fortawesome/free-solid-svg-icons";

/**
 * ProjectOverview.jsx
 * - Monolithic Apple.com-like bright design (MacBook showcase mood)
 * - Tailwind CSS + FontAwesome
 * - Long, intentionally complex file with layered sections:
 *    Hero (large, glassmorphic), Stats strip, Filter + Search, Project Cards,
 *    Table view, Modal (Project details), Chart-like SVG visuals,
 *    Footer and many inlined animation keyframes and helper utilities.
 *
 * NOTE: Keep this single-file pattern if you want the "very long & complicated" file.
 */

/* ---------------------------
   Mock Data & Helpers
   --------------------------- */
const MOCK_PROJECTS = [
  { id: "PROJ-101", name: "Q4 API Security Update", owner: "Mia Chen", budget: 150000, status: "Critical", team: 5, deadline: "2025-11-20" },
  { id: "PROJ-102", name: "Customer Portal Redesign", owner: "Alex Ray", budget: 450000, status: "On Track", team: 12, deadline: "2025-12-31" },
  { id: "PROJ-103", name: "Internal Data Migration", owner: "Sam Lopex", budget: 80000, status: "Delayed", team: 3, deadline: "2025-10-30" },
  { id: "PROJ-104", name: "Next-Gen Dashboard", owner: "Eva King", budget: 220000, status: "On Track", team: 8, deadline: "2026-01-15" },
  // extra items to lengthen the UI
  { id: "PROJ-105", name: "Mobile App V2 Launch", owner: "Bob Smith", budget: 300000, status: "Minor Risk", team: 10, deadline: "2025-12-05" },
  { id: "PROJ-106", name: "Compliance Audit Prep", owner: "Alice Johnson", budget: 40000, status: "Delayed", team: 4, deadline: "2025-11-10" },
  { id: "PROJ-107", name: "Billing System Revamp", owner: "Devin Clark", budget: 500000, status: "On Track", team: 9, deadline: "2026-03-01" },
  { id: "PROJ-108", name: "Marketing Automation", owner: "Grace Park", budget: 120000, status: "Critical", team: 6, deadline: "2025-11-25" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Critical":
      return { text: "text-red-600", bg: "bg-red-100/80", label: "Critical", ring: "ring-red-200" };
    case "Delayed":
      return { text: "text-orange-500", bg: "bg-orange-100/80", label: "Delayed", ring: "ring-orange-200" };
    case "Minor Risk":
      return { text: "text-yellow-500", bg: "bg-yellow-100/80", label: "Minor Risk", ring: "ring-yellow-200" };
    case "On Track":
    default:
      return { text: "text-green-600", bg: "bg-green-100/80", label: "On Track", ring: "ring-green-200" };
  }
};

const formatNumberShort = (n) => {
  if (n >= 1000000) return `$${Math.round(n / 100000) / 10}M`;
  if (n >= 1000) return `$${Math.round(n / 100) / 10}K`;
  return `$${n}`;
};

const formatCurrency = (n) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

/* ---------------------------
   Main Component
   --------------------------- */
const ProjectOverview = () => {
  // primary state
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // cards | table
  const [selectedProject, setSelectedProject] = useState(null);
  const [heroLift, setHeroLift] = useState({ x: 0, y: 0 });
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("budget_desc");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showingExportToast, setShowingExportToast] = useState(false);
  const navigate = useNavigate?.() ?? (() => {});

  // refs
  const heroRef = useRef(null);
  const inputRef = useRef(null);
  const exportTimer = useRef(null);

  // parallax for hero (mouse)
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      // dampen
      setHeroLift({ x: dx * 12, y: dy * 8 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // keyboard shortcut: "/" to focus search
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key.toLowerCase() === "n" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // simulate create new project (navigate)
        navigate("/create-project");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  // computed filtered & sorted list
  const visibleProjects = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let filtered = projects.filter((p) => {
      if (filterStatus !== "all") {
        const projectStatus = p.status.toLowerCase();
        if (filterStatus !== projectStatus) return false;
      }
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q)
      );
    });

    if (sortBy === "budget_desc") filtered = filtered.sort((x, y) => y.budget - x.budget);
    if (sortBy === "budget_asc") filtered = filtered.sort((x, y) => x.budget - y.budget);
    if (sortBy === "deadline") filtered = filtered.sort((x, y) => (new Date(x.deadline) - new Date(y.deadline)));

    return filtered;
  }, [projects, searchTerm, filterStatus, sortBy]);

  // open project details modal
  const openProject = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = "hidden";
  };

  const closeProject = () => {
    setSelectedProject(null);
    document.body.style.overflow = "";
  };

  // export CSV (simulated) — show toast
  const exportCSV = () => {
    // generate CSV text quickly
    const header = "id,name,owner,budget,status,team,deadline\n";
    const rows = projects.map((p) => `${p.id},${p.name},${p.owner},${p.budget},${p.status},${p.team},${p.deadline}`).join("\n");
    const csv = header + rows;
    // download via blob
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `projects_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    // show export toast
    setShowingExportToast(true);
    clearTimeout(exportTimer.current);
    exportTimer.current = setTimeout(() => setShowingExportToast(false), 3500);
  };

  // simulated "update status" action
  const updateStatus = (projectId) => {
    const statuses = ["On Track", "Minor Risk", "Delayed", "Critical"];
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const currentIdx = statuses.indexOf(p.status);
        const nextIdx = (currentIdx + 1) % statuses.length; // cycle through statuses
        return {
          ...p,
          status: statuses[nextIdx],
          deadline: new Date(new Date().getTime() + 86400000 * Math.floor(Math.random() * 30 + 1)).toISOString().slice(0, 10), // random future date
        };
      })
    );
  };

  // complex, long inline styles + animations (intentionally verbose, copied from source)
  const InlineStyles = () => (
    <style>{`
      /* Glass / sheen helpers */
      .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.66), rgba(255,255,255,0.5)); backdrop-filter: blur(8px) saturate(120%); -webkit-backdrop-filter: blur(8px) saturate(120%); border: 1px solid rgba(15,23,42,0.04); }
      .soft-shadow { box-shadow: 0 10px 30px rgba(2,6,23,0.06), 0 2px 6px rgba(2,6,23,0.04); }
      .floating-plate { transform: translateY(-6px); transition: transform 420ms cubic-bezier(.2,.9,.2,1), box-shadow 420ms ease; }
      .floating-plate:hover { transform: translateY(-12px); box-shadow: 0 30px 60px rgba(2,6,23,0.10); }

      /* Hero highlights */
      .hero-sheen { mix-blend-mode: screen; opacity: 0.9; filter: blur(20px); }

      /* subtle pulsing gradient */
      @keyframes pulseGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .moving-gradient { background: linear-gradient(90deg, rgba(250,204,21,0.10), rgba(239,68,68,0.06), rgba(124,58,237,0.05)); background-size: 200% 200%; animation: pulseGradient 8s ease-in-out infinite; }

      /* long list of micro animations for "complicated" effect */
      @keyframes floatY { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
      @keyframes floatX { 0% { transform: translateX(0); } 50% { transform: translateX(6px); } 100% { transform: translateX(0); } }
      @keyframes microBlink { 0% { opacity: 1; } 50% { opacity: .6; } 100% { opacity: 1; } }

      .float-slow { animation: floatY 9s ease-in-out infinite; }
      .float-fast { animation: floatX 6s ease-in-out infinite; }
      .blink-subtle { animation: microBlink 5s ease-in-out infinite; }

      /* project card reveal */
      .card-reveal { opacity: 0; transform: translateY(12px) scale(.998); transition: opacity 520ms ease, transform 520ms cubic-bezier(.2,.9,.2,1); }
      .card-reveal.visible { opacity: 1; transform: none; }

      /* long accessibility focus ring area */
      :focus { outline: 2px solid rgba(59,130,246,0.12); outline-offset: 4px; }

      /* make table rows alternate with very subtle background */
      .table-row-alt:nth-child(odd) { background: rgba(2,6,23,0.02); }

      /* complex responsive niceties */
      @media (min-width: 1280px) {
        .hero-title { font-size: clamp(42px, 5vw, 52px); letter-spacing: -0.02em; }
      }

      /* long gradient separator "faux" */
      .faux-gradient { height: 1px; background: linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0)); }

      /* export toast */
      .export-toast { position: fixed; right: 20px; bottom: 24px; z-index: 80; transform-origin: bottom right; animation: toastPop 320ms cubic-bezier(.2,.9,.2,1); }
      @keyframes toastPop { 0% { transform: translateY(8px) scale(.98); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }

      /* long block of "micro styling" to satisfy 'extremely long' requirement */
      .micro-detail-1 { border-radius: 8px; padding: 6px; }
      .micro-detail-2 { border-radius: 6px; padding: 4px; }
      .micro-detail-3 { transition: all 260ms ease; }

      /* dense "apple-like" focus states for interactive controls */
      .control-pill { border: 1px solid rgba(2,6,23,0.06); background: white; padding: 6px 10px; border-radius: 999px; box-shadow: 0 4px 14px rgba(2,6,23,0.04); }
      .control-pill.active { background: linear-gradient(180deg, #fff, #f8fafc); }

      /* longer "bloat" keyframes repeated */
      @keyframes wiggleTiny { 0% { transform: rotate(-0.3deg); } 50% { transform: rotate(0.3deg); } 100% { transform: rotate(-0.3deg); } }
      @keyframes expansion { 0% { transform: scale(0.998); } 100% { transform: scale(1); } }
      .wiggle { animation: wiggleTiny 6s ease-in-out infinite; }

      /* ensure images don't cause layout shift in hero */
      .hero-visual { width: 100%; height: auto; display: block; }

      /* long comment block intentionally omitted... more micro rules would go here */
    `}</style>
  );

  /* ---------------------------
     Rendered UI Sections (single file contains many sub-structures)
     --------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b pt-20 from-white via-white to-gray-50 text-gray-900 antialiased">
      <InlineStyles />

      {/* Export Toast */}
      {showingExportToast && (
        <div className="export-toast p-4 bg-gray-900 text-white rounded-xl shadow-2xl flex items-center gap-3">
          <FontAwesomeIcon icon={faDownload} className="text-green-400" />
          <div className="text-sm">Project data exported successfully!</div>
        </div>
      )}

      {/* HERO Section - massive, Apple-like */}
      <header ref={heroRef} className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-12">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 lg:col-span-7">
              

              <h1 className="hero-title font-bold text-gray-900 tracking-tight leading-tight max-w-3xl">
                Unified <span className="text-sky-700">Project Health</span> Overview — <span className="text-gray-700 font-medium">real-time insights, effortless management</span>
              </h1>

              <p className="mt-6 text-lg text-gray-600 max-w-xl">
                Track budget, monitor deadlines, and visualize team progress across your entire portfolio.
                Empower your stakeholders with clarity and predictable outcomes.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => navigate("/create-project")}
                  className="flex justify-center items-center gap-3 px-4 py-2.5 bg-sky-700 text-white rounded-2xl text-sm font-semibold cursor-pointer hover:bg-sky-800 transition"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Start New Project
                </button>

                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-200 bg-white"
                >
                  <FontAwesomeIcon icon={faDownload} />
                  Export CSV
                </button>

                <button
                  onClick={() => setViewMode((v) => (v === "cards" ? "table" : "cards"))}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border text-sm"
                >
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  {viewMode === "cards" ? "Table view" : "Card view"}
                </button>

                <div className="ml-auto hidden lg:flex items-center gap-3">
                  <div className="text-xs text-gray-500">Active Projects</div>
                  <div className="text-2xl font-semibold">{formatNumberShort(projects.length)}</div>
                </div>
              </div>

              {/* subtle visual cues */}
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                <div className="p-4 glass-card soft-shadow micro-detail-1">
                  <div className="text-xs uppercase text-gray-500">Total Budget</div>
                  <div className="mt-2 text-lg font-semibold">{
                    formatNumberShort(projects.reduce((s, p) => s + p.budget, 0))
                  }</div>
                </div>
                <div className="p-4 glass-card soft-shadow micro-detail-2">
                  <div className="text-xs uppercase text-gray-500">Total Team Members</div>
                  <div className="mt-2 text-lg font-semibold">{projects.reduce((s, p) => s + p.team, 0)}</div>
                </div>
                <div className="p-4 glass-card soft-shadow micro-detail-3">
                  <div className="text-xs uppercase text-gray-500">Nearest Deadline</div>
                  <div className="mt-2 text-lg font-semibold">{projects.sort((a,b)=>new Date(a.deadline)-new Date(b.deadline))[0].deadline}</div>
                </div>
              </div>
            </div>

            {/* right visual - MacBook-like card */}
            <div className="col-span-12 lg:col-span-5">
              <div
                className="rounded-3xl   p-6 relative overflow-hidden border border-gray-300"
                
                
              >
                {/* decorative top lights */}
                <div className="absolute -left-24 -top-24 w-[420px] h-[420px] rounded-full hero-sheen opacity-30 bg-gradient-to-tr from-pink-100 to-transparent" />
                <div className="absolute -right-20 top-8 w-[260px] h-[260px] rounded-full hero-sheen opacity-20 bg-gradient-to-br from-indigo-100 to-transparent" />

                {/* simulated device visual */}
                <div className="relative">
                  <div className="w-full h-auto border border-gray-100 rounded-2xl p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500 uppercase">Live Project Log</div>
                        <div className="text-lg text-gray-800 font-semibold mt-1">PROJ-101: Q4 API Security Update</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Budget Spent</div>
                        <div className="text-xl font-bold text-gray-900">78%</div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg border border-gray-100 p-3 bg-gradient-to-b from-white to-gray-50">
                      <pre className="text-xs font-mono text-gray-700 overflow-x-auto">
{`> task: security-review --module auth-api
> status : code-review pending for 2 days
> flagged 1 high-risk ticket: JWT vulnerability
> action: re-assign to Mia Chen, priority: critical
> deadline extension requested for 1 week
`}
                      </pre>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <button className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-md bg-sky-700 text-white">View Details</button>
                      <button className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-50 border border-gray-200">Open Tickets</button>
                    </div>
                  </div>

                  {/* small badges */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg p-3 bg-gray-50 border border-gray-100 text-center">Open Tickets <div className="font-semibold">47</div></div>
                    <div className="rounded-lg p-3 bg-gray-50 border border-gray-100 text-center">Burndown <div className="font-semibold">Stable</div></div>
                    <div className="rounded-lg p-3 bg-gray-50 border border-gray-100 text-center">Risk Index <div className="font-semibold">3.8 / 5</div></div>
                  </div>
                </div>

                {/* decorative bottom highlight */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* subtle separator */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="faux-gradient mt-6" />
        </div>
      </header>

      {/* Controls: Search, status filter, sort */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8">
        <div className="bg-white/80 glass-card border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label htmlFor="search" className="sr-only">Search projects</label>
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
                aria-label="Search projects"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">Status</div>
                <select
                  aria-label="Filter by status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value.toLowerCase())}
                  className="p-2 rounded-md border bg-white text-sm"
                >
                  <option value="all">All</option>
                  <option value="on track">On Track</option>
                  <option value="minor risk">Minor Risk</option>
                  <option value="delayed">Delayed</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">Sort</div>
                <select
                  aria-label="Sort projects"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 rounded-md border bg-white text-sm"
                >
                  <option value="budget_desc">Budget (high → low)</option>
                  <option value="budget_asc">Budget (low → high)</option>
                  <option value="deadline">Nearest Deadline</option>
                </select>
              </div>

              <div className="hidden md:block h-8 w-px bg-gray-100 mx-2" />

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
          <div className="mt-3 text-xs text-gray-500">Tip: Use <kbd className="px-2 py-1 bg-gray-100 rounded">/</kbd> to focus search • <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl/⌘+N</kbd> to register new project</div>
        </div>
      </section>

      {/* Main content: Cards or Table */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-5 bg-white rounded-2xl soft-shadow glass-card">
            <div className="text-xs text-gray-500">Total Projects</div>
            <div className="mt-2 text-2xl font-semibold">{projects.length}</div>
            <div className="mt-3 text-sm text-gray-500">Active and In Review</div>
          </div>
          <div className="p-5 bg-white rounded-2xl soft-shadow glass-card">
            <div className="text-xs text-gray-500">Average Team Size</div>
            <div className="mt-2 text-2xl font-semibold">{Math.round(projects.reduce((s,p)=>s+p.team,0)/projects.length)}</div>
            <div className="mt-3 text-sm text-gray-500">Members across all teams</div>
          </div>
          <div className="p-5 bg-white rounded-2xl soft-shadow glass-card">
            <div className="text-xs text-gray-500">Critical Status</div>
            <div className="mt-2 text-2xl font-semibold text-red-600">{projects.filter(p => p.status === 'Critical').length}</div>
            <div className="mt-3 text-sm text-gray-500">Require immediate attention</div>
          </div>
          <div className="p-5 bg-white rounded-2xl soft-shadow glass-card">
            <div className="text-xs text-gray-500">Total Budget (USD)</div>
            <div className="mt-2 text-2xl font-semibold">{formatNumberShort(projects.reduce((s, p) => s + p.budget, 0))}</div>
            <div className="mt-3 text-sm text-gray-500">Allocated to projects</div>
          </div>
        </div>

        {/* Content area */}
        {viewMode === "cards" ? (
          <section aria-label="Project cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.length ? visibleProjects.map((project, idx) => {
              const statusColor = getStatusColor(project.status);
              return (
                <article
                  key={project.id}
                  className={`p-6 bg-white rounded-2xl soft-shadow glass-card card-reveal ${idx < 6 ? "visible" : ""}`}
                  tabIndex={0}
                  aria-labelledby={`project-${project.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-50 to-white flex items-center justify-center border border-gray-100">
                      <FontAwesomeIcon icon={faShieldHalved} className="text-gray-700 text-2xl" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 id={`project-${project.id}`} className="text-lg font-semibold text-gray-900">{project.name}</h3>
                          <div className="text-xs text-gray-500 mt-1 font-mono">{project.id}</div>
                        </div>

                        <div className="text-right">
                          <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusColor.bg} ${statusColor.text}`}>
                            {statusColor.label}
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-gray-600 flex items-center gap-3">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        Owner: **{project.owner}**
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs text-gray-500">Budget</div>
                          <div className={`text-2xl font-bold`}>{formatCurrency(project.budget)}</div>
                        </div>

                        <div className="text-xs text-gray-500 text-right">
                          <div>Deadline</div>
                          <div className="mt-1 font-medium">{project.deadline}</div>
                          <div className="text-xs text-gray-400">{project.team} team members</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => openProject(project)}
                          className="px-3 py-2 rounded-md bg-gray-900 text-white text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => updateStatus(project.id)}
                          className="px-3 py-2 rounded-md border text-sm"
                        >
                          Update Status
                        </button>

                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={() => exportCSV()}
                            className="text-xs px-3 py-2 rounded-md bg-white border"
                          >
                            Report
                          </button>
                          <Link to={`/project/${project.id}`} className="text-xs px-3 py-2 rounded-md border bg-white">
                            Settings
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            }) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl">
                <div className="text-lg font-semibold">No projects matched your search</div>
                <div className="text-sm text-gray-500 mt-2">Try removing filters or starting a new project.</div>
              </div>
            )}
          </section>
        ) : (
          <section aria-label="Project table" className="bg-white rounded-2xl soft-shadow overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Showing</div>
                <div className="text-lg font-semibold">{visibleProjects.length} projects</div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={exportCSV} className="px-3 py-2 rounded-md bg-gray-900 text-white">Export CSV</button>
                <div className="text-xs text-gray-500">Tip: click a row to open details</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3">Project</th>
                    <th className="px-6 py-3">Owner</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Budget</th>
                    <th className="px-6 py-3">Deadline</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {visibleProjects.map((p, i) => {
                    const statusColor = getStatusColor(p.status);
                    return (
                      <tr
                        key={p.id}
                        className={`cursor-pointer hover:bg-gray-50 table-row-alt`}
                        onClick={() => openProject(p)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                              <FontAwesomeIcon icon={faShieldHalved} />
                            </div>
                            <div>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-xs text-gray-500 font-mono">{p.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">{p.owner}</td>

                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold">{statusColor.label}</div>
                          <div className={`text-xs ${statusColor.text}`}>{p.team} members</div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{formatCurrency(p.budget)}</td>

                        <td className="px-6 py-4 text-sm text-gray-600">{p.deadline}</td>

                        <td className="px-6 py-4 text-right">
                          <FontAwesomeIcon icon={faArrowRight} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Large visual analytics block (SVG chart + long caption) */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 bg-white rounded-2xl soft-shadow glass-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Resource Allocation</div>
                <div className="text-lg font-semibold">Budget vs. Actual Spend Trend</div>
              </div>
              <div className="text-sm text-gray-500">Last 6 months</div>
            </div>

            {/* Placeholder for SVG/Chart - intentionally simple to keep the monolithic style without external libraries */}
            <div className="mt-6 h-64 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
              <svg width="90%" height="80%" viewBox="0 0 100 50" preserveAspectRatio="none">
                {/* Budget Line (Blue) */}
                <polyline points="0,35 15,30 30,25 45,20 60,15 75,10 90,8" fill="none" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" />
                {/* Actual Spend Line (Red/Orange) */}
                <polyline points="0,40 15,32 30,28 45,26 60,22 75,18 90,15" fill="none" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
                {/* Labels/Dots */}
                {[...Array(7)].map((_, i) => (
                  <circle key={i} cx={i * 15} cy={35 - i * 5} r="0.5" fill="#3b82f6" /> // Simplified points
                ))}
              </svg>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl soft-shadow glass-card">
            <div className="text-sm font-semibold">Project Risk Breakdown</div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-green-600"><FontAwesomeIcon icon={faChartLine} className="mr-2" />On Track</span>
                <span className="font-semibold">{projects.filter(p => p.status === 'On Track').length}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-yellow-500"><FontAwesomeIcon icon={faChartLine} className="mr-2" />Minor Risk</span>
                <span className="font-semibold">{projects.filter(p => p.status === 'Minor Risk').length}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-orange-500"><FontAwesomeIcon icon={faChartLine} className="mr-2" />Delayed</span>
                <span className="font-semibold">{projects.filter(p => p.status === 'Delayed').length}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-red-600"><FontAwesomeIcon icon={faChartLine} className="mr-2" />Critical</span>
                <span className="font-semibold">{projects.filter(p => p.status === 'Critical').length}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Long, complex informational block */}
        <section className="mt-12 p-8 bg-white/70 rounded-3xl border border-gray-200 soft-shadow glass-card moving-gradient">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <FontAwesomeIcon icon={faHistory} className="text-sky-700" />
            Continuous Project Monitoring Architecture
          </h2>
          <p className="mt-3 text-gray-700 max-w-4xl">
            The **Project Health Index** is calculated dynamically, integrating inputs from budget systems, ticket trackers, and time logging. 
            Every project state is rigorously validated against baseline projections for both scope and resource burn. 
            Critical status is triggered by a composite score, taking into account **deadline proximity, budget overage, and high-priority ticket accumulation**. 
            This provides a proactive, transparent view of the entire portfolio, enabling stakeholders to intervene before a risk becomes a certainty.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <span className="control-pill text-sm">Budget Analysis</span>
            <span className="control-pill text-sm">Deadline Forecasting</span>
            <span className="control-pill text-sm">Team Velocity Tracking</span>
          </div>
        </section>
      </main>

      {/* FOOTER with navigation and links */}
      <footer className="mt-12 py-8 border-t border-gray-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <p>&copy; {new Date().getFullYear()} ProjectOps Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/support" className="hover:text-sky-700">Support</Link>
              <Link to="/privacy" className="hover:text-sky-700">Privacy</Link>
              <Link to="/docs" className="hover:text-sky-700">Documentation</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectOverview;