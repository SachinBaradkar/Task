// Dashboard.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Importing useLocation
// import Sidebar from "../Components/Sidebar";
import Sidebar from "../Components/Sidebar";
import Summary from "../Components/Summary";
import TaskList from "../Components/TaskList";
import Analytics from "../Components/Analytics";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css";

function Dashboard({ theme }) {
  const location = useLocation(); // Accessing the location object
  const successMessage = location.state?.successMessage || "";

  // Show success message if it exists
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { autoClose: 3000 }); // Displaying toast message
    }
  }, [successMessage]); // Dependency array includes successMessage

  return (
    <div className={`flex h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <Sidebar theme={theme} /> {/* Pass theme prop to Sidebar */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="space-y-8">
          <Summary />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-[400px] overflow-hidden">
              <TaskList />
            </div>
            <div className="h-[400px] overflow-hidden">
              <Analytics />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
