// src/pages/Threats/ThreatList.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import * as threatService from '../../services/threatService';

const ThreatList = () => {
  const [threats, setThreats] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const fetchedThreats = await threatService.index();
        setThreats(fetchedThreats);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchThreats();
  }, []);

  return (
    <main>
      <p className="eyebrow">Threats list</p>

      <div className="page-banner">
        <svg className="page-banner-shapes" width="220" height="140" viewBox="0 0 220 140">
          <polygon points="130,10 175,35 175,85 130,110 85,85 85,35" fill="none" stroke="#1c3a34" strokeWidth="2" />
          <polygon points="170,60 200,77 200,111 170,128 140,111 140,77" fill="none" stroke="#12352f" strokeWidth="2" />
          <circle cx="60" cy="100" r="30" fill="none" stroke="#12352f" strokeWidth="2" />
        </svg>
        <div>
          <h1>Threats</h1>
          <p>{threats.length} active {threats.length === 1 ? 'threat' : 'threats'} across the team</p>
        </div>
        <Link to="/threats/new" className="btn btn-light">+ New threat</Link>
      </div>

      {message && <p className="error-message">{message}</p>}

      <div className="incident-list">
        {threats.map((threat) => (
          <div key={threat._id} className="incident-row">
            <div className="incident-row-accent" />
            <Link to={`/threats/${threat._id}`} className="incident-row-link">
              <span className={`badge badge-solid-${threat.severity.toLowerCase()}`}>
                {threat.severity}
              </span>
              <span className="incident-row-title">{threat.name}</span>
              <span className={`badge badge-outline-${threat.status.toLowerCase().replace(' ', '-')}`}>
                {threat.status}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ThreatList;