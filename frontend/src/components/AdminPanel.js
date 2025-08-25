
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = ({ onLogout }) => {
  const [stats, setStats] = useState({});
  const [error, setError] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    try {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) throw new Error('No refresh token found.');
      const response = await axios.post('token/refresh/', { refresh }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const newAccessToken = response.data.access;
      localStorage.setItem('access', newAccessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      console.log('New Access Token:', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Refresh Token Error:', error.response?.data || error.message);
      setError('Session expired. Please log in again.');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setIsRedirecting(true);
      navigate('/login');
      return null;
    }
  }, [navigate]);

  const fetchStats = useCallback(async () => {
    if (isRedirecting) return;
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        setError('No access token found. Please log in.');
        setIsRedirecting(true);
        navigate('/login');
        return;
      }
      const response = await axios.get('admin_panel/stats/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Stats Response:', response.data);
      setStats(response.data);
      setError(null);
    } catch (error) {
      console.error('Fetch Stats Error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch stats.';
      setError(errorMessage);
      if (error.response?.status === 403) {
        setError('You do not have permission to access this page.');
        setIsRedirecting(true);
        navigate('/login');
      } else if (error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            const response = await axios.get('admin_panel/stats/', {
              headers: {
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application/json',
              },
            });
            console.log('Stats Response after refresh:', response.data);
            setStats(response.data);
            setError(null);
          } catch (retryError) {
            console.error('Retry Error:', retryError.response?.data || retryError.message);
            setError(retryError.response?.data?.detail || 'Failed to fetch stats after refresh.');
            setIsRedirecting(true);
            navigate('/login');
          }
        }
      }
    }
  }, [isRedirecting, navigate]);

  useEffect(() => {
    if (!isRedirecting) {
      console.log('Running useEffect to fetch stats');
      fetchStats();
    }
  }, [fetchStats, isRedirecting]);

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h1 className="text-3xl">Admin Panel</h1>
        <button onClick={onLogout} className="bg-red-500 text-white p-2">Logout</button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-8">
        <p>Registered Users: {stats.registered_users || 'N/A'}</p>
        <p>Active Tasks: {stats.active_tasks || 'N/A'}</p>
        <h2 className="text-2xl mt-4">Users vs Tasks</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th>Username</th>
              <th>Task Count</th>
            </tr>
          </thead>
          <tbody>
            {stats.users_vs_tasks && stats.users_vs_tasks.length > 0 ? (
              stats.users_vs_tasks.map((item, index) => (
                <tr key={index}>
                  <td>{item.username}</td>
                  <td>{item.task_count}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;