import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setLoading(false);
        return;
      }

      setApiKey(data.apiKey);
      localStorage.setItem('apiKey', data.apiKey);
      localStorage.setItem('email', data.email);
    } catch (err) {
      setError('Could not connect to the server.');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-surface border border-border rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-text mb-1">LLM Gateway</h1>
        <p className="text-text-muted text-sm mb-6">Create an account to get your API key</p>

        {!apiKey ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background border border-border rounded px-3 py-2 text-text text-sm focus:outline-none focus:border-primary"
            />
            {error && <p className="text-error text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-hover text-background font-semibold rounded px-3 py-2 text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-success text-sm">Account created! Save your API key — it won't be shown again.</p>
            <div className="bg-background border border-border rounded px-3 py-2 font-mono text-primary text-sm break-all">
              {apiKey}
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary hover:bg-primary-hover text-background font-semibold rounded px-3 py-2 text-sm transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;