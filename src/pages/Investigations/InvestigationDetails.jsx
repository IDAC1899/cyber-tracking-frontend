// src/pages/Investigations/InvestigationDetails.jsx

import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';

import * as investigationService from '../../services/investigationService';
import { UserContext } from '../../contexts/UserContext';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

const PRIORITY_CLASS = { Low: 'low', Medium: 'medium', High: 'high', Critical: 'critical' };

const InvestigationDetails = () => {
  const { investigationId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [investigation, setInvestigation] = useState(null);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!investigationId) return;

    const fetchInvestigation = async () => {
      try {
        const fetchedInvestigation = await investigationService.show(investigationId);
        setInvestigation(fetchedInvestigation);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchInvestigation();
  }, [investigationId]);

  const handleDelete = async () => {
    try {
      await investigationService.deleteInvestigation(investigationId);
      navigate('/investigations');
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!investigation) {
    return (
      <main>
        <p className="status-message">{message || 'Loading...'}</p>
      </main>
    );
  }

  const priClass = PRIORITY_CLASS[investigation.priority];

  return (
    <main>
      <p className="eyebrow">Investigation details</p>

      <div className="details-grid">
        <div className="details-card">
          <svg className="details-card-watermark" width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="68" fill="none" stroke="#f4ede8" strokeWidth="1.5" />
            <circle cx="70" cy="70" r="48" fill="none" stroke="#f4ede8" strokeWidth="1.5" />
            <circle cx="70" cy="70" r="28" fill="none" stroke="#f4ede8" strokeWidth="1.5" />
          </svg>

          <div className={`severity-flag severity-flag-${priClass}`}>
            <span className={`severity-dot severity-dot-${priClass}`}></span>
            {investigation.priority} priority
          </div>

          <h1>{investigation.title}</h1>

          {investigation.findings && <p className="description">{investigation.findings}</p>}
          {investigation.notes && <p className="description">{investigation.notes}</p>}

          {message && <p className="error-message">{message}</p>}

          <div className="details-actions">
            <Link to={`/investigations/${investigation._id}/edit`} className="btn btn-primary">
              <i className="ti ti-edit" aria-hidden="true"></i> Edit investigation
            </Link>
            {user.role === 'admin' && (
              <button onClick={() => setShowConfirm(true)} className="btn btn-danger">
                <i className="ti ti-trash" aria-hidden="true"></i> Delete
              </button>
            )}
            <Link to="/investigations" className="btn btn-link">Back to list</Link>
          </div>
        </div>

        <div className="meta-panel">
          <svg className="meta-panel-watermark" width="120" height="120" viewBox="0 0 120 120">
            <polygon points="60,6 108,33 108,87 60,114 12,87 12,33" fill="none" stroke="#1c3a34" strokeWidth="2" />
          </svg>

          <p className="meta-label">Status</p>
          <p className="meta-value">{investigation.status}</p>

          <p className="meta-label">Related incident</p>
          <p className="meta-value">{investigation.incident?.title || 'None'}</p>

          <p className="meta-label">Assigned to</p>
          <div className="meta-avatar-row">
            <div className="meta-avatar">
              {(investigation.assignedTo?.name || investigation.assignedTo?.username || '?').slice(0, 2).toUpperCase()}
            </div>
            <p className="meta-value meta-value-inline">
              {investigation.assignedTo?.name || investigation.assignedTo?.username}
            </p>
          </div>

          {investigation.lastEditedBy && (
            <>
              <p className="meta-label">Last edited by</p>
              <div className="meta-avatar-row">
                <div className="meta-avatar">
                  {(investigation.lastEditedBy?.name || investigation.lastEditedBy?.username || '?').slice(0, 2).toUpperCase()}
                </div>
                <p className="meta-value meta-value-inline">
                  {investigation.lastEditedBy?.name || investigation.lastEditedBy?.username}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {showConfirm && (
        <ConfirmDelete
          itemName={investigation.title}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </main>
  );
};

export default InvestigationDetails;