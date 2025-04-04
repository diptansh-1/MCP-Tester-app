import MCPTester from '../components/MCPTester';

export default function Home() {
  return (
    <div className="App">
    <header className="App-header">
      <h1>MCP Server Tester</h1>
      <p className="description">
        Test Model Context Protocol (MCP) servers by providing server configuration details
      </p>
    </header>
    <main>
      <MCPTester />
    </main>
    <footer>
      <p>MCP Tester - Built for testing Model Context Protocol servers</p>
      <p><a href="https://github.com/yourusername/mcp-tester" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
    </footer>
  </div>
  );
}
