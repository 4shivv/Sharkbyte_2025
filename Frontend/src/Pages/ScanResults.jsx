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
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-gray-900 text-gray-900 pt-[8%] pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="text-[#a7b8dd] hover:text-[#6699CC] mb-6 cursor-pointer inline-flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-5xl font-bold mb-3 text-[#a7b8dd]">Security Scan Results</h1>
          <p className="text-gray-300 text-lg">
            Agent: <span className="font-semibold">{scan.agent_name}</span> • Scanned on {new Date(scan.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Security Score Card */}
        <div className="bg-gray-200 rounded-3xl p-10 mb-10 border border-gray-300 ">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Security Score</h2>
              <p className="text-gray-600 text-lg">Overall security assessment of your agent's system prompt</p>
            </div>
            <div className="text-center bg-white px-12 py-8 rounded-2xl  border border-gray-300">
              <div className={`text-8xl font-black ${getScoreColor(scan.security_score)} mb-2`}>
                {scan.security_score}
              </div>
              <div className="text-xl font-semibold text-gray-600 mt-2">{getScoreLabel(scan.security_score)}</div>
            </div>
          </div>

          {/* Score interpretation */}
          <div className={`mt-8 p-6 rounded-lg border-l-4 ${getScoreBackground(scan.security_score)} `}>
            <p className="text-base text-gray-700 leading-relaxed">
              {scan.security_score >= 81 && 'Low risk - Good security posture with explicit prohibitions and safeguards in place.'}
              {scan.security_score >= 61 && scan.security_score < 81 && 'Medium risk - Acceptable security with some gaps that should be addressed.'}
              {scan.security_score >= 41 && scan.security_score < 61 && 'High risk - Notable vulnerabilities requiring immediate attention.'}
              {scan.security_score < 41 && 'Critical risk - Severely vulnerable and easily exploitable. Immediate action required.'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-200 rounded-2xl px-2 py-1.5 mb-8 border border-gray-300 ">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all ${
                activeTab === 'vulnerabilities'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Vulnerabilities ({scan.vulnerabilities?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('attacks')}
              className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all ${
                activeTab === 'attacks'
                  ? 'bg-white text-gray-900 '
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Attack Simulations ({scan.attack_simulations?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('remediation')}
              className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all ${
                activeTab === 'remediation'
                  ? 'bg-white text-gray-900 '
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Remediation Steps ({scan.remediation_steps?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('auto-fix')}
              className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all ${
                activeTab === 'auto-fix'
                  ? 'bg-white text-gray-900 '
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Auto-Fix {remediationResult && '✓'}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {/* Vulnerabilities Tab */}
          {activeTab === 'vulnerabilities' && (
            <div className="space-y-4">
              {scan.vulnerabilities && scan.vulnerabilities.length > 0 ? (
                scan.vulnerabilities.map((vuln, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 border border-gray-300 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 text-gray-900">{vuln.type.replace(/_/g, ' ').toUpperCase()}</h3>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border-2 ${getSeverityColor(vuln.severity)}`}>
                          {vuln.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Location</h4>
                        <p className="text-gray-900 font-mono text-sm">{vuln.location}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Description</h4>
                        <p className="text-gray-900 text-base leading-relaxed">{vuln.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Exploit Example</h4>
                        <pre className="text-gray-900 bg-gray-50 p-5 rounded-xl text-sm overflow-x-auto border border-gray-200 font-mono leading-relaxed">{vuln.exploit_example}</pre>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center text-gray-600 border border-gray-300 shadow-lg">
                  <p className="text-xl font-semibold">No vulnerabilities detected</p>
                  <p className="text-gray-500 mt-2">Your agent's prompt appears secure</p>
                </div>
              )}
            </div>
          )}

          {/* Attack Simulations Tab */}
          {activeTab === 'attacks' && (
            <div className="space-y-4">
              {scan.attack_simulations && scan.attack_simulations.length > 0 ? (
                scan.attack_simulations.map((attack, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 border border-gray-300 shadow-lg hover:shadow-xl transition-shadow">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">{attack.attack_type}</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Attack Payload</h4>
                        <pre className="text-gray-900 bg-gray-50 p-5 rounded-xl text-sm overflow-x-auto border border-gray-200 font-mono leading-relaxed">{attack.payload}</pre>
                      </div>
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Expected Outcome</h4>
                        <p className="text-gray-900 text-base leading-relaxed">{attack.expected_outcome}</p>
                      </div>
                      <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500">
                        <h4 className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wide">Mitigation</h4>
                        <p className="text-gray-900 text-base leading-relaxed">{attack.mitigation}</p>
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
                    <div key={index} className="bg-white rounded-2xl p-8 border border-gray-300 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2 text-gray-900">{step.action}</h3>
                          <span className="text-sm text-gray-600 font-medium">Category: {step.category}</span>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md">
                          Priority {step.priority}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Implementation</h4>
                          <button
                            onClick={() => copyToClipboard(step.implementation, index)}
                            className="text-xs px-4 py-2 bg-[#6699CC] hover:bg-sky-800 text-black rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg font-semibold"
                          >
                            {copiedIndex === index ? '✓ Copied!' : 'Copy Code'}
                          </button>
                        </div>
                        <pre className="text-gray-900 bg-white p-5 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap border border-gray-200 font-mono leading-relaxed">{step.implementation}</pre>
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
                <div className="bg-gray-600/75 backdrop-blur-md rounded-lg p-8 border text-gray-300 border-blue-500/30">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-3">Auto-Remediation</h3>
                    <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
                      Use AI to automatically generate a hardened version of your system prompt that fixes all identified vulnerabilities while preserving the original functionality.
                    </p>
                    {remediationError && (
                      <div className="mb-6 p-5 bg-red-100 border-l-4 border-red-500 rounded-xl text-red-700 shadow-md">
                        <p className="font-semibold">{remediationError}</p>
                      </div>
                    )}
                    <button
                      onClick={handleGenerateHardenedPrompt}
                      disabled={remediating || scan.status !== 'completed'}
                      className={`px-10 py-4 rounded-full font-semibold text-md transition-all ${
                        remediating || scan.status !== 'completed'
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'bg-[#A2D1FF] hover:bg-sky-800 text-black cursor-pointer'
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
