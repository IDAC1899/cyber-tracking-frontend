// src/components/NavBar/NavBar.jsx

import { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';

import { UserContext } from '../../contexts/UserContext';

const initials = (name) => (name || '?').slice(0, 2).toUpperCase();

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const themeToggle = (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setIsDark(!isDark)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <i className={`ti ti-${isDark ? 'sun' : 'moon'}`} aria-hidden="true"></i>
    </button>
  );

  return (
    <nav>
      <div className="nav-inner">
        {user ? (
          <>
            <ul className="nav-links">
              <li className="nav-brand">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5dcaa5" strokeWidth="2">
                  <path d="M12 2 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z" />
                </svg>
                CyberTrack
              </li>
              <li><Link to="/">Dashboard</Link></li>
              <li>
                <Link to="/incidents" className={isActive('/incidents') ? 'nav-active' : ''}>
                  Incidents
                </Link>
              </li>
              <li><Link to="/threats">Threats</Link></li>
              <li><Link to="/investigations">Investigations</Link></li>
            </ul>

            <ul className="nav-controls">
              <li>{themeToggle}</li>
              <li className="nav-divider"></li>
              <li className="nav-user">
                <div className="nav-avatar">{initials(user.username)}</div>
                {user.username}
              </li>
              <li>
                <button type="button" className="btn-signout" onClick={handleSignOut}>
                  Sign out
                </button>
              </li>
            </ul>
          </>
        ) : (
          <>
            <ul className="nav-links">
              <li className="nav-brand">CyberTrack</li>
              <li><Link to="/">Home</Link></li>
            </ul>

            <ul className="nav-controls">
              <li>{themeToggle}</li>
              <li><Link to="/sign-in">Sign In</Link></li>
              <li><Link to="/sign-up">Sign Up</Link></li>
            </ul>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;