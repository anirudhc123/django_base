import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ onLogout }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('admin_panel/stats/');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h1 className="text-3xl">Admin Panel</h1>
        <button onClick={onLogout} className="bg-red-500 text-white p-2">Logout</button>
      </div>
      <div className="mt-8">
        <p>Registered Users: {stats.registered_users}</p>
        <p>Active Tasks: {stats.active_tasks}</p>
        <h2 className="text-2xl mt-4">Users vs Tasks</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th>Username</th>
              <th>Task Count</th>
            </tr>
          </thead>
          <tbody>
            {stats.users_vs_tasks && stats.users_vs_tasks.map((item, index) => (
              <tr key={index}>
                <td>{item.username}</td>
                <td>{item.task_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;