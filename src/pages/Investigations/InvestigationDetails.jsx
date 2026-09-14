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