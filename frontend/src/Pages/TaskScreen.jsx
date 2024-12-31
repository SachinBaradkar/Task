import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Sidebar from "../components/Sidebar";

function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // To toggle the add task form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [taskToUpdate, setTaskToUpdate] = useState(null); // Task selected for update
  const [updatedTask, setUpdatedTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending", // Default status
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const userId = "676ea46c6759cb75b8acbd5b"; // Replace with the actual user ID logic if dynamic
      const taskToSend = {
        ...newTask,
        createdBy: userId, // Add createdBy field
      };

      // Log the task being sent for debugging
      console.log("Task being sent:", taskToSend);

      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const addedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, addedTask]);
      setShowForm(false); // Close the form
      setNewTask({ title: "", description: "", dueDate: "" }); // Reset form
    } catch (error) {
      console.error("Error adding task:", error.message);
      setError(error.message);
    }
  };

  const handleUpdateTask = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`http://localhost:5000/api/tasks/${taskToUpdate._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedTaskData = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTaskData._id ? updatedTaskData : task
        )
      );
      setTaskToUpdate(null); // Close the update form
      setUpdatedTask({
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
      }); // Reset update form
    } catch (error) {
      console.error("Error updating task:", error.message);
      setError(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Task Manager</h1>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600"
          >
            Add Task
          </button>

          {/* Add Task Form */}
          {showForm && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Add New Task</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddTask();
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="w-full border rounded-lg p-2"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Update Task Form */}
          {taskToUpdate && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Update Task</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateTask();
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-700">Title</label>
                  <input
                    type="text"
                    value={updatedTask.title}
                    onChange={(e) =>
                      setUpdatedTask({ ...updatedTask, title: e.target.value })
                    }
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    value={updatedTask.description}
                    onChange={(e) =>
                      setUpdatedTask({
                        ...updatedTask,
                        description: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Due Date</label>
                  <input
                    type="date"
                    value={updatedTask.dueDate}
                    onChange={(e) =>
                      setUpdatedTask({
                        ...updatedTask,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Status</label>
                  <select
                    value={updatedTask.status}
                    onChange={(e) =>
                      setUpdatedTask({ ...updatedTask, status: e.target.value })
                    }
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Update Task
                </button>
                <button
                  onClick={() => setTaskToUpdate(null)}
                  className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <p>Loading tasks...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : tasks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      Due Date: {format(new Date(task.dueDate), "yyyy-MM-dd")}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {task.status || "Pending"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setTaskToUpdate(task);
                        setUpdatedTask({
                          title: task.title,
                          description: task.description,
                          dueDate: task.dueDate,
                          status: task.status || "Pending",
                        });
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                    >
                      Update
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskScreen;
