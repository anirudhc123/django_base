import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

axios.defaults.baseURL = 'http://localhost:8000/api/';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ role: decoded.role });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem('access', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ role });
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={user ? (user.role === 'user' ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/admin" />) : <Navigate to="/login" />} />
          <Route path="/admin" element={user ? (user.role === 'admin' ? <AdminPanel onLogout={handleLogout} /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;