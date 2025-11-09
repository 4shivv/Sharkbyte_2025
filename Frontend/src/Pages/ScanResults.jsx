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
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [remediating, setRemediating] = useState(false);
  const [remediationResult, setRemediationResult] = useState(null);
  const [remediationError, setRemediationError] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

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

  // FR-4.6: Copy remediation suggestions to clipboard
  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // FR-4.7: Generate hardened prompt using Gemini API
  const handleGenerateHardenedPrompt = async () => {
    try {
      setRemediating(true);
      setRemediationError(null);
      const result = await scanAPI.remediatePrompt(scanId);
      setRemediationResult(result);
      setActiveTab('auto-fix'); // Switch to the auto-fix tab
    } catch (err) {
      console.error('Error generating hardened prompt:', err);
      setRemediationError(err.response?.data?.error || 'Failed to generate hardened prompt');
    } finally {
      setRemediating(false);
    }
  };

  // Copy hardened prompt to clipboard
  const copyHardenedPrompt = async () => {
    try {
      await navigator.clipboard.writeText(remediationResult.hardened_prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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

  // FR-4.1: Color-coded risk levels (Critical: 0-40, High: 41-60, Medium: 61-80, Low: 81-100)
  const getScoreColor = (score) => {
    if (score >= 81) return 'text-green-500';      // Low risk
    if (score >= 61) return 'text-yellow-500';     // Medium risk
    if (score >= 41) return 'text-orange-500';     // High risk
    return 'text-red-500';                         // Critical risk (0-40)
  };

  const getScoreLabel = (score) => {
    if (score >= 81) return 'Low Risk';
    if (score >= 61) return 'Medium Risk';
    if (score >= 41) return 'High Risk';
    return 'Critical Risk';
  };

  const getScoreBackground = (score) => {
    if (score >= 81) return 'bg-green-500/10 border-green-500/30';
    if (score >= 61) return 'bg-yellow-500/10 border-yellow-500/30';
    if (score >= 41) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-black to-gray-900">
        <div className="text-lg text-[#a7b8dd]">Loading scan results...</div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-black to-gray-900">
        <div className="text-lg text-red-400">{error || 'Scan not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-gray-900 text-gray-900 pt-[8%] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-[#a7b8dd] hover:text-[#6699CC] mb-4 cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold mb-2 text-[#a7b8dd]">Security Scan Results</h1>
          <p className="text-gray-300">
            Agent: {scan.agent_name} | Scanned on {new Date(scan.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Security Score Card */}
        <div className="bg-gray-200 rounded-lg p-8 mb-8 border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">Security Score</h2>
              <p className="text-gray-600">Overall security assessment of your agent's system prompt</p>
            </div>
            <div className="text-center">
              <div className={`text-7xl font-bold ${getScoreColor(scan.security_score)}`}>
                {scan.security_score}
              </div>
              <div className="text-xl text-gray-600 mt-2">{getScoreLabel(scan.security_score)}</div>
            </div>
          </div>

          {/* Score interpretation */}
          <div className={`mt-6 p-4 rounded-lg border ${getScoreBackground(scan.security_score)}`}>
            <p className="text-sm text-gray-500">
              {scan.security_score >= 81 && 'Low risk - Good security posture with explicit prohibitions and safeguards in place.'}
              {scan.security_score >= 61 && scan.security_score < 81 && 'Medium risk - Acceptable security with some gaps that should be addressed.'}
              {scan.security_score >= 41 && scan.security_score < 61 && 'High risk - Notable vulnerabilities requiring immediate attention.'}
              {scan.security_score < 41 && 'Critical risk - Severely vulnerable and easily exploitable. Immediate action required.'}
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
              <button
                onClick={() => setActiveTab('auto-fix')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'auto-fix'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Auto-Fix {remediationResult && '✓'}
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
                  <div key={index} className="bg-gray-100 rounded-lg p-6 border border-gray-300">
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
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Location</h4>
                        <p className="text-gray-900 bg-white p-2 rounded text-sm border border-gray-300">{vuln.location}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                        <p className="text-gray-900">{vuln.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Exploit Example</h4>
                        <pre className="text-gray-900 bg-white p-3 rounded text-sm overflow-x-auto border border-gray-300">{vuln.exploit_example}</pre>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600 border border-gray-300">
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
                  <div key={index} className="bg-gray-100 rounded-lg p-6 border border-gray-300">
                    <h3 className="text-xl font-semibold mb-4">{attack.attack_type}</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Attack Payload</h4>
                        <pre className="text-gray-900 bg-white p-3 rounded text-sm overflow-x-auto border border-gray-300">{attack.payload}</pre>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Expected Outcome</h4>
                        <p className="text-gray-900">{attack.expected_outcome}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Mitigation</h4>
                        <p className="text-gray-900">{attack.mitigation}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600 border border-gray-300">
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
                    <div key={index} className="bg-gray-100 rounded-lg p-6 border border-gray-300">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{step.action}</h3>
                          <span className="text-sm text-gray-600">Category: {step.category}</span>
                        </div>
                        <div className="bg-blue-900/30 border border-blue-500 text-blue-400 px-3 py-1 rounded-full text-sm">
                          Priority {step.priority}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-400">Implementation</h4>
                          <button
                            onClick={() => copyToClipboard(step.implementation, index)}
                            className="text-xs px-3 py-1 bg-[#6699CC] hover:bg-sky-800 text-black rounded-full transition-colors cursor-pointer"
                          >
                            {copiedIndex === index ? 'Copied!' : 'Copy Code'}
                          </button>
                        </div>
                        <pre className="text-gray-900 bg-white p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap border border-gray-300">{step.implementation}</pre>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600 border border-gray-300">
                  No remediation steps needed
                </div>
              )}
            </div>
          )}

          {/* Auto-Fix Tab */}
          {activeTab === 'auto-fix' && (
            <div className="space-y-6">
              {/* Generate Button Section */}
              {!remediationResult && (
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-8 border border-blue-500/30">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-3">Auto-Remediation</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Use AI to automatically generate a hardened version of your system prompt that fixes all identified vulnerabilities while preserving the original functionality.
                    </p>
                    {remediationError && (
                      <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">
                        {remediationError}
                      </div>
                    )}
                    <button
                      onClick={handleGenerateHardenedPrompt}
                      disabled={remediating || scan.status !== 'completed'}
                      className={`px-8 py-3 rounded-full font-semibold transition-all ${
                        remediating || scan.status !== 'completed'
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'bg-[#6699CC] hover:bg-sky-800 text-black cursor-pointer'
                      }`}
                    >
                      {remediating ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Generating Hardened Prompt...
                        </span>
                      ) : (
                        'Generate Hardened Prompt'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {remediationResult && (
                <div className="space-y-4">
                  {/* Summary Card */}
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-green-400">Hardened Prompt Generated</h3>
                    </div>
                    <p className="text-gray-300">
                      Successfully generated a secure version of your prompt that addresses {remediationResult.vulnerabilities_addressed} vulnerabilit{remediationResult.vulnerabilities_addressed === 1 ? 'y' : 'ies'}.
                    </p>
                  </div>

                  {/* Original Prompt */}
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-300 mb-3">Original Prompt</h4>
                    <pre className="text-white bg-gray-800 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {remediationResult.original_prompt}
                    </pre>
                  </div>

                  {/* Hardened Prompt */}
                  <div className="bg-gray-900 rounded-lg p-6 border border-green-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-green-400">Hardened Prompt (Ready to Use)</h4>
                      <button
                        onClick={copyHardenedPrompt}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                      >
                        {copiedPrompt ? 'Copied!' : 'Copy Hardened Prompt'}
                      </button>
                    </div>
                    <pre className="text-white bg-gray-800 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {remediationResult.hardened_prompt}
                    </pre>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setRemediationResult(null);
                        setRemediationError(null);
                      }}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                    >
                      Generate Again
                    </button>
                  </div>
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
