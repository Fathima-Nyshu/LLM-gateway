import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

function Dashboard() {
  const [summary, setSummary] = useState(null);
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
          setError(data.error || 'Failed to load usage data.');
          return;
        }

        setSummary(data);
      } catch (err) {
        setError('Could not connect to the server.');
      }
    }

    fetchUsage();
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-text mb-6">Dashboard</h2>

      {error && <p className="text-error text-sm">{error}</p>}

      {summary && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <p className="text-text-muted text-xs uppercase mb-1">Total Requests</p>
            <p className="text-text text-2xl font-bold font-mono">{summary.totalRequests}</p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <p className="text-text-muted text-xs uppercase mb-1">Total Tokens</p>
            <p className="text-text text-2xl font-bold font-mono">{summary.totalTokens}</p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <p className="text-text-muted text-xs uppercase mb-1">Total Cost</p>
            <p className="text-text text-2xl font-bold font-mono">${summary.totalCost.toFixed(6)}</p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;