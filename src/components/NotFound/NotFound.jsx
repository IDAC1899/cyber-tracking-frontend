// src/components/NotFound/NotFound.jsx

import { Link } from 'react-router';
import Logo from '../Logo/Logo';

const NotFound = () => {
  return (
    <main className="auth-page">
      <div className="auth-brand">
        <Logo size={26} />
        <span>CyberTrack</span>
      </div>
      <p className="eyebrow">404</p>

      <div className="form-card not-found-card">
        <div className="form-body">
          <div className="not-found-icon">
            <i className="ti ti-map-off" aria-hidden="true"></i>
          </div>
          <h1>Page not found</h1>
          <p className="status-message">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <Link to="/" className="btn btn-primary">Go home</Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
