// src/pages/Incidents/IncidentForm.jsx

import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';

import * as incidentService from '../../services/incidentService';
import { UserContext } from '../../contexts/UserContext';

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const CATEGORIES = [
  'Phishing',
  'Malware',
  'Unauthorized Access',
  'Data Breach',
  'DDoS',
  'Suspicious Activity',
  'Other',
];

const IncidentForm = () => {
  const { incidentId } = useParams();
  const isEdit = Boolean(incidentId);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'Low',
    category: 'Phishing',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchIncident = async () => {
  try {
    const incident = await incidentService.show(incidentId);
    setFormData({
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      category: incident.category,
    });
  } catch (err) {
    setMessage(err.message);
  }
};
      fetchIncident();
    }
  }, [incidentId, isEdit]);

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      if (isEdit) {
        await incidentService.update(incidentId, formData);
      } else {
        await incidentService.create({ ...formData, assignedTo: user._id });
      }
      navigate('/incidents');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main>
      <p className="eyebrow">{isEdit ? 'Edit incident' : 'New incident form'}</p>

      <div className="form-card">
        <div className="form-header">
          <svg className="form-header-pattern" width="180" height="70" viewBox="0 0 180 70">
            <path d="M0 50 L30 20 L60 45 L90 10 L120 40 L150 15 L180 35" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx="90" cy="10" r="4" fill="#fff" />
            <circle cx="150" cy="15" r="4" fill="#fff" />
          </svg>
          <h1>{isEdit ? 'Edit incident' : 'Report a new incident'}</h1>
        </div>

        <div className="form-body">
          {message && <p className="error-message">{message}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="severity">Severity</label>
                <select id="severity" name="severity" value={formData.severity} onChange={handleChange}>
                  {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary">{isEdit ? 'Save changes' : 'Create incident'}</button>
              <button type="button" className="btn btn-link" onClick={() => navigate('/incidents')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default IncidentForm;