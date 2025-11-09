import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scanAPI } from '../services/api';

const ScanResults = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('vulnerabilities');

  useEffect(() => {
    fetchScanResult();
  }, [scanId]);

  const fetchScanResult = async () => {
    try {
      setLoading(true);
      const data = await scanAPI.getScanResult(scanId);
      setScan(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching scan result:', err);
      setError('Failed to load scan results');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Moderate';
    if (score >= 30) return 'Poor';
    return 'Critical';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-lg text-white">Loading scan results...</div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-lg text-red-500">{error || 'Scan not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:text-blue-300 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold mb-2">Security Scan Results</h1>
          <p className="text-gray-400">
            Agent: {scan.agent_name} | Scanned on {new Date(scan.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Security Score Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 mb-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Security Score</h2>
              <p className="text-gray-400">Overall security assessment of your agent's system prompt</p>
            </div>
            <div className="text-center">
              <div className={`text-7xl font-bold ${getScoreColor(scan.security_score)}`}>
                {scan.security_score}
              </div>
              <div className="text-xl text-gray-400 mt-2">{getScoreLabel(scan.security_score)}</div>
            </div>
          </div>

          {/* Score interpretation */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-300">
              {scan.security_score >= 90 && 'Excellent security posture with explicit prohibitions and safeguards in place.'}
              {scan.security_score >= 70 && scan.security_score < 90 && 'Good security with minor gaps that should be addressed.'}
              {scan.security_score >= 50 && scan.security_score < 70 && 'Moderate security with notable vulnerabilities requiring attention.'}
              {scan.security_score >= 30 && scan.security_score < 50 && 'Poor security with critical flaws that need immediate remediation.'}
              {scan.security_score < 30 && 'Severely vulnerable and easily exploitable. Immediate action required.'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('vulnerabilities')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'vulnerabilities'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Vulnerabilities ({scan.vulnerabilities?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('attacks')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'attacks'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Attack Simulations ({scan.attack_simulations?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('remediation')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'remediation'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Remediation Steps ({scan.remediation_steps?.length || 0})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Vulnerabilities Tab */}
          {activeTab === 'vulnerabilities' && (
            <div className="space-y-4">
              {scan.vulnerabilities && scan.vulnerabilities.length > 0 ? (
                scan.vulnerabilities.map((vuln, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{vuln.type.replace(/_/g, ' ').toUpperCase()}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getSeverityColor(vuln.severity)}`}>
                          {vuln.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Location</h4>
                        <p className="text-white bg-gray-800 p-2 rounded text-sm">{vuln.location}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Description</h4>
                        <p className="text-white">{vuln.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Exploit Example</h4>
                        <pre className="text-white bg-gray-800 p-3 rounded text-sm overflow-x-auto">{vuln.exploit_example}</pre>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">
                  No vulnerabilities detected
                </div>
              )}
            </div>
          )}

          {/* Attack Simulations Tab */}
          {activeTab === 'attacks' && (
            <div className="space-y-4">
              {scan.attack_simulations && scan.attack_simulations.length > 0 ? (
                scan.attack_simulations.map((attack, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">{attack.attack_type}</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Attack Payload</h4>
                        <pre className="text-white bg-gray-800 p-3 rounded text-sm overflow-x-auto">{attack.payload}</pre>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Expected Outcome</h4>
                        <p className="text-white">{attack.expected_outcome}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Mitigation</h4>
                        <p className="text-white">{attack.mitigation}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">
                  No attack simulations available
                </div>
              )}
            </div>
          )}

          {/* Remediation Steps Tab */}
          {activeTab === 'remediation' && (
            <div className="space-y-4">
              {scan.remediation_steps && scan.remediation_steps.length > 0 ? (
                scan.remediation_steps
                  .sort((a, b) => a.priority - b.priority)
                  .map((step, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{step.action}</h3>
                          <span className="text-sm text-gray-400">Category: {step.category}</span>
                        </div>
                        <div className="bg-blue-900/30 border border-blue-500 text-blue-400 px-3 py-1 rounded-full text-sm">
                          Priority {step.priority}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Implementation</h4>
                        <pre className="text-white bg-gray-800 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">{step.implementation}</pre>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">
                  No remediation steps needed
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanResults;
