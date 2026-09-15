// src/pages/Incidents/IncidentDetails.jsx

import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';

import * as incidentService from '../../services/incidentService';
import { UserContext } from '../../contexts/UserContext';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

const SEVERITY_CLASS = { Low: 'low', Medium: 'medium', High: 'critical', Critical: 'critical' };

const IncidentDetails = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [incident, setIncident] = useState(null);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!incidentId) return;

    const fetchIncident = async () => {
      try {
        const fetchedIncident = await incidentService.show(incidentId);
        setIncident(fetchedIncident);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchIncident();
  }, [incidentId]);

  const handleDelete = async () => {
    try {
      await incidentService.deleteIncident(incidentId);
      navigate('/incidents');
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!incident) {
    return (
      <main>
        <p className="status-message">{message || 'Loading...'}</p>
      </main>
    );
  }

  const sevClass = SEVERITY_CLASS[incident.severity];

  return (
    <main>
      <p className="eyebrow">Incident details</p>

      <div className="details-grid">
        <div className="details-card">
          <svg className="details-card-watermark" width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="68" fill="none" stroke="#f4ede8" strokeWidth="1.5" />
            <circle cx="70" cy="70" r="48" fill="none" stroke="#f4ede8" strokeWidth="1.5" />
            <circle cx="70" cy="70" r="28" fill="none" stroke="#f4ede8" strokeWidth="1.5" />
          </svg>

          <div className={`severity-flag severity-flag-${sevClass}`}>
            <span className={`severity-dot severity-dot-${sevClass}`}></span>
            {incident.severity} incident
          </div>

          <h1>{incident.title}</h1>
          <p className="description">{incident.description}</p>

          {message && <p className="error-message">{message}</p>}

          <div className="details-actions">
            <Link to={`/incidents/${incident._id}/edit`} className="btn btn-primary">
              <i className="ti ti-edit" aria-hidden="true"></i> Edit incident
            </Link>
            {user.role === 'admin' && (
              <button onClick={() => setShowConfirm(true)} className="btn btn-danger">
                <i className="ti ti-trash" aria-hidden="true"></i> Delete
              </button>
            )}
            <Link to="/incidents" className="btn btn-link">Back to list</Link>
          </div>
        </div>

        <div className="meta-panel">
          <svg className="meta-panel-watermark" width="120" height="120" viewBox="0 0 120 120">
            <polygon points="60,6 108,33 108,87 60,114 12,87 12,33" fill="none" stroke="#1c3a34" strokeWidth="2" />
          </svg>

          <p className="meta-label">Status</p>
          <p className="meta-value">{incident.status}</p>

          <p className="meta-label">Category</p>
          <p className="meta-value">{incident.category}</p>

          <p className="meta-label">Assigned to</p>
          <div className="meta-avatar-row">
            <div className="meta-avatar">
              {(incident.assignedTo?.name || incident.assignedTo?.username || '?').slice(0, 2).toUpperCase()}
            </div>
            <p className="meta-value meta-value-inline">
              {incident.assignedTo?.name || incident.assignedTo?.username}
            </p>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDelete
          itemName={incident.title}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </main>
  );
};

export default IncidentDetails;