// src/pages/Threats/ThreatForm.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import * as threatService from '../../services/threatService';
import * as incidentService from '../../services/incidentService';

const TYPES = ['IP Address', 'Domain', 'URL', 'File Hash', 'Email', 'Malware'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Active', 'Investigating', 'Contained', 'False Positive', 'Resolved'];

const ThreatForm = () => {
  const { threatId } = useParams();
  const isEdit = Boolean(threatId);
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'IP Address',
    value: '',
    severity: 'Low',
    status: 'Active',
    source: '',
    incident: '',
  });
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    if (isEdit) {
      const fetchThreat = async () => {
        try {
          const threat = await threatService.show(threatId);
          setFormData({ ...threat, incident: threat.incident?._id || threat.incident });
        } catch (err) {
          setMessage(err.message);
        }
      };
      fetchThreat();
    }
  }, [threatId, isEdit]);

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      if (isEdit) {
        await threatService.update(threatId, formData);
      } else {
        await threatService.create(formData);
      }
      navigate('/threats');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className='threat-form-page'>
      <div className='page-header'>
        <h1>{isEdit ? 'Edit Threat' : 'New Threat'}</h1>
      </div>

      {message && <p className='error-message'>{message}</p>}

      <form onSubmit={handleSubmit} className='threat-form'>
        <div className='form-section'>
          <div className='form-field'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-field'>
            <label htmlFor='value'>Value:</label>
            <input
              type='text'
              id='value'
              name='value'
              value={formData.value}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className='form-section form-row'>
          <div className='form-field'>
            <label htmlFor='type'>Type:</label>
            <select id='type' name='type' value={formData.type} onChange={handleChange} required>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className='form-field'>
            <label htmlFor='severity'>Severity:</label>
            <select id='severity' name='severity' value={formData.severity} onChange={handleChange}>
              {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className='form-field'>
            <label htmlFor='status'>Status:</label>
            <select id='status' name='status' value={formData.status} onChange={handleChange}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className='form-section'>
          <div className='form-field'>
            <label htmlFor='source'>Source:</label>
            <input
              type='text'
              id='source'
              name='source'
              value={formData.source}
              onChange={handleChange}
            />
          </div>

          <div className='form-field'>
            <label htmlFor='incident'>Related Incident:</label>
            <select id='incident' name='incident' value={formData.incident} onChange={handleChange} required>
              <option value='' disabled>Select an incident</option>
              {incidents.map((incident) => (
                <option key={incident._id} value={incident._id}>{incident.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className='form-actions'>
          <button className='btn btn-primary'>{isEdit ? 'Save Changes' : 'Create Threat'}</button>
          <button type='button' className='btn btn-link' onClick={() => navigate('/threats')}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
};

export default ThreatForm;