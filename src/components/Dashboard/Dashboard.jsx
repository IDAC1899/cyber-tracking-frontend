// src/components/Dashboard/Dashboard.jsx

import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as incidentService from '../../services/incidentService';
import * as threatService from '../../services/threatService';
import * as investigationService from '../../services/investigationService';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [incidents, setIncidents]   = useState([]);
  const [threats, setThreats ] = useState([]);
  const  [investigations, setInvestigations ] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
    try {
      const[incidentData, threatData, investigationData] = await Promise.all([
        incidentService.index(),
        threatService.index(),
        investigationService.index(), 
      ]);
      setIncidents(incidentData);
      setThreats(threatData);
      setInvestigations(investigationData);  
    } catch (err) {
      console.log(err);
      
    }
  };
    if (user) fetchAll();
  }, [user]);

   return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>Total incidents: {incidents.length}</p>
      <p>Total threats: {threats.length}</p>
      <p>Total investigations: {investigations.length}</p>
    </main>
  );
};

export default Dashboard;
