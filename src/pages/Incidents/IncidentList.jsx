// src/pages/Incidents/IncidentList.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import * as incidentService from '../../services/incidentService';

// icon + color-family lookup per category — color-family maps to CSS classes in index.css
const CATEGORY_STYLE = {
  Phishing: { icon: 'mail', family: 'red' },
  Malware: { icon: 'virus', family: 'amber' },
  'Unauthorized Access': { icon: 'fingerprint', family: 'green' },
  'Data Breach': { icon: 'shield-x', family: 'red' },
  DDoS: { icon: 'server-off', family: 'amber' },
  'Suspicious Activity': { icon: 'eye-exclamation', family: 'green' },
  Other: { icon: 'alert-triangle', family: 'gray' },
};

const SEVERITY_ACCENT = { Low: 'accent-low', Medium: 'accent-medium', High: 'accent-critical', Critical: 'accent-critical' };
const SEVERITY_BADGE = { Low: 'badge-solid-low', Medium: 'badge-solid-medium', High: 'badge-solid-critical', Critical: 'badge-solid-critical' };
const STATUS_BADGE = {
  Open: 'badge-outline-medium',
  Investigating: 'badge-outline-info',
  Resolved: 'badge-outline-low',
  Closed: 'badge-outline-low',
};

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const fetchedIncidents = await incidentService.index();
        setIncidents(fetchedIncidents);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  return (
    <main>
      <p className="eyebrow">Incident list</p>

      <div className="page-banner">
        <svg className="page-banner-shapes" width="220" height="140" viewBox="0 0 220 140">
          <polygon points="130,10 175,35 175,85 130,110 85,85 85,35" fill="none" stroke="#1c3a34" strokeWidth="2" />
          <polygon points="170,60 200,77 200,111 170,128 140,111 140,77" fill="none" stroke="#12352f" strokeWidth="2" />
          <circle cx="60" cy="100" r="30" fill="none" stroke="#12352f" strokeWidth="2" />
        </svg>
        <div>
          <h1>Incidents</h1>
          <p>{incidents.length} active {incidents.length === 1 ? 'case' : 'cases'} across the team</p>
        </div>
        <Link to="/incidents/new" className="btn btn-light">+ New incident</Link>
      </div>

      {message && <p className="error-message">{message}</p>}
      {loading && <p className="status-message">Loading incidents...</p>}

      {!loading && !message && incidents.length === 0 && (
        <div className="empty-state">
          <p>No incidents reported yet.</p>
          <Link to="/incidents/new" className="btn btn-primary">+ Report the first incident</Link>
        </div>
      )}

      <div className="incident-list">
        {incidents.map((incident) => {
          const cat = CATEGORY_STYLE[incident.category] || CATEGORY_STYLE.Other;
          return (
            <div className="incident-row" key={incident._id}>
              <div className={`incident-row-accent ${SEVERITY_ACCENT[incident.severity]}`} />
              <Link to={`/incidents/${incident._id}`} className="incident-row-link">
                <svg className={`row-watermark watermark-${cat.family}`} width="70" height="70" viewBox="0 0 70 70">
                  <polygon points="35,4 62,20 62,50 35,66 8,50 8,20" fill="none" strokeWidth="10" />
                </svg>
                <div className={`incident-row-icon icon-chip-${cat.family}`}>
                  <i className={`ti ti-${cat.icon}`} aria-hidden="true"></i>
                </div>
                <span className="incident-row-title">{incident.title}</span>
                <span className={`badge ${SEVERITY_BADGE[incident.severity]}`}>{incident.severity}</span>
                <span className={`badge ${STATUS_BADGE[incident.status]}`}>{incident.status}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default IncidentList;