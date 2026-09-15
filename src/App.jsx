// src/App.jsx

import { useContext } from 'react';
import { Routes, Route } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import IncidentList from './pages/Incidents/IncidentList';
import IncidentDetails from './pages/Incidents/IncidentDetails';
import IncidentForm from './pages/Incidents/IncidentForm';

import ThreatList from './pages/Threats/ThreatList';
import ThreatDetails from './pages/Threats/ThreatDetails';
import ThreatForm from './pages/Threats/ThreatForm';

import InvestigationList from './pages/Investigations/InvestigationList';
import InvestigationDetails from './pages/Investigations/InvestigationDetails';
import InvestigationForm from './pages/Investigations/InvestigationForm';

import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />

        <Route
          path='/incidents'
          element={<ProtectedRoute><IncidentList /></ProtectedRoute>}
        />
        <Route
          path='/incidents/new'
          element={<ProtectedRoute><IncidentForm /></ProtectedRoute>}
        />
        <Route
          path='/incidents/:incidentId'
          element={<ProtectedRoute><IncidentDetails /></ProtectedRoute>}
        />
        <Route
          path='/incidents/:incidentId/edit'
          element={<ProtectedRoute><IncidentForm /></ProtectedRoute>}
        />

        <Route
          path='/threats'
          element={<ProtectedRoute><ThreatList /></ProtectedRoute>}
        />
        <Route
          path='/threats/new'
          element={<ProtectedRoute><ThreatForm /></ProtectedRoute>}
        />
        <Route
          path='/threats/:threatId'
          element={<ProtectedRoute><ThreatDetails /></ProtectedRoute>}
        />
        <Route
          path='/threats/:threatId/edit'
          element={<ProtectedRoute><ThreatForm /></ProtectedRoute>}
        />

        <Route
          path='/investigations'
          element={<ProtectedRoute><InvestigationList /></ProtectedRoute>}
        />
        <Route
          path='/investigations/new'
          element={<ProtectedRoute><InvestigationForm /></ProtectedRoute>}
        />
        <Route
          path='/investigations/:investigationId'
          element={<ProtectedRoute><InvestigationDetails /></ProtectedRoute>}
        />
        <Route
          path='/investigations/:investigationId/edit'
          element={<ProtectedRoute><InvestigationForm /></ProtectedRoute>}
        />
      </Routes>
    </>
  );
};

export default App;