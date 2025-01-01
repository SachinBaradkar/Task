// Sidebar.jsx
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline'; // Importing the icons
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './SnowflakeAnimation.css';

export default function Sidebar({ theme }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/Dashboard' },
    { name: 'Tasks', icon: ClipboardDocumentListIcon, href: '/Tasks' },
    { name: 'Analytics', icon: ChartBarIcon, href: '/Analytics' },
    { name: 'Upload Files', icon: DocumentArrowUpIcon, href: '/UploadFiles' },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No token found. Please log in again.');
        navigate('/'); // Redirect to login if token is missing
        return;
      }

      // Make the logout request
      const response = await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === 'Logged out successfully') {
        toast.success('You are logged out successfully.');
        navigate('/', { state: { successMessage: 'You are successfully Logged Out!' } }); // Pass success message to login page
        localStorage.removeItem('authToken'); // Clear token from localStorage
      } else {
        toast.error('Failed to log out.');
      }
    } catch (error) {
      console.error('Error during logout:', error);

      // Clear session and redirect if unauthorized
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken'); // Clear invalid token
        toast.error('Session expired. Please log in again.');
        navigate('/'); // Redirect to login
      } else {
        toast.error('An error occurred during logout.');
      }
    }
  };

  const sidebarBackground = theme === 'light' ? '#158380' : '#1a202c'; // Light: #158380, Dark: #1a202c
  const textColor = theme === 'light' ? 'text-white' : 'text-gray-300';
  const hoverColor = theme === 'light' ? 'hover:bg-green-700' : 'hover:bg-gray-700 hover:text-white';
  const activeBgColor = theme === 'light' ? 'bg-green-800' : 'bg-gray-900';
  const activeTextColor = 'text-white'; // Always white text for active items

  return (
    <div
      className="relative flex h-full flex-col w-64"
      style={{ backgroundColor: sidebarBackground }}
    >
      <div className="snowflakes"></div> {/* Snowflakes container */}

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                ? `${activeBgColor} ${activeTextColor}`
                : `${textColor} ${hoverColor}`
                }`}
            >
              <item.icon className="mr-3 h-6 w-6 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 py-2">
        <button
          className={`p-2 rounded-md w-full flex items-center justify-center bg-red-600 ${textColor}`}
          onClick={handleLogout}
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-2" />
          Logout
        </button>
      </div>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}
