/**
 * AgentGuard Security Pre-Check Worker
 * Powered by Cloudflare Workers AI
 *
 * This worker provides instant security risk assessment for AI agent prompts
 * using Llama model at the edge for fast responses.
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
      // Parse request body
      const { systemPrompt } = await request.json();

      if (!systemPrompt || systemPrompt.trim().length === 0) {
        return jsonResponse({ error: 'systemPrompt is required' }, 400);
      }

      // Build security analysis prompt for Llama
      const analysisPrompt = buildSecurityPrompt(systemPrompt);

      // Call Cloudflare Workers AI - Llama model
      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          {
            role: 'system',
            content: 'You are a security expert analyzing AI agent system prompts for vulnerabilities. Provide concise, actionable security assessments.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      // Parse AI response
      const aiAnalysis = response.response || '';

      // Extract risk level and explanation
      const result = parseSecurityResponse(aiAnalysis, systemPrompt);

      // Return result with CORS headers
      return jsonResponse(result, 200);

    } catch (error) {
      console.error('Pre-check error:', error);
      return jsonResponse({
        error: 'Failed to analyze prompt',
        details: error.message
      }, 500);
    }
  }
};

/**
 * Build security analysis prompt for Llama model
 */
function buildSecurityPrompt(systemPrompt) {
  return `Analyze this AI agent system prompt for security vulnerabilities.

SYSTEM PROMPT TO ANALYZE:
"""
${systemPrompt}
"""

Evaluate for these critical security risks:
1. Prompt Injection - Can users override instructions?
2. Data Leakage - Does it expose sensitive information?
3. Privilege Escalation - Can users gain unauthorized access?
4. Missing Input Validation - Are user inputs properly sanitized?

Respond in this EXACT format:
RISK_LEVEL: [LOW/MEDIUM/HIGH]
REASON: [2-3 sentence explanation of the main security concern or why it's secure]
TOP_CONCERN: [single biggest vulnerability or "None identified"]

Keep response concise and actionable.`;
}

/**
 * Parse Llama response into structured format
 */
function parseSecurityResponse(aiResponse, originalPrompt) {
  const result = {
    riskLevel: 'MEDIUM', // default
    reason: '',
    topConcern: '',
    analyzedAt: new Date().toISOString(),
    promptLength: originalPrompt.length,
    model: 'llama-3.1-8b-instruct',
    provider: 'cloudflare-workers-ai'
  };

  try {
    // Extract RISK_LEVEL
    const riskMatch = aiResponse.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)/i);
    if (riskMatch) {
      result.riskLevel = riskMatch[1].toUpperCase();
    }

    // Extract REASON
    const reasonMatch = aiResponse.match(/REASON:\s*(.+?)(?=TOP_CONCERN:|$)/is);
    if (reasonMatch) {
      result.reason = reasonMatch[1].trim();
    }

    // Extract TOP_CONCERN
    const concernMatch = aiResponse.match(/TOP_CONCERN:\s*(.+?)$/is);
    if (concernMatch) {
      result.topConcern = concernMatch[1].trim();
    }

    // Fallback if parsing fails
    if (!result.reason) {
      result.reason = aiResponse.substring(0, 200);
    }

  } catch (parseError) {
    console.error('Parse error:', parseError);
    result.reason = 'Analysis completed but response format was unexpected.';
    result.topConcern = 'Review full scan for details';
  }

  return result;
}

/**
 * Handle CORS preflight requests
 */
function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  });
}

/**
 * Return JSON response with CORS headers
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
