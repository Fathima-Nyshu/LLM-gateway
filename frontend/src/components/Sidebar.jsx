import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'API Keys', path: '/keys' },
  { name: 'Usage Logs', path: '/logs' },
];

function Sidebar() {
  return (
    <div className="w-56 bg-surface border-r border-border min-h-screen p-4">
      <h1 className="text-lg font-bold text-text mb-8 px-2">LLM Gateway</h1>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
  );
}

export default Sidebar;