// src/components/NavBar/NavBar.jsx

import { useContext } from 'react';
import { Link, useLocation } from 'react-router';

import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav>
      {user ? (
        <ul>
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
          <li className="nav-spacer"></li>
          <li>Welcome, {user.username}</li>
          <li><Link to="/" onClick={handleSignOut}>Sign out</Link></li>
        </ul>
      ) : (
        <ul>
          <li className="nav-brand">CyberTrack</li>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/sign-in">Sign In</Link></li>
          <li><Link to="/sign-up">Sign Up</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;