import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import * as investigationService from '../../services/investigationService';
import * as incidentService from '../../services/incidentService';
import * as userService from '../../services/userService';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Not Started', 'In Progress', 'On Hold', 'Completed'];

const InvestigationForm = () => {
    const { investigationId } = useParams();
    const isEdit = Boolean(investigationId);
    const navigate = useNavigate();

    const [incidents, setIncidents] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        incident: '',
        assignedTo: '',
        priority: 'Low',
        status: 'Not Started',
        findings: '',
        notes: '',
    });
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const fetchedIncidents = await incidentService.index();
                const fetchedUsers = await userService.index();
                setIncidents(fetchedIncidents);
                setUsers(fetchedUsers);
            } catch (err) {
                setMessage(err.message);
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        if (isEdit) {
            const fetchInvestigation = async () => {
                try {
                    const investigation = await investigationService.show(investigationId);
                    setFormData({
                        ...investigation,
                        incident: investigation.incident?._id || investigation.incident,
                        assignedTo: investigation.assignedTo?._id || investigation.assignedTo,
                    });
                } catch (err) {
                    setMessage(err.message);
                }
            };
            fetchInvestigation();
        }
    }, [investigationId, isEdit]);

    const handleChange = (evt) => {
        setMessage('');
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            if (isEdit) {
                await investigationService.update(investigationId, formData);
            } else {
                await investigationService.create(formData);
            }
            navigate('/investigations');
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <main className='investigation-form-page'>
            <div className='page-header'>
                <h1>{isEdit ? 'Edit Investigation' : 'New Investigation'}</h1>
            </div>

            {message && <p className='error-message'>{message}</p>}

            <form onSubmit={handleSubmit} className='investigation-form'>
                <div className='form-section'>
                    <div className='form-field'>
                        <label htmlFor='title'>Title:</label>
                        <input
                            type='text'
                            id='title'
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='form-field'>
                        <label htmlFor='incident'>Related Incident:</label>
                        <select
                            id='incident'
                            name='incident'
                            value={formData.incident}
                            onChange={handleChange}
                            required
                        >
                            <option value='' disabled>Select an incident</option>
                            {incidents.map((incident) => (
                                <option key={incident._id} value={incident._id}>{incident.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='form-section form-row'>
                    <div className='form-field'>
                        <label htmlFor='assignedTo'>Assigned To:</label>
                        <select
                            id='assignedTo'
                            name='assignedTo'
                            value={formData.assignedTo}
                            onChange={handleChange}
                            required
                        >
                            <option value='' disabled>Select an analyst</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className='form-field'>
                        <label htmlFor='priority'>Priority:</label>
                        <select id='priority' name='priority' value={formData.priority} onChange={handleChange}>
                            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div className='form-field'>
                        <label htmlFor='status'>Status:</label>
                        <select id='status' name='status' value={formData.status} onChange={handleChange}>
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className='form-actions'>
                    <button className='btn btn-primary'>
                        {isEdit ? 'Save Changes' : 'Create Investigation'}
                    </button>
                    <button
                        type='button'
                        className='btn btn-link'
                        onClick={() => navigate('/investigations')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    );
};

export default InvestigationForm;
