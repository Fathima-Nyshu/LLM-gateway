import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

function ApiKeys() {
  const [apiKey, setApiKey] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setApiKey(localStorage.getItem('apiKey') || '');
    setEmail(localStorage.getItem('email') || '');
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-text mb-6">API Keys</h2>

      <div className="bg-surface border border-border rounded-lg p-6 max-w-xl">
        <p className="text-text-muted text-xs uppercase mb-1">Account</p>
        <p className="text-text text-sm mb-4">{email}</p>

        <p className="text-text-muted text-xs uppercase mb-1">Your API Key</p>
        <div className="flex items-center gap-2">
          <div className="bg-background border border-border rounded px-3 py-2 font-mono text-primary text-sm flex-1 break-all">
            {apiKey}
          </div>
          <button
            onClick={handleCopy}
            className="bg-primary hover:bg-primary-hover text-background font-semibold rounded px-4 py-2 text-sm transition-colors whitespace-nowrap"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <p className="text-text-muted text-xs mt-4">
          Include this key in the <span className="font-mono text-text">x-api-key</span> header when calling the API.
        </p>
      </div>
    </Layout>
  );
}

export default ApiKeys;