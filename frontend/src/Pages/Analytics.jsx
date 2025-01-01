import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import "./Analytics.css";

export default function Analytics({ theme }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [statisticsData, setStatisticsData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeeklyAnalytics();
    fetchStatistics();
    fetchMonthlyOverview();
  }, []);

  const fetchWeeklyAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const response = await fetch("http://localhost:5000/api/tasks/weekly-analysis", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const analyticsData = await response.json();
      const formattedWeeklyData = Object.entries(analyticsData).map(([day, stats]) => ({
        name: day,
        completed: stats.completed || 0,
        inProgress: stats.inProgress || 0,
        pending: stats.pending || 0,
      }));

      setWeeklyData(formattedWeeklyData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const response = await fetch("http://localhost:5000/api/tasks/statistics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const statistics = await response.json();
      const formattedStatisticsData = [
        { name: "Total Tasks", count: statistics.totalTasks || 0 },
        { name: "Completed Tasks", count: statistics.completedTasks || 0 },
        { name: "Pending Tasks", count: statistics.pendingTasks || 0 },
      ];

      setStatisticsData(formattedStatisticsData);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchMonthlyOverview = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const response = await fetch("http://localhost:5000/api/tasks/overview", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const overview = await response.json();
      const createdTasks = overview.createdTasks.map((task) => ({
        month: task._id,
        created: task.count,
        completed: 0,
      }));

      if (overview.completedTasks.length > 0) {
        overview.completedTasks.forEach((task) => {
          const match = createdTasks.find((item) => item.month === task._id);
          if (match) match.completed = task.count;
        });
      }

      setMonthlyData(createdTasks);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`flex h-screen ${theme === "light" ? "bg-gray-100" : "bg-gray-900"}`}>
      <Sidebar theme={theme} />
      <div className={`flex-1 overflow-y-auto p-8 ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>
        <h3 className={`text-lg font-medium leading-6 mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"
          }`}>Task Analytics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <p>Loading analytics...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <>
              {/* Weekly Task Status */}
              <div className="mb-8">
                <h4 className="text-md font-medium mb-2">Weekly Task Status</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#ccc" : "#444"} />
                      <XAxis dataKey="name" stroke={theme === "light" ? "#000" : "#fff"} />
                      <YAxis stroke={theme === "light" ? "#000" : "#fff"} />
                      <Tooltip contentStyle={{ backgroundColor: theme === "light" ? "#fff" : "#333", color: theme === "light" ? "#000" : "#fff" }} />
                      <Legend wrapperStyle={{ color: theme === "light" ? "#000" : "#fff" }} />
                      <Bar dataKey="completed" fill="#10B981" name="Completed" />
                      <Bar dataKey="inProgress" fill="#3B82F6" name="In Progress" />
                      <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Task Summary */}
              <div className="mb-8">
                <h4 className="text-md font-medium mb-2">Task Summary</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statisticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#ccc" : "#444"} />
                      <XAxis dataKey="name" stroke={theme === "light" ? "#000" : "#fff"} />
                      <YAxis stroke={theme === "light" ? "#000" : "#fff"} />
                      <Tooltip contentStyle={{ backgroundColor: theme === "light" ? "#fff" : "#333", color: theme === "light" ? "#000" : "#fff" }} />
                      <Legend wrapperStyle={{ color: theme === "light" ? "#000" : "#fff" }} />
                      <Bar dataKey="count" fill="#6366F1" name="Tasks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Overview */}
              <div className="mb-8">
                <h4 className="text-md font-medium mb-2">Monthly Task Overview</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#ccc" : "#444"} />
                      <XAxis dataKey="month" stroke={theme === "light" ? "#000" : "#fff"} />
                      <YAxis stroke={theme === "light" ? "#000" : "#fff"} />
                      <Tooltip contentStyle={{ backgroundColor: theme === "light" ? "#fff" : "#333", color: theme === "light" ? "#000" : "#fff" }} />
                      <Legend wrapperStyle={{ color: theme === "light" ? "#000" : "#fff" }} />
                      <Line dataKey="created" stroke="#3B82F6" name="Created Tasks" />
                      <Line dataKey="completed" stroke="#10B981" name="Completed Tasks" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Task Distribution */}
              <div className="mb-8">
                <h4 className="text-md font-medium mb-2">Weekly Task Distribution</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={weeklyData}>
                      <PolarGrid stroke={theme === "light" ? "#ccc" : "#444"} />
                      <PolarAngleAxis dataKey="name" stroke={theme === "light" ? "#000" : "#fff"} />
                      <PolarRadiusAxis stroke={theme === "light" ? "#000" : "#fff"} />
                      <Radar
                        name="Completed"
                        dataKey="completed"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="In Progress"
                        dataKey="inProgress"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Pending"
                        dataKey="pending"
                        stroke="#F59E0B"
                        fill="#F59E0B"
                        fillOpacity={0.6}
                      />
                      <Legend wrapperStyle={{ color: theme === "light" ? "#000" : "#fff" }} />
                    </RadarChart>

                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
