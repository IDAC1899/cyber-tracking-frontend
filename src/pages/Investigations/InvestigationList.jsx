import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import * as investigationService from '../../services/investigationService';

const InvestigationList = () => {
  const [investigations, setInvestigations] = useState([]);
  const [message, setMessage] = useState('');

  // fetch all investigations once, when the page first loads
  useEffect(() => {
    const fetchInvestigations = async () => {
      try {
        const fetchedInvestigations = await investigationService.index();
        setInvestigations(fetchedInvestigations);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchInvestigations();
  }, []);