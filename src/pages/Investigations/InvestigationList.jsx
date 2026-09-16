import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import * as investigationService from '../../services/investigationService';

// icon + color-family lookup per priority — color-family maps to CSS classes in index.css
const PRIORITY_STYLE = {
  Low: { icon: 'flag', family: 'green' },
  Medium: { icon: 'flag', family: 'amber' },
  High: { icon: 'flag-filled', family: 'red' },
  Critical: { icon: 'alert-triangle', family: 'red' },
};

const PRIORITY_ACCENT = { Low: 'accent-low', Medium: 'accent-medium', High: 'accent-high', Critical: 'accent-critical' };
const PRIORITY_BADGE = { Low: 'badge-solid-low', Medium: 'badge-solid-medium', High: 'badge-solid-high', Critical: 'badge-solid-critical' };
const STATUS_BADGE = {
  'Not Started': 'badge-outline-medium',
  'In Progress': 'badge-outline-info',
  'On Hold': 'badge-outline-medium',
  Completed: 'badge-outline-low',
};

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
    <main>
      <p className="eyebrow">Investigation list</p>

      <div className="page-banner">
        <svg className="page-banner-shapes" width="220" height="140" viewBox="0 0 220 140">
          <polygon points="130,10 175,35 175,85 130,110 85,85 85,35" fill="none" stroke="#1c3a34" strokeWidth="2" />
          <circle cx="60" cy="100" r="30" fill="none" stroke="#12352f" strokeWidth="2" />
        </svg>
        <div>
          <h1>Investigations</h1>
          <p>{investigations.length} open {investigations.length === 1 ? 'case' : 'cases'}</p>
        </div>
        <Link to="/investigations/new" className="btn btn-light">+ New investigation</Link>
      </div>

      {message && <p className="error-message">{message}</p>}

      {loading && (
        <div className="incident-list">
          {[...Array(4)].map((_, i) => (
            <div className="skeleton-row" key={i}>
              <div className="skeleton-block skeleton-icon" />
              <div className="skeleton-block skeleton-title" />
              <div className="skeleton-block skeleton-badge" />
              <div className="skeleton-block skeleton-badge" />
            </div>
          ))}
        </div>
      )}

      {!loading && !message && investigations.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="ti ti-search" aria-hidden="true"></i>
          </div>
          <p>No investigations yet.</p>
          <Link to="/investigations/new" className="btn btn-primary">+ Create the first investigation</Link>
        </div>
      )}

      {!loading && investigations.length > 0 && (
      <>
      <div className="incident-list-header incident-list-header-compact">
        <span className="incident-list-header-spacer"></span>
        <span className="incident-list-header-spacer"></span>
        <span className="incident-list-header-badge">Priority</span>
        <span className="incident-list-header-badge">Status</span>
      </div>
      <div className="incident-list">
        {investigations.map((investigation) => {
          const pri = PRIORITY_STYLE[investigation.priority] || PRIORITY_STYLE.Low;
          return (
            <div className="incident-row" key={investigation._id}>
              <div className={`incident-row-accent ${PRIORITY_ACCENT[investigation.priority]}`} />
              <Link to={`/investigations/${investigation._id}`} className="incident-row-link incident-row-link-compact">
                <div className={`incident-row-icon icon-chip-${pri.family}`}>
                  <i className={`ti ti-${pri.icon}`} aria-hidden="true"></i>
                </div>
                <div className="incident-row-text">
                  <span className="incident-row-title">{investigation.title}</span>
                  <span className="incident-row-subtitle">
                    {investigation.incident?.title ? `Re: ${investigation.incident.title}` : 'No linked incident'}
                  </span>
                </div>
                <span className={`badge ${PRIORITY_BADGE[investigation.priority]}`}>{investigation.priority}</span>
                <span className={`badge ${STATUS_BADGE[investigation.status]}`}>{investigation.status}</span>
              </Link>
            </div>
          );
        })}
      </div>
      </>
      )}
    </main>
  );
};

export default InvestigationList;