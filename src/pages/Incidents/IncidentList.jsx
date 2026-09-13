// src/pages/Incidents/IncidentList.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import * as incidentService from '../../services/incidentService';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [message, setMessage] = useState('');

  // fetch all incidents once, when the page first loads
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const fetchedIncidents = await incidentService.index();
        setIncidents(fetchedIncidents);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchIncidents();
  }, []);

  return (
    <main className='incident-list-page'>
      {/* page header: title + new incident button */}
      <div className='page-header'>
        <h1>Incidents</h1>
        <Link to='/incidents/new' className='btn btn-primary'>+ New Incident</Link>
      </div>

      {/* error/status message */}
      {message && <p className='error-message'>{message}</p>}

      {/* incident rows */}
      <div className='incident-list'>
        {incidents.map((incident) => (
          <div key={incident._id} className='incident-row'>
            <Link to={`/incidents/${incident._id}`} className='incident-row-link'>
              <span className={`badge badge-severity-${incident.severity.toLowerCase()}`}>
                {incident.severity}
              </span>
              <span className='incident-title'>{incident.title}</span>
              <span className={`badge badge-status-${incident.status.toLowerCase().replace(' ', '-')}`}>
                {incident.status}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default IncidentList;