import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from './utils/axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/accounts/login/', {
        email,
        password,
      });
      const { access, refresh, role } = res.data;
      if (!access || !refresh || !access.includes('.') || !refresh.includes('.')) {
        throw new Error('Invalid token format received');
      }
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      console.log('Stored tokens:', { access: access.slice(0, 20) + '...', refresh: refresh.slice(0, 20) + '...' });
      onLogin(access, role);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Invalid email or password';
      setError(errorMessage);
      console.error('Login error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2">
            Login
          </button>
        </form>
        <p className="mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;