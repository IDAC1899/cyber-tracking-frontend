// src/pages/Incidents/IncidentDetails.jsx

import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';

import * as incidentService from '../../services/incidentService';
import { UserContext } from '../../contexts/UserContext';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

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
      <main className='incident-details-page'>
        <p className='status-message'>{message || 'Loading...'}</p>
      </main>
    );
  }

  return (
    <main className='incident-details-page'>
      <div className='page-header'>
        <h1>{incident.title}</h1>
        <div className='badge-row'>
          <span className={`badge badge-severity-${incident.severity.toLowerCase()}`}>
            {incident.severity}
          </span>
          <span className={`badge badge-status-${incident.status.toLowerCase().replace(' ', '-')}`}>
            {incident.status}
          </span>
        </div>
      </div>

      {message && <p className='error-message'>{message}</p>}

      <div className='incident-body'>
        <p className='description'>{incident.description}</p>

        <div className='detail-row'>
          <span className='detail-label'>Category:</span>
          <span className='detail-value'>{incident.category}</span>
        </div>

        <div className='detail-row'>
          <span className='detail-label'>Assigned to:</span>
          <span className='detail-value'>
            {incident.assignedTo?.name || incident.assignedTo?.username}
          </span>
        </div>
      </div>

      <div className='action-row'>
        <Link to={`/incidents/${incident._id}/edit`} className='btn btn-secondary'>Edit</Link>

        {user.role === 'admin' && (
          <button onClick={() => setShowConfirm(true)} className='btn btn-danger'>Delete</button>
        )}

        <Link to='/incidents' className='btn btn-link'>Back to list</Link>
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