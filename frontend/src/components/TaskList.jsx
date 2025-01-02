import React, { useState, useEffect } from 'react';
import './TaskList.css'; // Ensure correct path

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
      if (!token) {
        throw new Error('No authorization token found');
      }

      const response = await fetch('https://task-586i.onrender.com/api/tasks/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data); // Update tasks state with the fetched data
    } catch (error) {
      console.error(error);
      setError(error.message); // Set the error message if the fetch fails
    } finally {
      setLoading(false); // Set loading to false after the request is done
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when the component mounts
  }, []);

  // Render tasks
  const renderTasks = () => {
    if (loading) {
      return <p>Loading tasks...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (tasks.length === 0) {
      return <p>No tasks available.</p>;
    }

    return tasks.map((task) => (
      <div key={task._id} className="task-item">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description}</p>
        <p className="task-due-date"><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
        <p className="task-status"><strong>Status:</strong> {task.status}</p>
      </div>
    ));
  };

  return (
    <div className="task-list">
      <h3>Your Tasks</h3>
      <div>{renderTasks()}</div>
    </div>
  );
};

export default TaskList;
