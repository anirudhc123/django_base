import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`tasks/${id}/`);
      fetchTasks();
    } catch (err) {
      console.error(err);
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
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.status}</td>
              <td>{task.time_taken}</td>
              <td>{task.due_date}</td>
              <td>
                <button onClick={() => handleDelete(task.id)} className="bg-red-500 text-white p-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;