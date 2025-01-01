import React, { useState, useEffect } from "react";
import { format } from "date-fns";

import Sidebar from "../Components/Sidebar";

function TaskScreen({ theme }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [updatedTask, setUpdatedTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
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

      const response = await fetch("https://task-586i.onrender.com/api/tasks", {
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
        createdBy: userId,
      };

      const response = await fetch("https://task-586i.onrender.com/api/tasks", {
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
      setShowForm(false);
      setNewTask({ title: "", description: "", dueDate: "" });
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

      const response = await fetch(`https://task-586i.onrender.com/api/tasks/${taskToUpdate._id}`, {
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
      setTaskToUpdate(null);
      setUpdatedTask({
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
      });
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

      const response = await fetch(`https://task-586i.onrender.com/api/tasks/${id}`, {
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
    <div
      className={`flex h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
    >
      <Sidebar theme={theme} />
      <div className={`flex-1 overflow-y-auto p-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <div className={`max-w-3xl mx-auto shadow-md rounded-lg p-6 ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>
          <h1 className="text-2xl font-bold mb-6">
            Task Manager
          </h1>

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
                  <label className="block">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className={`w-full border rounded-lg p-2 ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-black"}`}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className={`w-full border rounded-lg p-2 ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-black"}`}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className={`w-full border rounded-lg p-2 ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-black"}`}
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
                  <label className="block">Title</label>
                  <input
                    type="text"
                    value={updatedTask.title}
                    onChange={(e) =>
                      setUpdatedTask({ ...updatedTask, title: e.target.value })
                    }
                    className={`w-full border rounded-lg p-2 ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-black"}`}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Description</label>
                  <textarea
                    value={updatedTask.description}
                    onChange={(e) =>
                      setUpdatedTask({
                        ...updatedTask,
                        description: e.target.value,
                      })
                    }
                    className={`w-full border rounded-lg p-2 ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-black"}`}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block">Due Date</label>
                  <input
                    type="date"
                    value={updatedTask.dueDate}
                    onChange={(e) =>
                      setUpdatedTask({
                        ...updatedTask,
                        dueDate: e.target.value,
                      })
                    }
                    className={`w-full border rounded-lg p-2 ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-black"}`}
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Status</label>
                  <select
                    value={updatedTask.status}
                    onChange={(e) =>
                      setUpdatedTask({
                        ...updatedTask,
                        status: e.target.value,
                      })
                    }
                    className={`w-full border rounded-lg p-2 ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-black"}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
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

          {/* Display Tasks */}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`border p-4 rounded-lg ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-black"}`}
                >
                  <div className="flex justify-between items-center">
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: theme === "dark" ? "white" : "black" }}
                    >
                      {task.title}
                    </h3>
                    <div>
                      <button
                        onClick={() => {
                          setTaskToUpdate(task);
                          setUpdatedTask({
                            title: task.title,
                            description: task.description,
                            dueDate: task.dueDate,
                            status: task.status,
                          });
                        }}
                        className="text-blue-500 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-500">{task.description}</p>
                  <p className="text-gray-400">
                    Due: {format(new Date(task.dueDate), "MMMM dd, yyyy")}
                  </p>
                  <p className={`text-${task.status === "Completed" ? "green" : task.status === "Pending" ? "yellow" : "blue"}-500`}>
                    {task.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskScreen;
