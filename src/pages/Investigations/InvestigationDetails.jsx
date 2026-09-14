// src/pages/Investigations/InvestigationDetails.jsx

import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';

import * as investigationService from '../../services/investigationService';
import { UserContext } from '../../contexts/UserContext';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

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
      <main className='investigation-details-page'>
        <p className='status-message'>{message || 'Loading...'}</p>
      </main>
    );
  }

  return (
    <main className='investigation-details-page'>
      <div className='page-header'>
        <h1>{investigation.title}</h1>
        <div className='badge-row'>
          <span className={`badge badge-priority-${investigation.priority.toLowerCase()}`}>
            {investigation.priority}
          </span>
          <span className={`badge badge-status-${investigation.status.toLowerCase().replace(' ', '-')}`}>
            {investigation.status}
          </span>
        </div>
      </div>

      {message && <p className='error-message'>{message}</p>}
            <div className='investigation-body'>
        <div className='detail-row'>
          <span className='detail-label'>Related incident:</span>
          <span className='detail-value'>
            {investigation.incident?.title || 'None'}
          </span>
        </div>

        <div className='detail-row'>
          <span className='detail-label'>Assigned to:</span>
          <span className='detail-value'>
            {investigation.assignedTo?.name || investigation.assignedTo?.username}
          </span>
        </div>

        {investigation.findings && (
          <div className='detail-row'>
            <span className='detail-label'>Findings:</span>
            <span className='detail-value'>{investigation.findings}</span>
          </div>
        )}

        {investigation.notes && (
          <div className='detail-row'>
            <span className='detail-label'>Notes:</span>
            <span className='detail-value'>{investigation.notes}</span>
          </div>
        )}
      </div>
