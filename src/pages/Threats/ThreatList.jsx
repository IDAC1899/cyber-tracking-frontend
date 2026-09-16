// src/pages/Threats/ThreatList.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import * as threatService from '../../services/threatService';

// icon + color-family lookup per type — color-family maps to CSS classes in index.css
const TYPE_STYLE = {
  'IP Address': { icon: 'network', family: 'green' },
  Domain: { icon: 'world', family: 'amber' },
  URL: { icon: 'link', family: 'green' },
  'File Hash': { icon: 'fingerprint', family: 'gray' },
  Email: { icon: 'mail', family: 'red' },
  Malware: { icon: 'virus', family: 'red' },
};

const SEVERITY_ACCENT = { Low: 'accent-low', Medium: 'accent-medium', High: 'accent-high', Critical: 'accent-critical' };
const SEVERITY_BADGE = { Low: 'badge-solid-low', Medium: 'badge-solid-medium', High: 'badge-solid-high', Critical: 'badge-solid-critical' };
const STATUS_BADGE = {
  Active: 'badge-outline-medium',
  Investigating: 'badge-outline-info',
  Contained: 'badge-outline-low',
  'False Positive': 'badge-outline-low',
  Resolved: 'badge-outline-low',
};

const ThreatList = () => {
  const [threats, setThreats] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const fetchedThreats = await threatService.index();
        setThreats(fetchedThreats);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchThreats();
  }, []);

  return (
    <main>
      <p className="eyebrow">Threat list</p>

      <div className="page-banner">
        <svg className="page-banner-shapes" width="220" height="140" viewBox="0 0 220 140">
          <polygon points="130,10 175,35 175,85 130,110 85,85 85,35" fill="none" stroke="#1c3a34" strokeWidth="2" />
          <polygon points="170,60 200,77 200,111 170,128 140,111 140,77" fill="none" stroke="#12352f" strokeWidth="2" />
          <circle cx="60" cy="100" r="30" fill="none" stroke="#12352f" strokeWidth="2" />
        </svg>
        <div>
          <h1>Threats</h1>
          <p>{threats.length} tracked {threats.length === 1 ? 'threat' : 'threats'} across the team</p>
        </div>
        <Link to="/threats/new" className="btn btn-light">+ New threat</Link>
      </div>

      {message && <p className="error-message">{message}</p>}
      {loading && <p className="status-message">Loading threats...</p>}

      {!loading && !message && threats.length === 0 && (
        <div className="empty-state">
          <p>No threats logged yet.</p>
          <Link to="/threats/new" className="btn btn-primary">+ Log the first threat</Link>
        </div>
      )}

      <div className="incident-list">
        {threats.map((threat) => {
          const type = TYPE_STYLE[threat.type] || TYPE_STYLE.Malware;
          return (
            <div className="incident-row" key={threat._id}>
              <div className={`incident-row-accent ${SEVERITY_ACCENT[threat.severity]}`} />
              <Link to={`/threats/${threat._id}`} className="incident-row-link">
                <svg className={`row-watermark watermark-${type.family}`} width="70" height="70" viewBox="0 0 70 70">
                  <polygon points="35,4 62,20 62,50 35,66 8,50 8,20" fill="none" strokeWidth="10" />
                </svg>
                <div className={`incident-row-icon icon-chip-${type.family}`}>
                  <i className={`ti ti-${type.icon}`} aria-hidden="true"></i>
                </div>
                <span className="incident-row-title">{threat.name}</span>
                <span className={`badge ${SEVERITY_BADGE[threat.severity]}`}>{threat.severity}</span>
                <span className={`badge ${STATUS_BADGE[threat.status]}`}>{threat.status}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default ThreatList;