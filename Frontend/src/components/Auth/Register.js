import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file

const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
      username
    }
  }
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerUser, { error }] = useMutation(REGISTER_USER);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await registerUser({ variables: { username, email, password } });
      console.log('Registration successful:', data);
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err.message);
      alert(`Registration failed: ${err.message}`);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label className="register-label">
          Username:
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="register-input" 
          />
        </label>
        <label className="register-label">
          Email:
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="register-input" 
          />
        </label>
        <label className="register-label">
          Password:
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="register-input" 
          />
        </label>
        <button type="submit" className="register-button">Register</button>
        {error && <p className="register-error">Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default Register;
