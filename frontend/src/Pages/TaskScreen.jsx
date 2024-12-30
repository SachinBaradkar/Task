import React, { useState } from "react";
import { format } from "date-fns";
import Sidebar from "../Components/Sidebar";

function TaskScreen() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete dashboard design",
      assignee: "Rohit Raut",
      status: "In Progress",
      priority: "High",
      dueDate: new Date(2024, 0, 15),
    },
    {
      id: 2,
      title: "Implement authentication",
      assignee: "Tanvi Suryawanshi",
      status: "Pending",
      priority: "Medium",
      dueDate: new Date(2024, 0, 20),
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    status: "Pending",
    priority: "Low",
    dueDate: "",
  });

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in progress":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Add a new task
  const addTask = () => {
    if (newTask.title && newTask.assignee && newTask.dueDate) {
      setTasks([
        ...tasks,
        { ...newTask, id: Date.now(), dueDate: new Date(newTask.dueDate) },
      ]);
      setNewTask({ title: "", assignee: "", status: "Pending", priority: "Low", dueDate: "" });
    }
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
     <div className="flex h-screen bg-gray-100">
        <Sidebar />
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Task Manager</h1>

        {/* Add Task Form */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Add New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Task Title"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              placeholder="Assignee"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addTask}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>

        {/* Task List */}
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-medium text-gray-900">{task.title}</p>
                <p className="text-sm text-gray-500">{task.assignee}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
                <span className="text-sm text-gray-500">
                  {format(task.dueDate, "MMM d, yyyy")}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}

export default TaskScreen;
