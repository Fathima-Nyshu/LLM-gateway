import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

function UsageLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsage() {
      const apiKey = localStorage.getItem('apiKey');

      try {
        const res = await fetch('http://localhost:3000/v1/usage', {
          headers: { 'x-api-key': apiKey },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to load usage logs.');
          return;
        }

        setLogs(data.logs.reverse());
      } catch (err) {
        setError('Could not connect to the server.');
      }
    }

    fetchUsage();
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-text mb-6">Usage Logs</h2>

      {error && <p className="text-error text-sm">{error}</p>}

      {logs.length === 0 && !error && (
        <p className="text-text-muted text-sm">No requests yet.</p>
      )}

      {logs.length > 0 && (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase">
                <th className="text-left px-4 py-3">Timestamp</th>
                <th className="text-left px-4 py-3">Prompt Tokens</th>
                <th className="text-left px-4 py-3">Response Tokens</th>
                <th className="text-left px-4 py-3">Total Tokens</th>
                <th className="text-left px-4 py-3">Cost</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-text-muted text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-text">{log.promptTokens}</td>
                  <td className="px-4 py-3 font-mono text-text">{log.responseTokens}</td>
                  <td className="px-4 py-3 font-mono text-text">{log.totalTokens}</td>
                  <td className="px-4 py-3 font-mono text-primary">${log.cost.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export default UsageLogs;