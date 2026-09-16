// src/components/SignUpForm/SignUpForm.jsx

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';

import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import Logo from '../Logo/Logo';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    passwordConf: '',
  });

  const { username, name, email, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && name && email && password && password === passwordConf);
  };

  const passwordsMismatch = password && passwordConf && password !== passwordConf;

  return (
    <main className="auth-page">
      <div className="auth-brand">
        <Logo size={26} />
        <span>CyberTrack</span>
      </div>
      <p className="eyebrow">Create account</p>

      <div className="form-card">
        <div className="form-header">
          <svg className="form-header-pattern" width="180" height="70" viewBox="0 0 180 70">
            <path d="M0 50 L30 20 L60 45 L90 10 L120 40 L150 15 L180 35" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx="90" cy="10" r="4" fill="#fff" />
            <circle cx="150" cy="15" r="4" fill="#fff" />
          </svg>
          <div className="form-header-icon-row">
            <i className="ti ti-user-plus" aria-hidden="true"></i>
            <h1>Join your team on CyberTrack</h1>
          </div>
        </div>

        <div className="form-body">
          {message && <p className="error-message">{message}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <div className="input-icon-wrap">
                <i className="ti ti-user input-icon" aria-hidden="true"></i>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="name">Name</label>
              <div className="input-icon-wrap">
                <i className="ti ti-id-badge-2 input-icon" aria-hidden="true"></i>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <div className="input-icon-wrap">
                <i className="ti ti-mail input-icon" aria-hidden="true"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <div className="input-icon-wrap">
                  <i className="ti ti-lock input-icon" aria-hidden="true"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={password}
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

              <div className="form-field">
                <label htmlFor="confirm">Confirm password</label>
                <div className="input-icon-wrap">
                  <i className="ti ti-lock input-icon" aria-hidden="true"></i>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="confirm"
                    name="passwordConf"
                    value={passwordConf}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    <i className={`ti ti-${showConfirm ? 'eye-off' : 'eye'}`} aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>

            {passwordsMismatch && (
              <p className="error-message">Passwords don't match</p>
            )}

            <div className="form-actions">
              <button className="btn btn-primary" disabled={isFormInvalid()}>Create account</button>
              <button type="button" className="btn btn-link" onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <p className="auth-switch">
        Already have an account? <Link to="/sign-in">Sign in</Link>
      </p>
    </main>
  );
};

export default SignUpForm;