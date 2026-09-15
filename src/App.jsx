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
      </Routes>
    </>
  );
};

export default App;