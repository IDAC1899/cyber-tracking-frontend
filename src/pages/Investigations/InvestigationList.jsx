import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import * as investigationService from '../../services/investigationService';

const InvestigationList = () => {
  const [investigations, setInvestigations] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // fetch all investigations once, when the page first loads
  useEffect(() => {
    const fetchInvestigations = async () => {
      try {
        const fetchedInvestigations = await investigationService.index();
        setInvestigations(fetchedInvestigations);
            } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestigations();
  }, []);
  
  return (
    <main className='investigation-list-page'>
      {/* page header: title + new investigation button */}
      <div className='page-header'>
        <h1>Investigations</h1>
        <Link to='/investigations/new' className='btn btn-primary'>+ New Investigation</Link>
      </div>

            {message && <p className='error-message'>{message}</p>}
      {loading && <p className='status-message'>Loading investigations...</p>}

      {!loading && !message && investigations.length === 0 && (
        <div className='empty-state'>
          <p>No investigations yet.</p>
          <Link to='/investigations/new' className='btn btn-primary'>+ Create the first investigation</Link>
        </div>
      )}

      {/* investigation rows */}
      <div className='investigation-list'>
        {investigations.map((investigation) => (
          <div key={investigation._id} className='investigation-row'>
            <Link to={`/investigations/${investigation._id}`} className='investigation-row-link'>
              <span className={`badge badge-priority-${investigation.priority.toLowerCase()}`}>
                {investigation.priority}
              </span>
              <span className='investigation-title'>{investigation.title}</span>
              <span className={`badge badge-status-${investigation.status.toLowerCase().replace(' ', '-')}`}>
                {investigation.status}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default InvestigationList;