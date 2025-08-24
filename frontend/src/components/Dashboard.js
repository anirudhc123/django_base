import React from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const Dashboard = ({ onLogout }) => {
  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h1 className="text-3xl">User Dashboard</h1>
        <button onClick={onLogout} className="bg-red-500 text-white p-2">Logout</button>
      </div>
      <TaskForm />
      <TaskList />
    </div>
  );
};

export default Dashboard;