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
    <main className='threat-list-page'>
      <div className='page-header'>
        <h1>Threats</h1>
        <Link to='/threats/new' className='btn btn-primary'>+ New Threat</Link>
      </div>

      {message && <p className='error-message'>{message}</p>}

      <div className='threat-list'>
        {threats.map((threat) => (
          <div key={threat._id} className='threat-row'>
            <Link to={`/threats/${threat._id}`} className='threat-row-link'>
              <span className={`badge badge-severity-${threat.severity.toLowerCase()}`}>
                {threat.severity}
              </span>
              <span className='threat-name'>{threat.name}</span>
              <span className={`badge badge-status-${threat.status.toLowerCase().replace(' ', '-')}`}>
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