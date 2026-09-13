// src/components/Dashboard/Dashboard.jsx

import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as incidentService from '../../services/incidentService';
import * as threatService from '../../services/threatService';
import * as investigationService from '../../services/investigationService';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [incidents, setIncidents] = useState([]);
  const [threats, setThreats] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      const [incidentResult, threatResult, investigationResult] = await Promise.allSettled([
        incidentService.index(),
        threatService.index(),
        investigationService.index(),
      ]);

      const failedResources = [];

      if (incidentResult.status === 'fulfilled') {
        setIncidents(incidentResult.value);
      } else {
        console.log('Incidents failed to load:', incidentResult.reason);
        failedResources.push('incidents');
      }

      if (threatResult.status === 'fulfilled') {
        setThreats(threatResult.value);
      } else {
        console.log('Threats failed to load:', threatResult.reason);
        failedResources.push('threats');
      }

      if (investigationResult.status === 'fulfilled') {
        setInvestigations(investigationResult.value);
      } else {
        console.log('Investigations failed to load:', investigationResult.reason);
        failedResources.push('investigations');
      }

      if (failedResources.length > 0) {
        setMessage(`Couldn't load: ${failedResources.join(', ')}`);
      }
    };
    if (user) fetchAll();
  }, [user]);

  return (
    <main className='dashboard-page'>
      <div className='page-header'>
        <h1>Welcome, {user.username}</h1>
      </div>

      {message && <p className='error-message'>{message}</p>}

      <div className='dashboard-summary'>
        <div className='summary-card'>
          <p className='summary-label'>Total Incidents</p>
          <p className='summary-count'>{incidents.length}</p>
        </div>
        <div className='summary-card'>
          <p className='summary-label'>Total Threats</p>
          <p className='summary-count'>{threats.length}</p>
        </div>
        <div className='summary-card'>
          <p className='summary-label'>Total Investigations</p>
          <p className='summary-count'>{investigations.length}</p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;