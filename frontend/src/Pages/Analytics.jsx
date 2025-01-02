import React, { useState, useEffect } from "react";
// import Sidebar from "../Components/Sidebar";
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
import { jsPDF } from "jspdf";
import Papa from "papaparse";

export default function Analytics({ theme }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [statisticsData, setStatisticsData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

      const response = await fetch("https://task-586i.onrender.com/api/tasks/weekly-analysis", {
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

      const response = await fetch("https://task-586i.onrender.com/api/tasks/statistics", {
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

      const response = await fetch("https://task-586i.onrender.com/api/tasks/overview", {
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

  const downloadCSV = () => {
    const allData = [
      ...weeklyData.map((d) => ({ category: "Weekly", ...d })),
      ...statisticsData.map((d) => ({ category: "Statistics", ...d })),
      ...monthlyData.map((d) => ({ category: "Monthly", ...d })),
    ];
    const csv = Papa.unparse(allData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "analytics_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Analytics Data", 10, 10);

    let y = 20;

    // Weekly Data
    doc.text("Weekly Data:", 10, y);
    y += 10;
    weeklyData.forEach((item) => {
      doc.text(
        `Name: ${item.name}, Completed: ${item.completed}, In Progress: ${item.inProgress}, Pending: ${item.pending}`,
        10,
        y
      );
      y += 10;
    });

    // Statistics Data
    y += 10;
    doc.text("Statistics Data:", 10, y);
    y += 10;
    statisticsData.forEach((item) => {
      doc.text(`Name: ${item.name}, Count: ${item.count}`, 10, y);
      y += 10;
    });

    // Monthly Data
    y += 10;
    doc.text("Monthly Data:", 10, y);
    y += 10;
    monthlyData.forEach((item) => {
      doc.text(`Month: ${item.month}, Created: ${item.created}, Completed: ${item.completed}`, 10, y);
      y += 10;
    });

    doc.save("analytics_data.pdf");
  };

  const themeColors = theme === "dark" ? {
    background: "bg-gray-800",
    text: "text-white",
    border: "border-gray-700",
    chartBar1: "#10B981", // green
    chartBar2: "#3B82F6", // blue
    chartBar3: "#F59E0B", // yellow
    chartLine1: "#3B82F6", // blue
    chartLine2: "#10B981", // green
    chartRadar1: "#10B981", // green
    chartRadar2: "#3B82F6", // blue
    chartRadar3: "#F59E0B"  // yellow
  } : {
    background: "bg-gray-100",
    text: "text-gray-900",
    border: "border-gray-300",
    chartBar1: "#10B981", // green
    chartBar2: "#3B82F6", // blue
    chartBar3: "#F59E0B", // yellow
    chartLine1: "#3B82F6", // blue
    chartLine2: "#10B981", // green
    chartRadar1: "#10B981", // green
    chartRadar2: "#3B82F6", // blue
    chartRadar3: "#F59E0B"  // yellow
  };

  return (
    <div className={`flex h-screen ${themeColors.background}`}>
      <Sidebar theme={theme} />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`border ${themeColors.border} rounded p-2`}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`border ${themeColors.border} rounded p-2`}
          />
          <button onClick={downloadCSV} className="bg-blue-500 text-white p-2 rounded">
            Download CSV
          </button>
          <button onClick={downloadPDF} className="bg-green-500 text-white p-2 rounded">
            Download PDF
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <p>Loading analytics...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <>
              {/* Weekly Task Status */}
              <div className="mb-8">
                <h4 className={`text-md font-medium ${themeColors.text} mb-2`}>Weekly Task Status</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill={themeColors.chartBar1} name="Completed" />
                      <Bar dataKey="inProgress" fill={themeColors.chartBar2} name="In Progress" />
                      <Bar dataKey="pending" fill={themeColors.chartBar3} name="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Task Summary */}
              <div className="mb-8">
                <h4 className={`text-md font-medium ${themeColors.text} mb-2`}>Task Summary</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statisticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill={themeColors.chartBar1} name="Tasks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Overview */}
              <div className="mb-8">
                <h4 className={`text-md font-medium ${themeColors.text} mb-2`}>Monthly Task Overview</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line dataKey="created" stroke={themeColors.chartLine1} name="Created Tasks" />
                      <Line dataKey="completed" stroke={themeColors.chartLine2} name="Completed Tasks" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Task Distribution */}
              <div className="mb-8">
                <h4 className={`text-md font-medium ${themeColors.text} mb-2`}>Task Distribution</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="80%" width={730} height={250} data={statisticsData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} />
                      <Radar
                        name="Completed Tasks"
                        dataKey="count"
                        stroke={themeColors.chartRadar1}
                        fill={themeColors.chartRadar1}
                        fillOpacity={0.6}
                      />
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
