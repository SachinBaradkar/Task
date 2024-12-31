import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { HomeIcon, ClipboardDocumentListIcon, ChartBarIcon } from '@heroicons/react/24/outline'; // Importing the icons
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/Dashboard' },
    { name: 'Tasks', icon: ClipboardDocumentListIcon, href: '/Tasks' },
    { name: 'Analytics', icon: ChartBarIcon, href: '/Analytics' },
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

      if (response.data.message === 'Logout successful') {
        localStorage.removeItem('authToken');
        toast.success('You are logged out successfully.');
        navigate('/'); // Navigate to login after successful logout
      } else {
        toast.error('Failed to log out.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Unauthorized. Please log in again.');
        navigate('/'); // Redirect to login if unauthorized
      } else {
        toast.error('An error occurred during logout.');
      }
    }
  };

  return (
    <div className="flex h-full flex-col w-64" style={{ backgroundColor: '#158380' }}>
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
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
