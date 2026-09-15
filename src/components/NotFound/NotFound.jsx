// src/components/NotFound/NotFound.jsx

import { Link } from 'react-router';

const NotFound = () => {
  return (
    <main className='auth-page'>
      <div className='form-card'>
        <div className='form-body'>
          <h1>404 — Page Not Found</h1>
          <p className='status-message'>
            The page you're looking for doesn't exist.
          </p>
          <Link to='/' className='btn btn-primary'>Go home</Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;