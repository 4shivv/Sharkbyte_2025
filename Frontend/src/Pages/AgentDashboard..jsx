// src/components/AgentDashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faShieldHalved,
  faUser,
  faBrain,
  faTachometerAlt,
  faEdit,
  faHistory,
  faArrowRight,
  faChevronDown,
  faDownload,
  faEllipsisV,
  faTimes,
  faXmark, // Added for the modal close button
} from "@fortawesome/free-solid-svg-icons";
import { agentAPI } from "../services/api";



/* ---------------------------
    Mock Data & Helpers
    --------------------------- */
const MOCK_AGENTS = [
  { id: "AGNT-001", name: "RFP Grant Writer", owner: "Alice Johnson", score: 85, risk: "Low", scans: 4, lastScan: "2025-10-28" },
  { id: "AGNT-002", name: "Customer Service Bot", owner: "Bob Smith", score: 55, risk: "High", scans: 1, lastScan: "2025-11-04" },
  { id: "AGNT-003", name: "Internal QA Agent", owner: "Charlie Bell", score: 68, risk: "Medium", scans: 12, lastScan: "2025-11-01" },
  { id: "AGNT-004", name: "Log Analyzer", owner: "Devin Clark", score: 92, risk: "Low", scans: 2, lastScan: "2025-11-05" },
  // extra items to lengthen the UI
  { id: "AGNT-005", name: "Fraud Detector", owner: "Eve Lopez", score: 72, risk: "Medium", scans: 7, lastScan: "2025-11-02" },
  { id: "AGNT-006", name: "Analytics Reporter", owner: "Frank Wu", score: 48, risk: "High", scans: 3, lastScan: "2025-10-30" },
  { id: "AGNT-007", name: "Scheduler Agent", owner: "Grace Park", score: 96, risk: "Low", scans: 9, lastScan: "2025-11-06" },
  { id: "AGNT-008", name: "Sentiment Miner", owner: "Hector Alvarez", score: 61, risk: "Medium", scans: 5, lastScan: "2025-11-03" },
];

const getRiskColor = (score) => {
  if (score <= 40) return { text: "text-red-600", bg: "bg-red-100/80", label: "Critical", ring: "ring-red-200" };
  if (score <= 60) return { text: "text-orange-500", bg: "bg-orange-100/80", label: "High", ring: "ring-orange-200" };
  if (score <= 80) return { text: "text-yellow-500", bg: "bg-yellow-100/80", label: "Medium", ring: "ring-yellow-200" };
  return { text: "text-green-600", bg: "bg-green-100/80", label: "Low", ring: "ring-green-200" };
};

const formatNumberShort = (n) => {
  if (n >= 1000) return `${Math.round(n / 100) / 10}k`;
  return `${n}`;
};

