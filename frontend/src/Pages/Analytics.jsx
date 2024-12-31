import React from "react";
import Sidebar from "../Components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";

const weeklyData = [
  { day: "Mon", Completed: 4, "In Progress": 2, Pending: 1 },
  { day: "Tue", Completed: 8, "In Progress": 4, Pending: 2 },
  { day: "Wed", Completed: 6, "In Progress": 2, Pending: 3 },
  { day: "Thu", Completed: 7, "In Progress": 3, Pending: 4 },
  { day: "Fri", Completed: 7, "In Progress": 3, Pending: 2 },
];

const monthlyData = [
  { month: "Jan", Completed: 120, "In Progress": 30, Pending: 20 },
  { month: "Feb", Completed: 100, "In Progress": 40, Pending: 15 },
  { month: "Mar", Completed: 130, "In Progress": 20, Pending: 25 },
  { month: "Apr", Completed: 150, "In Progress": 25, Pending: 30 },
  { month: "May", Completed: 140, "In Progress": 30, Pending: 20 },
  { month: "Jun", Completed: 160, "In Progress": 35, Pending: 25 },
];

const Analytics = () => {
  const downloadAsPdf = (data, title, filename) => {
    const doc = new jsPDF();
    doc.text(title, 10, 10);

    const tableData = [
      ["Category", "Completed", "In Progress", "Pending"],
      ...data.map((item) =>
        title.includes("Weekly")
          ? [item.day, item.Completed, item["In Progress"], item.Pending]
          : [item.month, item.Completed, item["In Progress"], item.Pending]
      ),
    ];

    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
    });

    doc.save(`${filename}.pdf`);
  };

  const downloadAsCsv = (data, title, filename) => {
    const csvHeader = ["Category", "Completed", "In Progress", "Pending"];
    const csvRows = data.map((item) =>
      title.includes("Weekly")
        ? [item.day, item.Completed, item["In Progress"], item.Pending]
        : [item.month, item.Completed, item["In Progress"], item.Pending]
    );

    const csvContent = [csvHeader, ...csvRows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="analytics-container">
        <h2>Task Analytics</h2>
        <div className="analytics-charts">
          {/* Weekly Progress - Bar Chart */}
          <div className="chart-container">
            <h3>Weekly Task Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Completed" stackId="a" fill="#4caf50" />
                <Bar dataKey="In Progress" stackId="a" fill="#6a1b9a" />
                <Bar dataKey="Pending" stackId="a" fill="#ffb300" />
              </BarChart>
            </ResponsiveContainer>
            <div className="button-container">
              <button onClick={() => downloadAsPdf(weeklyData, "Weekly Task Status", "Weekly_Task_Status")}>
                Download Weekly PDF
              </button>
              <button onClick={() => downloadAsCsv(weeklyData, "Weekly Task Status", "Weekly_Task_Status")}>
                Download Weekly CSV
              </button>
            </div>
          </div>

          {/* Monthly Progress - Line Chart */}
          <div className="chart-container">
            <h3>Monthly Task Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Completed" stroke="#4caf50" />
                <Line type="monotone" dataKey="In Progress" stroke="#6a1b9a" />
                <Line type="monotone" dataKey="Pending" stroke="#ffb300" />
              </LineChart>
            </ResponsiveContainer>
            <div className="button-container">
              <button onClick={() => downloadAsPdf(monthlyData, "Monthly Task Status", "Monthly_Task_Status")}>
                Download Monthly PDF
              </button>
              <button onClick={() => downloadAsCsv(monthlyData, "Monthly Task Status", "Monthly_Task_Status")}>
                Download Monthly CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
