// src/pages/Threats/ThreatDetails.jsx

import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';

import * as threatService from '../../services/threatService';
import { UserContext } from '../../contexts/UserContext';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

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
      <main className='threat-details-page'>
        <p className='status-message'>{message || 'Loading...'}</p>
      </main>
    );
  }

  return (
    <main className='threat-details-page'>
      <div className='page-header'>
        <h1>{threat.name}</h1>
        <div className='badge-row'>
          <span className={`badge badge-severity-${threat.severity.toLowerCase()}`}>
            {threat.severity}
          </span>
          <span className={`badge badge-status-${threat.status.toLowerCase().replace(' ', '-')}`}>
            {threat.status}
          </span>
        </div>
      </div>

      {message && <p className='error-message'>{message}</p>}

      <div className='threat-body'>
        <div className='detail-row'>
          <span className='detail-label'>Type:</span>
          <span className='detail-value'>{threat.type}</span>
        </div>

        <div className='detail-row'>
          <span className='detail-label'>Value:</span>
          <span className='detail-value'>{threat.value}</span>
        </div>

        {threat.source && (
          <div className='detail-row'>
            <span className='detail-label'>Source:</span>
            <span className='detail-value'>{threat.source}</span>
          </div>
        )}

        <div className='detail-row'>
          <span className='detail-label'>Related incident:</span>
          <span className='detail-value'>
            {threat.incident?.title || 'None'}
          </span>
        </div>
      </div>

           <div className='action-row'>
        {(user.role === 'admin' || threat.createdBy?._id === user._id || threat.createdBy === user._id) && (
          <Link to={`/threats/${threat._id}/edit`} className='btn btn-secondary'>Edit</Link>
        )}

        {user.role === 'admin' && (
          <button onClick={() => setShowConfirm(true)} className='btn btn-danger'>Delete</button>
        )}

        <Link to='/threats' className='btn btn-link'>Back to list</Link>
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