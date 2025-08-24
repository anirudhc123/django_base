import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('To Do');
  const [timeTaken, setTimeTaken] = useState(0);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('tasks/', { name, status, time_taken: timeTaken, due_date: dueDate });
      // Refresh list or clear form
      setName('');
      setStatus('To Do');
      setTimeTaken(0);
      setDueDate('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl mb-4">Create Task</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Task Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border mr-2" required />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border mr-2">
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <input type="number" placeholder="Time Taken (min)" value={timeTaken} onChange={(e) => setTimeTaken(e.target.value)} className="p-2 border mr-2" required />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="p-2 border mr-2" />
        <button type="submit" className="bg-blue-500 text-white p-2">Create</button>
      </form>
    </div>
  );
};

export default TaskForm;