import React, { useState, useMemo, useRef } from "react"; // <-- ADDED useRef
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faShieldHalved,
  faBrain,
  faUser,
  faCalendar,
  faChartLine,
  faExclamationTriangle,
  faCheckCircle,
  faFilter,
  faDownload,
  faSearch,
  faArrowLeft,
  faClock,
  faEdit,
  faTrash,
  faTimes,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

// Mock historical data (Kept for completeness)
const MOCK_HISTORY = [
  {
    id: "SCAN-001",
    agentId: "AGNT-001",
    agentName: "RFP Grant Writer",
    owner: "Alice Johnson",
    action: "Security Scan",
    timestamp: "2025-11-08T14:30:00",
    status: "completed",
    scoreBefore: 72,
    scoreAfter: 85,
    vulnerabilitiesFound: 3,
    vulnerabilitiesFixed: 3,
    scanDuration: 8.2,
    details: "Detected instruction hierarchy weakness, privilege escalation vector, and data leakage risk. All issues remediated.",
  },
  {
    id: "REG-001",
    agentId: "AGNT-001",
    agentName: "RFP Grant Writer",
    owner: "Alice Johnson",
    action: "Agent Registered",
    timestamp: "2025-11-05T09:15:00",
    status: "completed",
    initialScore: 72,
    details: "New agent registered with initial security baseline scan.",
  },
  {
    id: "SCAN-002",
    agentId: "AGNT-002",
    agentName: "Customer Service Bot",
    owner: "Bob Smith",
    action: "Security Scan",
    timestamp: "2025-11-07T16:45:00",
    status: "failed",
    error: "Gemini API timeout after 30 seconds",
    retryCount: 3,
    details: "Scan failed due to API timeout. System attempted 3 retries with exponential backoff.",
  },
  {
    id: "EDIT-001",
    agentId: "AGNT-003",
    agentName: "Internal QA Agent",
    owner: "Charlie Bell",
    action: "Agent Updated",
    timestamp: "2025-11-06T11:20:00",
    status: "completed",
    changedFields: ["system_prompt", "description"],
    details: "System prompt updated to include stricter input validation. Description clarified for scope boundaries.",
  },
  {
    id: "SCAN-003",
    agentId: "AGNT-004",
    agentName: "Log Analyzer",
    owner: "Devin Clark",
    action: "Security Scan",
    timestamp: "2025-11-08T10:15:00",
    status: "completed",
    scoreBefore: 88,
    scoreAfter: 92,
    vulnerabilitiesFound: 1,
    vulnerabilitiesFixed: 1,
    scanDuration: 6.8,
    details: "Minor delimiter injection pattern detected and resolved. Agent now maintains strong instruction boundaries.",
  },
  {
    id: "SCAN-004",
    agentId: "AGNT-005",
    agentName: "Fraud Detector",
    owner: "Eve Lopez",
    action: "Security Scan",
    timestamp: "2025-11-07T08:30:00",
    status: "completed",
    scoreBefore: 65,
    scoreAfter: 72,
    vulnerabilitiesFound: 5,
    vulnerabilitiesFixed: 4,
    scanDuration: 9.5,
    details: "Multiple role-switching attempts detected. Applied containment rules and explicit prohibitions.",
  },
  {
    id: "REG-002",
    agentId: "AGNT-006",
    agentName: "Analytics Reporter",
    owner: "Frank Wu",
    action: "Agent Registered",
    timestamp: "2025-11-04T14:00:00",
    status: "completed",
    initialScore: 48,
    details: "Critical risk level at registration. Immediate hardening recommended and scheduled.",
  },
  {
    id: "SCAN-005",
    agentId: "AGNT-007",
    agentName: "Scheduler Agent",
    owner: "Grace Park",
    action: "Security Scan",
    timestamp: "2025-11-08T13:00:00",
    status: "completed",
    scoreBefore: 94,
    scoreAfter: 96,
    vulnerabilitiesFound: 1,
    vulnerabilitiesFixed: 1,
    scanDuration: 5.2,
    details: "Minor optimization applied to input validation layer. Agent maintains excellent security posture.",
  },
  {
    id: "EDIT-002",
    agentId: "AGNT-002",
    agentName: "Customer Service Bot",
    owner: "Bob Smith",
    action: "Owner Reassigned",
    timestamp: "2025-11-03T16:30:00",
    status: "completed",
    oldOwner: "John Doe",
    newOwner: "Bob Smith",
    details: "Ownership transferred as part of team reorganization. All access controls updated accordingly.",
  },
  {
    id: "SCAN-006",
    agentId: "AGNT-008",
    agentName: "Sentiment Miner",
    owner: "Hector Alvarez",
    action: "Security Scan",
    timestamp: "2025-11-02T14:20:00",
    status: "completed",
    scoreBefore: 58,
    scoreAfter: 61,
    vulnerabilitiesFound: 6,
    vulnerabilitiesFixed: 3,
    scanDuration: 11.3,
    details: "Complex encoded payload attempts detected. Partial remediation applied; full fix scheduled for next iteration.",
  },
];