// Map backend agent data to UI format
const mapAgentToUIFormat = (agent) => {
  // Generate a mock security score (will be replaced by actual scanning later)
  const mockScore = agent.score || Math.floor(Math.random() * 50) + 50; // 50-99
  const risk = getRiskColor(mockScore);

  return {
    ...agent,
    name: agent.agent_name,
    score: mockScore,
    risk: risk.label,
    scans: agent.scans || 0,
    lastScan: agent.updatedAt ? new Date(agent.updatedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
};

/* ---------------------------
    Agent Registration Modal Component (NEW)
    --------------------------- */

/**
 * Renders a full-screen modal/popup for registering a new agent.
 * FR-2.1, FR-2.2, FR-2.3, FR-2.4: Captures agent name (ID), owner, description, and system prompt
 */
const RegisterAgentModal = ({ isOpen, onClose, onRegister }) => {
  // Form state matching functional requirements
  const [agentName, setAgentName] = useState("");
  const [agentOwner, setAgentOwner] = useState("");
  const [description, setDescription] = useState(""); // FR-2.3
  const [systemPrompt, setSystemPrompt] = useState(""); // FR-2.4
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call the onRegister function with the proper data structure
      await onRegister({
        agent_name: agentName,
        owner: agentOwner,
        description: description || null,
        system_prompt: systemPrompt || null,
      });

      // Reset form and close
      setAgentName("");
      setAgentOwner("");
      setDescription("");
      setSystemPrompt("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to register agent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
        className="fixed inset-0 z-[100] overflow-y-auto bg-black/30 bg-opacity-70 flex items-center justify-center p-4 transition-opacity duration-300"
        aria-modal="true"
        role="dialog"
        onClick={onClose} // Close on backdrop click
    >
      <div 
        className="bg-white rounded-2xl p-8 w-full max-w-lg mx-auto transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent clicking modal content from closing it
      >
        <div className="flex justify-between items-center pb-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <FontAwesomeIcon icon={faPlus} className="text-sky-700" />
            Register New Agent
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-700 transition flex items-center hover:bg-gray-100 px-2 py-2.5 rounded-full"
            aria-label="Close registration form"
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FR-2.1: Agent Name (Mandatory ID field) */}
          <div>
            <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Name / ID <span className="text-red-500">*</span>
            </label>
            <input
              id="agent-name"
              type="text"
              required
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              disabled={loading}
              placeholder="e.g., Internal QA Agent"
              className="mt-1 block w-full rounded-lg border-gray-200 px-3 py-2 border focus:border-sky-700 focus:ring-1 focus:ring-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* FR-2.2: Agent Owner (Mandatory) */}
          <div>
            <label htmlFor="agent-owner" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Owner <span className="text-red-500">*</span>
            </label>
            <input
              id="agent-owner"
              type="text"
              required
              value={agentOwner}
              onChange={(e) => setAgentOwner(e.target.value)}
              disabled={loading}
              placeholder="e.g., Alice Johnson"
              className="mt-1 block w-full rounded-lg border-gray-200 px-3 py-2 border focus:border-sky-700 focus:ring-1 focus:ring-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Accountable person for this agent's behavior</p>
          </div>

          {/* FR-2.3: Purpose/Description */}
          <div>
            <label htmlFor="agent-description" className="block text-sm font-medium text-gray-700 mb-1">
              Purpose / Description
            </label>
            <textarea
              id="agent-description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="Describe the agent's intended purpose and approved scope..."
              className="mt-1 block w-full rounded-lg border-gray-200 px-3 py-2 border focus:border-sky-700 focus:ring-1 focus:ring-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Define approved scope and capabilities (FR-2.3)</p>
          </div>

          {/* FR-2.4: System Prompt */}
          <div>
            <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-700 mb-1">
              System Prompt
            </label>
            <textarea
              id="system-prompt"
              rows="6"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              disabled={loading}
              placeholder="Enter the complete system prompt for security analysis...

Example:
You are a customer service agent. You can only access customer records when provided with a valid ticket ID. Never reveal internal system information."
              className="mt-1 block w-full rounded-lg border-gray-200 px-3 py-2 border focus:border-sky-700 focus:ring-1 focus:ring-sky-700 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Required for vulnerability scanning (FR-2.4)</p>
          </div>

          <div className="flex justify-end pt-4 gap-3 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm cursor-pointer font-semibold text-white bg-sky-700 rounded-full hover:bg-sky-800 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faPlus} />
              {loading ? "Registering..." : "Register Agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------------------------
    Edit Agent Modal Component (FR-2.5)
    --------------------------- */
/**
 * Modal for editing existing agent details
 * FR-2.5: Update agent owner, description, and system_prompt
 */
const EditAgentModal = ({ isOpen, onClose, agent, onUpdate }) => {
  const [agentName, setAgentName] = useState("");
  const [agentOwner, setAgentOwner] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with agent data when modal opens
  useEffect(() => {
    if (agent && isOpen) {
      setAgentName(agent.agent_name || agent.name || "");
      setAgentOwner(agent.owner || "");
      setDescription(agent.description || "");
      setSystemPrompt(agent.system_prompt || "");
    }
  }, [agent, isOpen]);

  if (!isOpen || !agent) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onUpdate(agent.id, {
        agent_name: agentName,
        owner: agentOwner,
        description: description || null,
        system_prompt: systemPrompt || null,
      });

      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update agent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/30 bg-opacity-70 flex items-center justify-center p-4 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-lg mx-auto transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <FontAwesomeIcon icon={faEdit} className="text-sky-700" />
            Edit Agent
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-700 transition flex items-center hover:bg-gray-100 px-2 py-2.5 rounded-full"
            aria-label="Close edit form"
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Agent Name */}
          <div>
            <label htmlFor="edit-agent-name" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Name / ID <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-agent-name"
              type="text"
              required
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full rounded-lg border-gray-200 px-3 py-2 border focus:border-sky-700 focus:ring-1 focus:ring-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Agent Owner */}
          <div>
            <label htmlFor="edit-agent-owner" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Owner <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-agent-owner"
              type="text"
              required
              value={agentOwner}
              onChange={(e) => setAgentOwner(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full rounded-lg border-gray-200 px-3 py-2 border focus:border-sky-700 focus:ring-1 focus:ring-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-agent-description" className="block text-sm font-medium text-gray-700 mb-1">
              Purpose / Description
            </label>
            <textarea
              id="edit-agent-description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full rounded-lg border-gray-200 px-3 py-2 border focus:border-sky-700 focus:ring-1 focus:ring-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* System Prompt */}
          <div>
            <label htmlFor="edit-system-prompt" className="block text-sm font-medium text-gray-700 mb-1">
              System Prompt
            </label>
            <textarea
              id="edit-system-prompt"
              rows="6"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full rounded-lg border-gray-200 px-3 py-2 border focus:border-sky-700 focus:ring-1 focus:ring-sky-700 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end pt-4 gap-3 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm cursor-pointer font-semibold text-white bg-sky-700 rounded-full hover:bg-sky-800 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faEdit} />
              {loading ? "Updating..." : "Update Agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/* ---------------------------
    Main Component
    --------------------------- */
const AgentDashboard = () => {
  // primary state
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // cards | table
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [heroLift, setHeroLift] = useState({ x: 0, y: 0 });
  const [filterRisk, setFilterRisk] = useState("all");
  const [sortBy, setSortBy] = useState("score_desc");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showingExportToast, setShowingExportToast] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState(null);
  const navigate = useNavigate?.() ?? (() => {});

  // refs
  const heroRef = useRef(null);
  const inputRef = useRef(null);
  const exportTimer = useRef(null);

  // FR-2.6: Fetch all agents on component mount
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await agentAPI.getAll();
      // Map backend agent format to UI format
      const mappedAgents = data.map(mapAgentToUIFormat);
      setAgents(mappedAgents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      // If unauthorized, redirect to login (handled by axios interceptor)
    } finally {
      setLoading(false);
    }
  };

  // Handlers for the new agent modal
  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
    document.body.style.overflow = "";
  };

  // FR-2.1, FR-2.2, FR-2.3, FR-2.4: Register new agent with backend
  const handleAgentRegistration = async (newAgentData) => {
    try {
      const createdAgent = await agentAPI.create(newAgentData);
      // Map to UI format and add to the list
      const mappedAgent = mapAgentToUIFormat(createdAgent);
      setAgents(prev => [mappedAgent, ...prev]);
      return createdAgent;
    } catch (error) {
      console.error("Error registering agent:", error);
      throw error;
    }
  };

  // FR-2.5: Edit agent handlers
  const openEditModal = (agent) => {
    setAgentToEdit(agent);
    setIsEditModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setAgentToEdit(null);
    document.body.style.overflow = "";
  };

  const handleAgentUpdate = async (agentId, updatedData) => {
    try {
      const updatedAgent = await agentAPI.update(agentId, updatedData);
      // Update the agent in the list
      const mappedAgent = mapAgentToUIFormat(updatedAgent);
      setAgents(prev => prev.map(a => a.id === agentId ? mappedAgent : a));
      return updatedAgent;
    } catch (error) {
      console.error("Error updating agent:", error);
      throw error;
    }
  };


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
        // Open modal instead of navigating
        openRegisterModal(); 
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); // Removed [navigate] dependency as navigation is replaced by modal

  // computed filtered & sorted list
  const visibleAgents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let filtered = agents.filter((a) => {
      if (filterRisk !== "all") {
        const riskGroup = getRiskColor(a.score).label.toLowerCase();
        if (filterRisk !== riskGroup) return false;
      }
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.owner.toLowerCase().includes(q)
      );
    });

    if (sortBy === "score_desc") filtered = filtered.sort((x, y) => y.score - x.score);
    if (sortBy === "score_asc") filtered = filtered.sort((x, y) => x.score - y.score);
    if (sortBy === "recent") filtered = filtered.sort((x, y) => (new Date(y.lastScan) - new Date(x.lastScan)));

    return filtered;
  }, [agents, searchTerm, filterRisk, sortBy]);

  // open agent details page
  const openAgent = (agent) => {
    navigate(`/agents/${agent.id}`);
  };

  const closeAgent = () => {
    setSelectedAgent(null);
    document.body.style.overflow = "";
  };

  // export CSV (simulated) — show toast
  const exportCSV = () => {
    // generate CSV text quickly
    const header = "id,name,owner,score,risk,scans,lastScan\n";
    const rows = agents.map((a) => `${a.id},${a.name},${a.owner},${a.score},${a.risk},${a.scans},${a.lastScan}`).join("\n");
    const csv = header + rows;
    // download via blob
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `agents_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    // show export toast
    setShowingExportToast(true);
    clearTimeout(exportTimer.current);
    exportTimer.current = setTimeout(() => setShowingExportToast(false), 3500);
  };

  // Navigate to agent details page where scan can be initiated
  const scanNow = (agentId) => {
    navigate(`/agents/${agentId}`);
  };

  // complex, long inline styles + animations (intentionally verbose)
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

      /* agent card reveal */
      .card-reveal { opacity: 0; transform: translateY(12px) scale(.998); transition: opacity 520ms ease, transform 520ms cubic-bezier(.2,.9,.2,1); }
      .card-reveal.visible { opacity: 1; transform: none; }

      /* long accessibility focus ring area */
      

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
    <div className="min-h-screen bg-gradient-to-b pt-30 from-white via-white to-gray-50 text-gray-900 antialiased font-inter">
      <InlineStyles />

      {/* Agent Registration Modal */}
      <RegisterAgentModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        onRegister={handleAgentRegistration}
      />

      {/* FR-2.5: Edit Agent Modal */}
      <EditAgentModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        agent={agentToEdit}
        onUpdate={handleAgentUpdate}
      />
      

      
      <header ref={heroRef} className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-12">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 lg:col-span-7">
              

              <h1 className="hero-title text-[42px] md:text-[52px] font-bold text-gray-900 tracking-tight leading-tight max-w-3xl">
                Beautifully simple agent oversight — <span className="text-gray-700 font-medium">built for high-trust teams</span>
              </h1>

              <p className="mt-6 text-md text-gray-600 max-w-xl">
                Monitor, scan, and harden your deployed agents with automated red-teaming and live remediation.
                Elegant, fast, and focused — everything the security and product teams need.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <button
                  onClick={openRegisterModal} // UPDATED to open modal
                  className="flex justify-center items-center gap-3 px-4 py-2.5 bg-sky-700 text-white rounded-full text-sm font-semibold cursor-pointer hover:bg-sky-800 transition"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Register New Agent
                </button>

                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors cursor-pointer "
                >
                  <FontAwesomeIcon icon={faDownload} />
                  Export CSV
                </button>

                <button
                  onClick={() => setViewMode((v) => (v === "cards" ? "table" : "cards"))}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  {viewMode === "cards" ? "Table view" : "Card view"}
                </button>

                <div className="ml-auto hidden lg:flex items-center gap-3">
                  <div className="text-xs text-gray-500">Agents deployed</div>
                  <div className="text-2xl font-semibold">{formatNumberShort(agents.length)}</div>
                </div>
              </div>

              {/* subtle visual cues */}
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                <div className="rounded-lg p-3 bg-gray-100 border border-gray-100 ">
                  <div className="text-xs uppercase text-gray-500">Average Score</div>
                  <div className="mt-2 text-lg font-semibold">
                    {agents.length > 0 ? Math.round(agents.reduce((s, a) => s + a.score, 0) / agents.length) : 0}
                  </div>
                </div>
                <div className="rounded-lg p-3 bg-gray-100 border border-gray-100 ">
                  <div className="text-xs uppercase text-gray-500">Total Scans</div>
                  <div className="mt-2 text-lg font-semibold">
                    {agents.length > 0 ? agents.reduce((s, a) => s + (a.scans || 0), 0) : 0}
                  </div>
                </div>
                <div className="rounded-lg p-3 bg-gray-100 border border-gray-100 ">
                  <div className="text-xs uppercase text-gray-500">Last Activity</div>
                  <div className="mt-2 text-lg font-semibold">
                    {agents.length > 0 ? agents.sort((a,b)=>new Date(b.lastScan||0)-new Date(a.lastScan||0))[0].lastScan : 'Never'}
                  </div>
                </div>
              </div>
            </div>

            {/* right visual - MacBook-like card */}
            <div className="col-span-12 lg:col-span-5">
              <div
                className="rounded-3xl   p-6 relative overflow-hidden border border-gray-200"
                
                
              >
                {/* decorative top lights */}
                <div className="absolute -left-24 -top-24 w-[420px] h-[420px] rounded-full hero-sheen opacity-30 bg-gradient-to-tr from-pink-100 to-transparent" />
                <div className="absolute -right-20 top-8 w-[260px] h-[260px] rounded-full hero-sheen opacity-20 bg-gradient-to-br from-indigo-100 to-transparent" />

                {/* simulated device visual */}
                <div className="relative">
                  <div className="w-full h-auto border border-gray-100 rounded-2xl p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500 uppercase">Live Cloud Scan</div>
                        <div className="text-lg text-gray-800 font-semibold mt-1">Instruction Hierarchy Audit</div>
                      </div>
                      <div className="text-right flex items-center gap-3 justify-center">
                        <div className="text-xs text-gray-500">Risk</div>
                        <div className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm border border-green-100">Low</div>

                      </div>
                    </div>

                    <div className="mt-4 rounded-lg border border-gray-100 p-3 bg-gray-900">
                      <div className="flex items-center gap-3">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" />
                      <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                      <div className="ml-auto text-[10px] text-gray-400">Live</div>
                    </div>
                      <pre className="text-xs font-mono text-white overflow-x-auto">
{`> run: agent-audit --id AGNT-001
> step 1 : validate inputs
> step 2 : inspect instruction chain
> flagged 1 potential leakage at step 3
> recommended: wrap step3 with sandbox + ratelimit
`}
                      </pre>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <button className="text-sm inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-700 text-white cursor-pointer">Open Scan</button>
                      <button className="text-sm inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200 cursor-pointer">View Diff</button>
                    </div>
                  </div>

                  {/* small badges */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg p-3 bg-gray-100 border border-gray-100 text-center"><span className="text-gray-500">Uptime</span> <div className="font-semibold">99.9%</div></div>
                    <div className="rounded-lg p-3 bg-gray-100 border border-gray-100 text-center"><span className="text-gray-500">Avg RT </span><div className="font-semibold">14ms</div></div>
                    <div className="rounded-lg p-3 bg-gray-100 border border-gray-100 text-center"><span className="text-gray-500">Scans/day </span><div className="font-semibold">1.4k</div></div>
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

      {/* Controls: Search, risk filter, sort */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8">
        <div className="bg-white/80 border border-gray-300 rounded-2xl p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label htmlFor="search" className="sr-only">Search agents</label>
            <div className="flex items-center gap-3 flex-1">
              <div className="px-3 py-2 rounded-lg border border-gray-100 bg-gray-100">
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
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">Risk</div>
                <select
                  aria-label="Filter by risk"
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-2 py-1.5 rounded-md border border-gray-300 bg-white text-sm cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">Sort</div>
                <select
                  aria-label="Sort agents"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 py-1.5 rounded-md border border-gray-300 bg-white text-sm cursor-pointer"
                >
                  <option value="score_desc">Score (high → low)</option>
                  <option value="score_asc">Score (low → high)</option>
                  <option value="recent">Most recent scan</option>
                </select>
              </div>

              <div className="hidden md:block h-8 w-px bg-gray-100 mx-2" />

              <div className="hidden md:flex items-center gap-2">
                <div className="text-xs text-gray-500">View</div>
                <div className="inline-flex rounded-md px-1 bg-white border border-gray-100">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`px-3 py-1 rounded-md text-sm cursor-pointer ${viewMode === "cards" ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
                    aria-pressed={viewMode === "cards"}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1 rounded-md text-sm cursor-pointer ${viewMode === "table" ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
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

      {/* Main content: Cards or Table */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-5 bg-gray-100 rounded-2xl">
            <div className="text-xs text-gray-500">Total Agents</div>
            <div className="mt-2 text-2xl font-semibold">{agents.length}</div>
            <div className="mt-3 text-sm text-gray-500">Active and monitored</div>
          </div>
          <div className="p-5 bg-gray-100 rounded-2xl">
            <div className="text-xs text-gray-500">Avg Security Score</div>
            <div className="mt-2 text-2xl font-semibold">
              {agents.length > 0 ? Math.round(agents.reduce((s,a)=>s+a.score,0)/agents.length) : 0}
            </div>
            <div className="mt-3 text-sm text-gray-500">Higher is safer</div>
          </div>
          <div className="p-5 bg-gray-100 rounded-2xl">
            <div className="text-xs text-gray-500">Total Scans</div>
            <div className="mt-2 text-2xl font-semibold">
              {agents.length > 0 ? agents.reduce((s,a)=>s+(a.scans||0),0) : 0}
            </div>
            <div className="mt-3 text-sm text-gray-500">Security assessments</div>
          </div>
          <div className="p-5 bg-gray-100 rounded-2xl">
            <div className="text-xs text-gray-500">High Risk Agents</div>
            <div className="mt-2 text-2xl font-semibold text-red-600">
              {agents.length > 0 ? agents.filter(a => a.score < 60).length : 0}
            </div>
            <div className="mt-3 text-sm text-gray-500">Require attention</div>
          </div>
        </div>

        {/* Content area */}
        {loading ? (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-300 mb-8">
            <div className="text-lg font-semibold">Loading agents...</div>
            <div className="text-sm text-gray-500 mt-2">Fetching your registered agents from the database.</div>
          </div>
        ) : visibleAgents.length === 0 && !loading ? (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-300 mb-8">
            <div className="text-lg font-semibold">
              {agents.length === 0 ? "No agents registered yet" : "No agents matched your search"}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {agents.length === 0
                ? "Click 'Register New Agent' above to add your first agent to AgentGuard."
                : "Try removing filters or adjusting your search terms."}
            </div>
          </div>
        ) : null}

        {viewMode === "cards" && visibleAgents.length > 0 && (
          <section aria-label="Agent cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleAgents.map((agent, idx) => {
              const risk = getRiskColor(agent.score);
              return (
                <article
                  key={agent.id}
                  className={`p-6 bg-white rounded-2xl border border-gray-300  card-reveal ${idx < 6 ? "visible" : ""}`}
                  tabIndex={0}
                  aria-labelledby={`agent-${agent.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-50 to-white flex items-center border-gray-100 bg-gray-100 justify-center border">
                      <FontAwesomeIcon icon={faBrain} className="text-gray-700 text-2xl " />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 id={`agent-${agent.id}`} className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                          <div className="text-xs text-gray-500 mt-1 font-mono">{agent.id}</div>
                        </div>

                        <div className="text-right">
                          <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${risk.bg} ${risk.text}`}>
                            {risk.label}
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-gray-600 flex items-center gap-3">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        Owner: {agent.owner}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs text-gray-500">Security score</div>
                          <div className={`text-2xl font-bold ${risk.text}`}>{agent.score}</div>
                        </div>

                        <div className="text-xs text-gray-500 text-left">
                          <div>Last scan</div>
                          <div className="mt-1 font-medium">{agent.lastScan}</div>
                          <div className="text-xs text-gray-400">{agent.scans} scans</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <button
                          onClick={() => openAgent(agent)}
                          className="px-3 py-1 rounded-full bg-gray-900 cursor-pointer text-white text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEditModal(agent)}
                          className="px-3 py-1 rounded-full border cursor-pointer border-gray-300 text-sm hover:bg-gray-50"
                          title="Edit agent details (FR-2.5)"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => scanNow(agent.id)}
                          className="px-3 py-1 rounded-full border cursor-pointer border-gray-300 text-sm hover:bg-gray-50"
                        >
                          Scan
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {viewMode === "table" && visibleAgents.length > 0 && (
          <section aria-label="Agent table" className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Showing</div>
                <div className="text-lg font-semibold">{visibleAgents.length} agents</div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={exportCSV} className="px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white">Export CSV</button>
                <div className="text-xs text-gray-500">Tip: click a row to open details</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3">Agent</th>
                    <th className="px-6 py-3">Owner</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Scans</th>
                    <th className="px-6 py-3">Last Scan</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {visibleAgents.map((a, i) => {
                    const risk = getRiskColor(a.score);
                    return (
                      <tr
                        key={a.id}
                        className={`cursor-pointer hover:bg-gray-50 table-row-alt`}
                        onClick={() => openAgent(a)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-100">
                              <FontAwesomeIcon icon={faBrain} />
                            </div>
                            <div>
                              <div className="font-medium">{a.name}</div>
                              <div className="text-xs text-gray-500 font-mono">{a.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">{a.owner}</td>

                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold">{a.score}</div>
                          <div className="text-xs text-gray-400">{risk.label}</div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">{a.scans || 0}</td>

                        <td className="px-6 py-4 text-sm text-gray-600">{a.lastScan || 'Never'}</td>

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
          <div className="lg:col-span-2 p-6 bg-gray-100 rounded-2xl ">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Risk over time</div>
                {/* Placeholder for SVG Chart */}
                <div className="h-64 w-full bg-gray-200 rounded-lg mt-4 flex items-center justify-center text-gray-500">
                    [Placeholder for complex Risk/Score trend chart visualization]
                </div>
              </div>
          </div>
          </div>
          <div className="lg:col-span-1 p-6 bg-gray-100 rounded-2xl">
            <div className="text-xs text-gray-500">Security Insights</div>
            <h3 className="text-lg font-semibold mt-1">Immediate Action Items</h3>
            <ul className="mt-4 space-y-3 text-sm">
                <li className="p-3 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                    <FontAwesomeIcon icon={faEdit} className="text-orange-500" />
                    Agent **AGNT-002** needs prompt sanitization update.
                </li>
                <li className="p-3 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-red-500" />
                    Review RAG source access for **AGNT-006** (High Risk).
                </li>
                <li className="p-3 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                    <FontAwesomeIcon icon={faHistory} className="text-sky-700" />
                    Schedule next compliance scan for all Low-Risk agents.
                </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Export Toast Notification */}
      {showingExportToast && (
        <div className="export-toast px-6 py-3 bg-gray-900 text-white rounded-xl shadow-xl flex items-center gap-3">
          <FontAwesomeIcon icon={faDownload} className="text-green-400" />
          <p className="text-sm font-medium">Export successful! `agents_export_...csv` downloaded.</p>
        </div>
      )}

      {/* Agent Detail Modal (Simulated) */}
      {selectedAgent && (
        <div 
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 bg-opacity-70 flex items-center justify-center p-4 transition-opacity duration-300"
          aria-modal="true"
          role="dialog"
          onClick={closeAgent}
        >
          <div 
            className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-auto transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FontAwesomeIcon icon={faBrain} className="text-sky-700" />
                {selectedAgent.name}
              </h2>
              <button
                onClick={closeAgent}
                className="text-gray-400 cursor-pointer hover:text-gray-700 hover:bg-gray-100 px-2.5 py-1.5 rounded-full  transition"
                aria-label="Close agent details"
              >
                <FontAwesomeIcon icon={faXmark} className="text-md" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <div className="text-xs text-gray-500 uppercase">Agent ID</div>
                    <div className="font-mono mt-1">{selectedAgent.id}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase">Owner</div>
                    <div className="mt-1 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        {selectedAgent.owner}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase">Latest Score</div>
                    <div className={`text-3xl font-bold ${getRiskColor(selectedAgent.score).text}`}>{selectedAgent.score}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase">Risk Level</div>
                    <div className={`mt-1 inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(selectedAgent.score).bg} ${getRiskColor(selectedAgent.score).text}`}>
                        {getRiskColor(selectedAgent.score).label}
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 border-t border-gray-200 pt-4">Recent Activity</h3>
            <ul className="mt-3 space-y-2 text-sm max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                <li className="flex justify-between items-center p-2 rounded-md hover:bg-white">
                    <span>Scan Completed: Prompt Injection Audit</span>
                    <span className="text-xs text-gray-500">2025-11-06</span>
                </li>
                <li className="flex justify-between items-center p-2 rounded-md hover:bg-white">
                    <span>Configuration Update: Rate limit increased</span>
                    <span className="text-xs text-gray-500">2025-11-05</span>
                </li>
                <li className="flex justify-between items-center p-2 rounded-md hover:bg-white">
                    <span>Manual Remediation Applied</span>
                    <span className="text-xs text-gray-500">2025-11-04</span>
                </li>
                {selectedAgent.id === "AGNT-002" && (
                    <li className="flex justify-between items-center p-2 rounded-md bg-red-50/50">
                        <span className="font-medium text-red-700">ALERT: High Risk Vulnerability Detected</span>
                        <span className="text-xs text-gray-500">2025-11-04</span>
                    </li>
                )}
            </ul>

            <div className="flex justify-end pt-6 gap-3">
                <button
                    onClick={() => scanNow(selectedAgent.id)}
                    className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition"
                >
                    Run New Scan
                </button>
                <Link to={`/agent/${selectedAgent.id}`}
                    className="px-4 py-2 text-sm font-semibold text-white bg-sky-700 rounded-full hover:bg-sky-800 transition flex items-center gap-2"
                >
                    Go to Full Management
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;