// src/components/MCPTester.js
"use client"
import React, { useState } from 'react';

const MCPTester = () => {
  const [serverUrl, setServerUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [installationCode, setInstallationCode] = useState('');
  const [testPrompt, setTestPrompt] = useState('What is the capital of France?');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [configMethod, setConfigMethod] = useState('manual');

  function handleSubmit(event) {
    event.preventDefault();
    setResults(null);
    
    const startTime = Date.now();
  
    const modelUrl = "https://api-inference.huggingface.co/models/google/flan-t5-base";
  
    // Updated parameters to match FLAN-T5 model requirements
    const requestBody = JSON.stringify({
      inputs: testPrompt,
      parameters: {
        max_new_tokens: 50,    // Instead of max_length
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true
      }
    });
  
    fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: requestBody
    })
      .then(async response => {
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch (error) {
          throw new Error(`Failed to parse response: ${text}`);
        }
      })
      .then(data => {
        setResults({
          connectionSuccessful: true,
          responseData: data,
          latency: Date.now() - startTime,
          serverInfo: {
            model: "Hugging Face Inference API (FLAN-T5)",
            endpoint: modelUrl
          }
        });
      })
      .catch(error => {
        setResults({
          connectionSuccessful: false,
          error: error.message,
          latency: Date.now() - startTime
        });
      });
  }

  return (
    <div className="mcp-tester">
      <div className="tester-container">
        <div className="config-method-selector">
          <button 
            className={configMethod === 'manual' ? 'active' : ''} 
            onClick={() => handleConfigMethodChange('manual')}
          >
            Manual Configuration
          </button>
          <button 
            className={configMethod === 'installation' ? 'active' : ''} 
            onClick={() => handleConfigMethodChange('installation')}
          >
            Installation Code
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {configMethod === 'manual' ? (
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="serverUrl">MCP Server URL</label>
                <input
                  id="serverUrl"
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="https://example-mcp-server.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="apiKey">API Key (if required)</label>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key (optional)"
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="installationCode">Installation Code</label>
              <input
                id="installationCode"
                type="text"
                value={installationCode}
                onChange={(e) => setInstallationCode(e.target.value)}
                placeholder="Paste installation code from Smithery"
                required
              />
              <small>Find installation codes at <a href="https://smithery.ai/" target="_blank" rel="noopener noreferrer">Smithery</a></small>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="testPrompt">Test Prompt</label>
            <textarea
              id="testPrompt"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="Enter a test prompt to send to the MCP server"
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Testing...' : 'Test MCP Server'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="results">
            <h3>Test Results</h3>
            <div className="result-section">
              <h4>Connection Status</h4>
              <p className={results.connectionSuccessful ? 'success' : 'failure'}>
                {results.connectionSuccessful ? '✅ Connected successfully' : '❌ Connection failed'}
              </p>
            </div>

            {results.serverInfo && (
              <div className="result-section">
                <h4>Server Information</h4>
                <pre>{JSON.stringify(results.serverInfo, null, 2)}</pre>
              </div>
            )}

            {results.responseData && (
              <div className="result-section">
                <h4>Response</h4>
                <pre>{JSON.stringify(results.responseData, null, 2)}</pre>
              </div>
            )}

            {results.latency !== undefined && (
              <div className="result-section">
                <h4>Latency</h4>
                <p>{results.latency}ms</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="documentation">
        <h2>How to use the MCP Tester</h2>
        <ol>
          <li>
            <strong>Select configuration method:</strong>
            <ul>
              <li><strong>Manual Configuration:</strong> Enter the MCP server URL and API key (if required)</li>
              <li><strong>Installation Code:</strong> Paste an installation code from a marketplace like <a href="https://smithery.ai/" target="_blank" rel="noopener noreferrer">Smithery</a></li>
            </ul>
          </li>
          <li><strong>Enter a test prompt:</strong> Provide a prompt to test the MCP server&apos;s functionality</li>
          <li><strong>Click &quot;Test MCP Server&quot;:</strong> The application will verify connectivity and functionality</li>
          <li><strong>Review results:</strong> Connection status, server information, and response data will be displayed</li>
        </ol>
        
        <h3>Example MCP Server</h3>
        <p>
          Try testing the sequential thinking MCP server: 
          <a href="https://smithery.ai/server/@smithery-ai/server-sequential-thinking" target="_blank" rel="noopener noreferrer">
            @smithery-ai/server-sequential-thinking
          </a>
        </p>
        
        <h3>Learn More</h3>
        <p>
          Learn more about Model Context Protocol (MCP) at 
          <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer">
            modelcontextprotocol.io
          </a>
        </p>
      </div>
    </div>
  );
};

export default MCPTester;