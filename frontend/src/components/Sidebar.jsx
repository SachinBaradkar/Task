import React from 'react';
import { HomeIcon, ChartBarIcon, ClipboardDocumentListIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useLocation, Link } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/Dashboard' },
    { name: 'Tasks', icon: ClipboardDocumentListIcon, href: '/Tasks' },
    { name: 'Analytics', icon: ChartBarIcon, href: '/Analytics' },
    { name: 'Logout', icon: ArrowLeftOnRectangleIcon, href: '/Logout' },
  ];

  return (
    <div className="flex h-full flex-col w-64" style={{ backgroundColor: '#158380' }}>
      <div className="flex h-16 items-center px-4">
        <h1 className="text-white text-xl font-bold">Task Manager</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href; // Check if the current route matches the item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon
                className="mr-3 h-6 w-6 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}