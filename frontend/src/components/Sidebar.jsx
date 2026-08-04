import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'API Keys', path: '/keys' },
  { name: 'Usage Logs', path: '/logs' },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('apiKey');
    localStorage.removeItem('email');
    navigate('/login');
  }

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-surface border-b border-border p-4">
        <h1 className="text-lg font-bold text-text">LLM Gateway</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-text p-1">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      <div
        className={`
          bg-surface border-r border-border p-4 z-50 flex flex-col justify-between
          md:w-56 md:min-h-screen md:block
          ${isOpen ? 'block' : 'hidden'}
          fixed md:static top-0 left-0 w-56 min-h-screen
        `}
      >
        <div>
          <h1 className="hidden md:block text-lg font-bold text-text mb-8 px-2">LLM Gateway</h1>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-background'
                      : 'text-text-muted hover:bg-border hover:text-text'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded text-sm font-medium text-error hover:bg-border transition-colors text-left"
        >
          Log out
        </button>
      </div>
    </>
  );
}

export default Sidebar;