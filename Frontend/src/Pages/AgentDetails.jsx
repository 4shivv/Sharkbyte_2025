import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { agentAPI, scanAPI } from '../services/api';

const AgentDetails = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanningStatus, setScanningStatus] = useState(null);
  const [error, setError] = useState(null);

  // Fetch agent details and scan history on component mount
  useEffect(() => {
    fetchAgentDetails();
    fetchAgentScans();
  }, [agentId]);

  const fetchAgentDetails = async () => {
    try {
      setLoading(true);
      const data = await agentAPI.getById(agentId);
      setAgent(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching agent:', err);
      setError('Failed to load agent details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentScans = async () => {
    try {
      const data = await scanAPI.getAgentScans(agentId);
      setScans(data);
    } catch (err) {
      console.error('Error fetching scans:', err);
    }
  };

  // FR-3.1: Initiate security scan
  const handleStartScan = async () => {
    if (!agent?.system_prompt) {
      alert('This agent has no system prompt to scan');
      return;
    }

    try {
      setScanningStatus('initiating');
      setError(null);

      // Initiate the scan
      const response = await scanAPI.initiateScan(agentId);
      const { scanId } = response;

      setScanningStatus('polling');

      // Start polling for scan results
      pollScanResult(scanId);
    } catch (err) {
      console.error('Error initiating scan:', err);
      setError('Failed to start security scan');
      setScanningStatus(null);
    }
  };

  // FR-3.8: Poll for scan results until complete
  const pollScanResult = async (scanId) => {
    const pollInterval = 2000; // Poll every 2 seconds
    const maxAttempts = 60; // Max 2 minutes (60 * 2s)
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        const scan = await scanAPI.getScanResult(scanId);

        if (scan.status === 'completed') {
          // Scan completed successfully
          setScanningStatus(null);
          navigate(`/scans/${scanId}`);
        } else if (scan.status === 'failed') {
          // Scan failed
          setScanningStatus(null);
          setError(`Scan failed: ${scan.error_message || 'Unknown error'}`);
          await fetchAgentScans(); // Refresh scan list
        } else if (attempts >= maxAttempts) {
          // Timeout
          setScanningStatus(null);
          setError('Scan timed out. Please try again.');
        } else {
          // Still pending/processing, continue polling
          setTimeout(poll, pollInterval);
        }
      } catch (err) {
        console.error('Error polling scan result:', err);
        setScanningStatus(null);
        setError('Error checking scan status');
      }
    };

    poll();
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-black to-gray-900">
        <div className="text-lg text-[#a7b8dd]">Loading agent details...</div>
      </div>
    );
  }

  if (error && !agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-black to-gray-900">
        <div className="text-lg text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-gray-900 text-gray-900 pt-[8%] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/agent-dashboard')}
            className="text-[#a7b8dd] hover:text-[#6699CC] mb-4 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold mb-2 text-[#a7b8dd]">{agent?.agent_name}</h1>
          <p className="text-gray-300">Owner: {agent?.owner}</p>
        </div>

        {/* Agent Details Card */}
        <div className="bg-gray-200 rounded-lg p-6 mb-8 border border-gray-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Agent Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-600 text-sm">Description</label>
              <p className="text-gray-900">{agent?.description || 'No description provided'}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">System Prompt</label>
              <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-x-auto border border-gray-300 text-gray-900">
                {agent?.system_prompt || 'No system prompt configured'}
              </pre>
            </div>
          </div>
        </div>

        {/* Security Scan Section */}
        <div className="bg-gray-200 rounded-lg p-6 mb-8 border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Security Scanning</h2>
            <button
              onClick={handleStartScan}
              disabled={scanningStatus !== null || !agent?.system_prompt}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                scanningStatus !== null || !agent?.system_prompt
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-[#6699CC] hover:bg-sky-800 text-black cursor-pointer'
              }`}
            >
              {scanningStatus === 'initiating' && 'Initiating Scan...'}
              {scanningStatus === 'polling' && 'Scan in Progress...'}
              {scanningStatus === null && 'Start Security Scan'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {scanningStatus === 'polling' && (
            <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing system prompt for security vulnerabilities...
              </div>
            </div>
          )}

          {/* Scan History */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-gray-900">Scan History</h3>
              {scans.length > 0 && (
                <button
                  onClick={() => navigate(`/agents/${agentId}/history`)}
                  className="px-4 py-2 bg-[#6699CC] hover:bg-sky-800 rounded-full text-sm font-medium transition-colors text-black cursor-pointer"
                >
                  View Full History
                </button>
              )}
            </div>
            {scans.length === 0 ? (
              <p className="text-gray-600">No scans performed yet</p>
            ) : (
              <div className="space-y-3">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    onClick={() => scan.status === 'completed' && navigate(`/scans/${scan.id}`)}
                    className={`bg-gray-100 p-4 rounded-lg border border-gray-300 ${
                      scan.status === 'completed' ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(scan.status)}`}>
                          {scan.status.toUpperCase()}
                        </span>
                        <span className="ml-4 text-gray-600 text-sm">
                          {new Date(scan.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {scan.security_score !== null && (
                        <div className="text-2xl font-bold text-gray-900">
                          Score: <span className={scan.security_score >= 70 ? 'text-green-600' : scan.security_score >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                            {scan.security_score}/100
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