const getActionColor = (action) => {
  if (action.includes("Scan")) return { text: "text-blue-600", bg: "bg-blue-50", icon: faShieldHalved };
  if (action.includes("Registered")) return { text: "text-green-600", bg: "bg-green-50", icon: faCheckCircle };
  if (action.includes("Updated") || action.includes("Reassigned")) return { text: "text-yellow-600", bg: "bg-yellow-50", icon: faEdit };
  return { text: "text-gray-600", bg: "bg-gray-50", icon: faHistory };
};

const getStatusBadge = (status) => {
  if (status === "completed") return { text: "text-green-700", bg: "bg-green-100", label: "Completed" };
  if (status === "failed") return { text: "text-red-700", bg: "bg-red-100", label: "Failed" };
  if (status === "pending") return { text: "text-yellow-700", bg: "bg-yellow-100", label: "Pending" };
  return { text: "text-gray-700", bg: "bg-gray-100", label: "Unknown" };
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const AgentHistory = () => {
  const [history] = useState(MOCK_HISTORY);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showingExportToast, setShowingExportToast] = useState(false); // Kept here as state
  const exportTimer = useRef(null); // <-- ADDED useRef initialization for the timer

  // Filter and search logic
  const visibleHistory = useMemo(() => {
    let filtered = history.filter((item) => {
      // Action filter
      if (filterAction !== "all" && !item.action.toLowerCase().includes(filterAction)) return false;

      // Status filter
      if (filterStatus !== "all" && item.status !== filterStatus) return false;

      // Date filter
      if (filterDate !== "all") {
        const itemDate = new Date(item.timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - itemDate) / 86400000);

        if (filterDate === "today" && diffDays !== 0) return false;
        if (filterDate === "week" && diffDays > 7) return false;
        if (filterDate === "month" && diffDays > 30) return false;
      }

      // Search filter
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          item.agentName.toLowerCase().includes(q) ||
          item.owner.toLowerCase().includes(q) ||
          item.agentId.toLowerCase().includes(q) ||
          item.action.toLowerCase().includes(q)
        );
      }

      return true;
    });

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [history, searchTerm, filterAction, filterStatus, filterDate]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalScans = history.filter(h => h.action.includes("Scan") && h.status === "completed").length;
    const scansWithScores = history.filter(h => h.scoreAfter && h.scoreBefore);
    const avgImprovement = scansWithScores.length > 0
      ? scansWithScores.reduce((sum, h) => sum + (h.scoreAfter - h.scoreBefore), 0) / scansWithScores.length
      : 0;
    const totalVulnerabilities = history
      .filter(h => h.vulnerabilitiesFound)
      .reduce((sum, h) => sum + h.vulnerabilitiesFound, 0);
    const failedScans = history.filter(h => h.action.includes("Scan") && h.status === "failed").length;

    return {
      totalScans,
      avgImprovement: avgImprovement.toFixed(1),
      totalVulnerabilities,
      failedScans,
    };
  }, [history]);

  // FIX: Added exportTimer.current check and cleanup
  const exportHistory = () => {
    const header = "id,agentId,agentName,owner,action,timestamp,status\n";
    const rows = visibleHistory.map((h) =>
      `${h.id},${h.agentId},${h.agentName},${h.owner},${h.action},${h.timestamp},${h.status}`
    ).join("\n");
    const csv = header + rows;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `agentguard_history_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    setShowingExportToast(true);
    // Clear any previous timer before setting a new one
    if (exportTimer.current) {
      clearTimeout(exportTimer.current);
    }
    exportTimer.current = setTimeout(() => setShowingExportToast(false), 3500);
  };

  // FIX: Removed redundant useState declaration for showingExportToast


  return (
    <div className="min-h-[95%] mt-[5%] bg-gradient-to-b from-white via-white to-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FontAwesomeIcon icon={faHistory} className="text-sky-700" />
                Activity History
              </h1>
              <p className="text-sm text-gray-600 mt-1">Track all agent operations, scans, and modifications</p>
            </div>

            <button
              onClick={exportHistory}
              className="px-4 py-2 bg-sky-700 rounded-full text-white cursor-pointer text-sm hover:bg-sky-800 transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faDownload} />
              Export History
            </button>
          </div>
        </div>
      </header>

      {/* Statistics (Kept as is) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 uppercase">Total Scans</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalScans}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faShieldHalved} className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">Completed security audits</div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 uppercase">Avg Improvement</div>
                <div className="text-3xl font-bold text-green-600 mt-2">+{stats.avgImprovement}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">Score increase per scan</div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 uppercase">Vulnerabilities Found</div>
                <div className="text-3xl font-bold text-orange-600 mt-2">{stats.totalVulnerabilities}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-600 text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">Security issues detected</div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 uppercase">Failed Scans</div>
                <div className="text-3xl font-bold text-red-600 mt-2">{stats.failedScans}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">Requires attention</div>
          </div>
        </div>
      </section>

      {/* Filters (Kept as is) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-3 flex-1 w-full">
              <div className="px-3 py-2 rounded-lg bg-gray-100">
                <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
              </div>
              <input
                className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-500"
                placeholder="Search by agent, owner, or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-gray-500 text-sm" />
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm"
                >
                  <option value="all">All Actions</option>
                  <option value="scan">Security Scans</option>
                  <option value="registered">Registrations</option>
                  <option value="updated">Updates</option>
                </select>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Showing {visibleHistory.length} of {history.length} activities
          </div>
        </div>
      </section>

      {/* Timeline (Kept as is) */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {visibleHistory.length ? (
            <div className="divide-y divide-gray-100">
              {visibleHistory.map((item) => {
                const actionStyle = getActionColor(item.action);
                const statusBadge = getStatusBadge(item.status);

                return (
                  <article
                    key={item.id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full ${actionStyle.bg} flex items-center justify-center flex-shrink-0`}>
                        <FontAwesomeIcon icon={actionStyle.icon} className={`${actionStyle.text} text-lg`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900">{item.action}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 flex-wrap">
                              <span className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faBrain} className="text-gray-400" />
                                {item.agentName}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                                {item.owner}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="font-mono text-xs">{item.agentId}</span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                              {statusBadge.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-2 flex items-center gap-2 justify-end">
                              <FontAwesomeIcon icon={faClock} />
                              {formatTimestamp(item.timestamp)}
                            </div>
                          </div>
                        </div>

                        {/* Details based on action type */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {item.scoreBefore !== undefined && (
                            <>
                              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-xs text-gray-500">Before</div>
                                <div className="text-xl font-bold text-gray-900 mt-1">{item.scoreBefore}</div>
                              </div>
                              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-xs text-gray-500">After</div>
                                <div className="text-xl font-bold text-green-600 mt-1">{item.scoreAfter}</div>
                              </div>
                              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-xs text-gray-500">Improvement</div>
                                <div className="text-xl font-bold text-green-600 mt-1">+{item.scoreAfter - item.scoreBefore}</div>
                              </div>
                              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="text-xs text-gray-500">Vulnerabilities</div>
                                <div className="text-xl font-bold text-orange-600 mt-1">{item.vulnerabilitiesFound}</div>
                              </div>
                            </>
                          )}

                          {item.initialScore !== undefined && (
                            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500">Initial Score</div>
                              <div className="text-xl font-bold text-gray-900 mt-1">{item.initialScore}</div>
                            </div>
                          )}

                          {item.scanDuration && (
                            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500">Duration</div>
                              <div className="text-lg font-bold text-gray-900 mt-1">{item.scanDuration}s</div>
                            </div>
                          )}
                        </div>

                        {item.error && (
                          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                            <div className="text-xs text-red-600 font-semibold">Error Details</div>
                            <div className="text-sm text-red-900 mt-1">{item.error}</div>
                            {item.retryCount && (
                              <div className="text-xs text-red-700 mt-1">Retried {item.retryCount} times</div>
                            )}
                          </div>
                        )}

                        {item.changedFields && (
                          <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                            <div className="text-xs text-yellow-600 font-semibold">Modified Fields</div>
                            <div className="text-sm text-yellow-900 mt-1">
                              {item.changedFields.join(", ")}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center">
              <FontAwesomeIcon icon={faHistory} className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">No activities found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal (Kept as is) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={() => setSelectedItem(null)}>
          <div className="relative max-w-3xl w-full bg-white rounded-2xl p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 w-10 h-10 cursor-pointer rounded-full  hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-16 rounded-full ${getActionColor(selectedItem.action).bg} flex items-center justify-center`}>
                <FontAwesomeIcon icon={getActionColor(selectedItem.action).icon} className={`${getActionColor(selectedItem.action).text} text-2xl`} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{selectedItem.action}</h2>
                <div className="text-sm text-gray-600 mt-1">{new Date(selectedItem.timestamp).toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="text-xs text-gray-500 uppercase">Agent</div>
                <div className="text-lg font-semibold mt-1">{selectedItem.agentName}</div>
                <div className="text-xs text-gray-500 font-mono mt-1">{selectedItem.agentId}</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="text-xs text-gray-500 uppercase">Owner</div>
                <div className="text-lg font-semibold mt-1">{selectedItem.owner}</div>
              </div>
            </div>

            {selectedItem.details && (
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-900 mb-2">Details</div>
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-700">
                  {selectedItem.details}
                </div>
              </div>
            )}

            {selectedItem.scoreBefore !== undefined && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-center">
                  <div className="text-xs text-gray-500">Before</div>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{selectedItem.scoreBefore}</div>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-center">
                  <div className="text-xs text-green-600">After</div>
                  <div className="text-3xl font-bold text-green-600 mt-2">{selectedItem.scoreAfter}</div>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-center">
                  <div className="text-xs text-blue-600">Improvement</div>
                  <div className="text-3xl font-bold text-blue-600 mt-2">+{selectedItem.scoreAfter - selectedItem.scoreBefore}</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3">

              <button className="px-4 ml-auto text-sm py-1.5 rounded-full font-medium  cursor-pointer border border-gray-300 hover:bg-gray-50 transition-colors">
                View Agent Details
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer bg-gray-900 text-white hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer (Kept as is) */}
      <footer className="mt-20 border-t border-gray-200 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between text-sm text-gray-500 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldHalved} />
              <span>AgentGuard © {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="hover:text-gray-900 transition-colors">Documentation</button>
              <button className="hover:text-gray-900 transition-colors">Support</button>
              <button className="hover:text-gray-900 transition-colors">Status</button>
            </div>
          </div>
        </div>
      </footer>
      {/* FIX: Applied Tailwind classes for toast positioning */}
      {showingExportToast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-gray-900 text-white rounded-xl shadow-xl flex items-center gap-3 transition-opacity duration-300 ease-out"
        >
          <FontAwesomeIcon icon={faDownload} className="text-green-400" />
          <p className="text-sm font-medium">Export successful! `agentguard_history_...csv` downloaded.</p>
        </div>
      )}
    </div>
  );
};

export default AgentHistory;