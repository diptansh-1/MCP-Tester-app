import axios from 'axios';

export async function POST(req) {
  try {
    const body = await req.json();
    const { config, prompt } = body;
    
    if (!config) {
      return new Response(
        JSON.stringify({ error: 'Missing MCP server configuration' }), 
        { status: 400 }
      );
    }
  
    let serverUrl;
    let headers = {};
    
    // Handle different configuration methods
    if (config.installationCode) {
      try {
        const installationData = JSON.parse(atob(config.installationCode));
        serverUrl = installationData.url;
        
        if (installationData.apiKey) {
          headers.Authorization = `Bearer ${installationData.apiKey}`;
        }
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Invalid installation code format' }), 
          { status: 400 }
        );
      }
    } else if (config.serverUrl) {
      serverUrl = config.serverUrl;
      
      if (config.apiKey) {
        headers.Authorization = `Bearer ${config.apiKey}`;
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid configuration' }), 
        { status: 400 }
      );
    }
    
    const startTime = Date.now();
    
    const response = await axios({
      method: 'post',
      url: serverUrl,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      data: {
        prompt: prompt || 'Test prompt for MCP server',
        model: 'gpt-4',
        temperature: 0.7,
      },
      timeout: 30000
    });
    
    const endTime = Date.now();
    const latency = endTime - startTime;
    
    return new Response(JSON.stringify({
      connectionSuccessful: true,
      serverInfo: {
        url: serverUrl,
        protocol: 'MCP',
      },
      responseData: response.data,
      latency
    }), { status: 200 });
    
  } catch (error) {
    console.error('MCP server test error:', error);
    
    if (error.response) {
      return new Response(JSON.stringify({
        connectionSuccessful: false,
        error: `Server responded with error: ${error.response.status} ${error.response.statusText}`,
        details: error.response.data
      }), { status: error.response.status });
    } else if (error.request) {
      return new Response(JSON.stringify({
        connectionSuccessful: false,
        error: 'No response received from MCP server. Check the server URL and network connection.'
      }), { status: 500 });
    } else {
      return new Response(JSON.stringify({
        connectionSuccessful: false,
        error: `Error: ${error.message}`
      }), { status: 500 });
    }
  }
}