// src/pages/Threats/ThreatDetails.jsx

import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';

import * as threatService from '../../services/threatService';
import { UserContext } from '../../contexts/UserContext';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

const SEVERITY_CLASS = { Low: 'low', Medium: 'medium', High: 'high', Critical: 'critical' };

const ThreatDetails = () => {
  const { threatId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [threat, setThreat] = useState(null);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!threatId) return;

    const fetchThreat = async () => {
      try {
        const fetchedThreat = await threatService.show(threatId);
        setThreat(fetchedThreat);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchThreat();
  }, [threatId]);

  const handleDelete = async () => {
    try {
      await threatService.deleteThreat(threatId);
      navigate('/threats');
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!threat) {
    return (
      <main>
        <p className="status-message">{message || 'Loading...'}</p>
      </main>
    );
  }

  const sevClass = SEVERITY_CLASS[threat.severity];
  return (
    <main>
      <p className="eyebrow">Threat details</p>

      <div className="details-grid">
        <div className="details-card">
          <svg className="details-card-watermark" width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="68" fill="none" stroke="#f4ede8" strokeWidth="1.5" />
            <circle cx="70" cy="70" r="48" fill="none" stroke="#f4ede8" strokeWidth="1.5" />
            <circle cx="70" cy="70" r="28" fill="none" stroke="#f4ede8" strokeWidth="1.5" />
          </svg>

          <div className={`severity-flag severity-flag-${sevClass}`}>
            <span className={`severity-dot severity-dot-${sevClass}`}></span>
            {threat.severity} severity
          </div>

          <h1>{threat.name}</h1>
          <p className="description">{threat.value}</p>

          {message && <p className="error-message">{message}</p>}

          <div className="details-actions">
            <Link to={`/threats/${threat._id}/edit`} className="btn btn-primary">
              <i className="ti ti-edit" aria-hidden="true"></i> Edit threat
            </Link>
            {user.role === 'admin' && (
              <button onClick={() => setShowConfirm(true)} className="btn btn-danger">
                <i className="ti ti-trash" aria-hidden="true"></i> Delete
              </button>
            )}
            <Link to="/threats" className="btn btn-link">Back to list</Link>
          </div>
        </div>

        <div className="meta-panel">
          <svg className="meta-panel-watermark" width="120" height="120" viewBox="0 0 120 120">
            <polygon points="60,6 108,33 108,87 60,114 12,87 12,33" fill="none" stroke="#1c3a34" strokeWidth="2" />
          </svg>

          <p className="meta-label">Type</p>
          <p className="meta-value">{threat.type}</p>

          <p className="meta-label">Status</p>
          <p className="meta-value">{threat.status}</p>

          {threat.source && (
            <>
              <p className="meta-label">Source</p>
              <p className="meta-value">{threat.source}</p>
            </>
          )}

          <p className="meta-label">Related incident</p>
          <p className="meta-value">{threat.incident?.title || 'None'}</p>

          {threat.lastEditedBy && (
            <>
              <p className="meta-label">Last edited by</p>
              <div className="meta-avatar-row">
                <div className="meta-avatar">
                  {(threat.lastEditedBy?.name || threat.lastEditedBy?.username || '?').slice(0, 2).toUpperCase()}
                </div>
                <p className="meta-value meta-value-inline">
                  {threat.lastEditedBy?.name || threat.lastEditedBy?.username}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {showConfirm && (
        <ConfirmDelete
          itemName={threat.name}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </main>
  );
};

export default ThreatDetails;