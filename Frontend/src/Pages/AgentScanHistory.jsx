import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHistory,
  faShieldHalved,
  faChartLine,
  faExclamationTriangle,
  faArrowLeft,
  faClock,
  faCodeCompare,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { scanAPI, agentAPI } from '../services/api';
import DiffViewerModal from '../components/DiffViewerModal';

/**
 * FR-5.1, FR-5.2, FR-5.3, FR-5.4: Agent Scan History Page
 * Displays historical scans, timeline visualization, score deltas, and prompt comparison
 */
const AgentScanHistory = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComparison, setSelectedComparison] = useState(null);

  // FR-5.1: Fetch agent and scan history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch agent details
        const agentData = await agentAPI.getById(agentId);
        setAgent(agentData);

        // Fetch scan history
        const scansData = await scanAPI.getAgentScans(agentId);
        setScans(scansData);
      } catch (err) {
        console.error('Error fetching scan history:', err);
        setError(err.response?.data?.error || 'Failed to load scan history');
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchData();
    }
  }, [agentId]);

  // FR-5.2: Prepare data for timeline visualization
  const chartData = useMemo(() => {
    return scans
      .filter(scan => scan.status === 'completed' && scan.security_score !== null)
      .map(scan => ({
        date: new Date(scan.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        score: scan.security_score,
        fullDate: scan.createdAt,
      }));
  }, [scans]);

  // FR-5.3: Calculate statistics and deltas
  const stats = useMemo(() => {
    const completedScans = scans.filter(s => s.status === 'completed');
    const scansWithScores = completedScans.filter(s => s.security_score !== null);

    let totalImprovement = 0;
    let improvementCount = 0;

    for (let i = 1; i < scansWithScores.length; i++) {
      const delta = scansWithScores[i].security_score - scansWithScores[i - 1].security_score;
      totalImprovement += delta;
      improvementCount++;
    }

    const avgImprovement = improvementCount > 0 ? totalImprovement / improvementCount : 0;

    const totalVulnerabilities = completedScans.reduce(
      (sum, scan) => sum + (Array.isArray(scan.vulnerabilities) ? scan.vulnerabilities.length : 0),
      0
    );

    const failedScans = scans.filter(s => s.status === 'failed').length;

    const latestScore = scansWithScores.length > 0
      ? scansWithScores[scansWithScores.length - 1].security_score
      : null;

    return {
      totalScans: completedScans.length,
      avgImprovement: avgImprovement.toFixed(1),
      totalVulnerabilities,
      failedScans,
      latestScore,
    };
  }, [scans]);

  // FR-5.3: Calculate delta for each scan
  const scansWithDeltas = useMemo(() => {
    const completed = scans.filter(s => s.status === 'completed' && s.security_score !== null);
    return completed.map((scan, index) => {
      const delta = index > 0 ? scan.security_score - completed[index - 1].security_score : null;
      return { ...scan, delta, previousScan: index > 0 ? completed[index - 1] : null };
    });
  }, [scans]);

  // FR-5.4: Open diff viewer modal
  const handleCompare = (scan) => {
    if (scan.previousScan) {
      setSelectedComparison({
        oldPrompt: scan.previousScan.prompt_snapshot,
        newPrompt: scan.prompt_snapshot,
        oldScanDate: scan.previousScan.createdAt,
        newScanDate: scan.createdAt,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-gray-900 flex items-center justify-center pt-[8%]">
        <div className="text-[#a7b8dd] text-lg">Loading scan history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-gray-900 flex items-center justify-center pt-[8%]">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-[#6699CC] rounded-full text-black hover:bg-sky-800 transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[95%] bg-gradient-to-b from-black via-black to-gray-900 text-gray-900 pt-[8%]">
      {/* Header */}
      <header className="bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(`/agents/${agentId}`)}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#a7b8dd] flex items-center gap-3">
                <FontAwesomeIcon icon={faHistory} className="text-[#6699CC]" />
                Scan History
              </h1>
              {agent && (
                <p className="text-sm text-gray-300 mt-1">
                  {agent.agent_name} - Tracking security posture evolution over time
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Statistics */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-gray-200 rounded-2xl border border-gray-200">
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

          <div className="p-6 bg-gray-200 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 uppercase">Latest Score</div>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.latestScore !== null ? stats.latestScore : 'N/A'}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">Current security score</div>
          </div>

          <div className="p-6 bg-gray-200 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 uppercase">Avg Improvement</div>
                <div className={`text-3xl font-bold mt-2 ${parseFloat(stats.avgImprovement) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(stats.avgImprovement) >= 0 ? '+' : ''}{stats.avgImprovement}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">Score change per scan</div>
          </div>

          <div className="p-6 bg-gray-200 rounded-2xl border border-gray-200">
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
        </div>
      </section>

      {/* FR-5.2: Timeline Chart Visualization */}
      {chartData.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="bg-gray-200 rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Security Score Timeline</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6699CC" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6699CC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis domain={[0, 100]} stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6699CC"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* FR-5.1, FR-5.3: Scan History Table */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-gray-200 rounded-2xl border border-gray-200 overflow-hidden">
          {scansWithDeltas.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {scansWithDeltas.map((scan, index) => {
                const vulnCount = Array.isArray(scan.vulnerabilities) ? scan.vulnerabilities.length : 0;

                return (
                  <article key={scan.id} className="p-6 hover:bg-gray-100/70 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-blue-600 text-lg" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Security Scan #{scansWithDeltas.length - index}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 flex-wrap">
                              <span className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                                {new Date(scan.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              Completed
                            </div>
                          </div>
                        </div>

                        {/* FR-5.3: Score Metrics with Delta */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                            <div className="text-xs text-gray-500">Security Score</div>
                            <div className="text-xl font-bold text-blue-600 mt-1">{scan.security_score}</div>
                          </div>

                          {/* FR-5.3: Display Delta */}
                          {scan.delta !== null && (
                            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="text-xs text-gray-500">Change</div>
                              <div
                                className={`text-xl font-bold mt-1 ${
                                  scan.delta > 0
                                    ? 'text-green-600'
                                    : scan.delta < 0
                                    ? 'text-red-600'
                                    : 'text-gray-600'
                                }`}
                              >
                                {scan.delta > 0 ? '+' : ''}
                                {scan.delta}
                              </div>
                            </div>
                          )}

                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                            <div className="text-xs text-gray-500">Vulnerabilities</div>
                            <div className="text-xl font-bold text-orange-600 mt-1">{vulnCount}</div>
                          </div>

                          {/* FR-5.4: Compare Button */}
                          {scan.previousScan && scan.prompt_snapshot && scan.previousScan.prompt_snapshot && (
                            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                              <button
                                onClick={() => handleCompare(scan)}
                                className="px-3 py-1.5 bg-[#6699CC] hover:bg-sky-800 rounded-full text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-2"
                              >
                                <FontAwesomeIcon icon={faCodeCompare} />
                                Compare
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center">
              <FontAwesomeIcon icon={faHistory} className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">No scan history yet</h3>
              <p className="text-gray-600 mt-2">
                Run your first security scan to start tracking improvements
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
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

      {/* FR-5.4: Diff Viewer Modal */}
      {selectedComparison && (
        <DiffViewerModal
          isOpen={!!selectedComparison}
          onClose={() => setSelectedComparison(null)}
          oldPrompt={selectedComparison.oldPrompt}
          newPrompt={selectedComparison.newPrompt}
          oldScanDate={selectedComparison.oldScanDate}
          newScanDate={selectedComparison.newScanDate}
        />
      )}
    </div>
  );
};

export default AgentScanHistory;
