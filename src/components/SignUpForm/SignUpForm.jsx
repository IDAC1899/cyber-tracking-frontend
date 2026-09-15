// src/components/SignUpForm/SignUpForm.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
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

  return (
    <main className='auth-page'>
      <h1>Sign Up</h1>
      {message && <p className='error-message'>{message}</p>}
      <div className='auth-card'>
        <form onSubmit={handleSubmit}>
          <div className='auth-field'>
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              id='username'
              value={username}
              name='username'
              onChange={handleChange}
              required
            />
          </div>
          <div className='auth-field'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              value={name}
              name='name'
              onChange={handleChange}
              required
            />
          </div>
          <div className='auth-field'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={email}
              name='email'
              onChange={handleChange}
              required
            />
          </div>
          <div className='auth-field'>
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              value={password}
              name='password'
              onChange={handleChange}
              required
            />
          </div>
          <div className='auth-field'>
            <label htmlFor='confirm'>Confirm Password:</label>
            <input
              type='password'
              id='confirm'
              value={passwordConf}
              name='passwordConf'
              onChange={handleChange}
              required
            />
          </div>
          <div className='auth-actions'>
            <button className='btn-primary' disabled={isFormInvalid()}>Sign Up</button>
            <button type='button' className='btn-link' onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignUpForm;