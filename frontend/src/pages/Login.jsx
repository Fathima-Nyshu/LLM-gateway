import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/v1/usage', {
        headers: { 'x-api-key': apiKey },
      });

      if (!res.ok) {
        setError('Invalid API key.');
        return;
      }

      localStorage.setItem('apiKey', apiKey);
      navigate('/dashboard');
    } catch (err) {
      setError('Could not connect to the server.');
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-surface border border-border rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-text mb-1">LLM Gateway</h1>
        <p className="text-text-muted text-sm mb-6">Enter your API key to continue</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="sk_..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            className="bg-background border border-border rounded px-3 py-2 text-text text-sm font-mono focus:outline-none focus:border-primary"
          />
          {error && <p className="text-error text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-background font-semibold rounded px-3 py-2 text-sm transition-colors"
          >
            Continue
          </button>
        </form>

        <p className="text-text-muted text-xs mt-4">
          Don't have a key yet?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;