// src/components/SignInForm/SignInForm.jsx

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';

import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import Logo from '../Logo/Logo';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-brand">
        <Logo size={26} />
        <span>CyberTrack</span>
      </div>
      <p className="eyebrow">Sign in</p>

      <div className="form-card">
        <div className="form-header">
          <svg className="form-header-pattern" width="180" height="70" viewBox="0 0 180 70">
            <path d="M0 50 L30 20 L60 45 L90 10 L120 40 L150 15 L180 35" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx="90" cy="10" r="4" fill="#fff" />
            <circle cx="150" cy="15" r="4" fill="#fff" />
          </svg>
          <div className="form-header-icon-row">
            <i className="ti ti-shield-lock" aria-hidden="true"></i>
            <h1>Welcome back</h1>
          </div>
        </div>

        <div className="form-body">
          {message && <p className="error-message">{message}</p>}

          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <div className="input-icon-wrap">
                <i className="ti ti-user input-icon" aria-hidden="true"></i>
                <input
                  type="text"
                  autoComplete="off"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="input-icon-wrap">
                <i className="ti ti-lock input-icon" aria-hidden="true"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="off"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`ti ti-${showPassword ? 'eye-off' : 'eye'}`} aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary">Sign in</button>
              <button type="button" className="btn btn-link" onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <p className="auth-switch">
        Don't have an account? <Link to="/sign-up">Sign up</Link>
      </p>
    </main>
  );
};

export default SignInForm;