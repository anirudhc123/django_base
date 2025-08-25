import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('No access token found.');
        return;
      }
      const response = await axios.get('tasks/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Tasks Response:', response.data);
      setTasks(response.data);
    } catch (err) {
      console.error('Fetch Tasks Error:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('No access token found.');
        return;
      }
      await axios.delete(`tasks/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(`Deleted task with id: ${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Delete Task Error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl mb-4">Your Tasks</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Time Taken (min)</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.status}</td>
                <td>{task.time_taken || 'N/A'}</td>
                <td>{task.due_date || 'N/A'}</td>
                <td>
                  <button onClick={() => handleDelete(task.id)} className="bg-red-500 text-white p-1">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No tasks available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;