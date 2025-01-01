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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Analytics() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [statisticsData, setStatisticsData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeeklyAnalytics();
    fetchStatistics();
    fetchMonthlyOverview();
    fetchPieChartData(); // Fetching data for the pie chart
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
        completed: 0, // Default value in case no data is available
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

  const fetchPieChartData = async () => {
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

      const pieData = await response.json();
      const formattedPieData = [
        { name: "Completed", value: pieData.completed || 0 },
        { name: "In Progress", value: pieData.inProgress || 0 },
        { name: "Pending", value: pieData.pending || 0 },
      ];

      setPieChartData(formattedPieData);
    } catch (error) {
      setError(error.message);
    }
  };

  const downloadCsv = async (startDate, endDate) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const response = await fetch(
        `http://localhost:5000/api/tasks/report/csv?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Task_Report_${startDate}_to_${endDate}.csv`;
      link.click();
    } catch (error) {
      setError(error.message);
    }
  };

  const downloadPdf = async (startDate, endDate) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const response = await fetch(
        `http://localhost:5000/api/tasks/report/pdf?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Task_Report_${startDate}_to_${endDate}.pdf`;
      link.click();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Task Analytics</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <p>Loading analytics...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <>
            {/* Weekly Task Status */}
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-700 mb-2">Weekly Task Status</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" />
                    <Bar dataKey="inProgress" fill="#3B82F6" name="In Progress" />
                    <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Task Summary */}
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-700 mb-2">Task Summary</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statisticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#6366F1" name="Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Overview */}
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-700 mb-2">Monthly Task Overview</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="created" stroke="#10B981" name="Created" />
                    <Line type="monotone" dataKey="completed" stroke="#3B82F6" name="Completed" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart for Weekly Task Analysis */}
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-700 mb-2">Weekly Task Distribution</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Legend />
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "#10B981" : index === 1 ? "#3B82F6" : "#F59E0B"} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* File Downloads */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Download Reports</h4>
              <button
                className="mr-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => downloadCsv("2024-01-01", "2024-12-31")}
              >
                Download CSV
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => downloadPdf("2024-01-01", "2024-12-31")}
              >
                Download PDF
              </button>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
