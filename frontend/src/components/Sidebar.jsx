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

export default function Sidebar() {
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

  useEffect(() => {
    // Create snowflakes on component mount
    const snowflakeContainer = document.querySelector('.snowflakes');
    const snowflakeCount = 7; // Reduced number of snowflakes to 15

    for (let i = 0; i < snowflakeCount; i++) {
      const snowflake = document.createElement('span');
      snowflake.classList.add('snowflake');
      snowflake.textContent = '❄'; // Snowflake character
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`;
      snowflake.style.animationDelay = `${Math.random() * 5}s`;
      snowflakeContainer.appendChild(snowflake);
    }
  }, []);

  return (
    <div className="relative flex h-full flex-col w-64" style={{ backgroundColor: '#158380' }}>
      <div className="snowflakes"></div> {/* Snowflakes container */}
      <div className="flex h-16 items-center px-4">
        <h1 className="text-white text-xl font-bold">Task Manager</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
          className="text-white bg-red-600 p-2 rounded-md w-full flex items-center justify-center"
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
