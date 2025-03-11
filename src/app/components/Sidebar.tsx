'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [username, setUsername] = useState('');  
  
  useEffect(() => {
    // Get user data from localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username || 'User');
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
  }, []);  
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    
    // Clear user cookie
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Redirect to login page
    router.push('/login');
  };

  const menuItems = [
    { 
      icon: '/dashboard.svg', 
      label: 'Dashboard', 
      href: '/dashboard',
      description: 'View overall statistics and summaries'
    },
    { 
      icon: '/moi-entries.svg', 
      label: 'Moi Entries', 
      href: '/moi-entries',
      description: 'Manage monetary contributions'
    },
    { 
      icon: '/material-entries.svg', 
      label: 'Material Entries', 
      href: '/material-entries',
      description: 'Track material donations'
    },
    { 
      icon: '/finance.svg', 
      label: 'Finance', 
      href: '/finance',
      description: 'Monitor financial transactions'
    },
    { 
      icon: '/calendar.svg', 
      label: 'Events', 
      href: '/events',
      description: 'Manage and track events'
    },
    { 
      icon: '/download.svg', 
      label: 'Export', 
      href: '/export',
      description: 'Export data and reports'
    }
  ];
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gradient-to-br from-[#FAE9D5] to-[#E5D1B8] shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-between ${isCollapsed && !isHovered ? 'w-16 bg-black/10' : 'w-64'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="Sree Aathi MOITECH"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          {(!isCollapsed || isHovered) && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Sree Aathi MOITECH
            </span>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl pr-2">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-all duration-200 ease-in-out ${isCollapsed && !isHovered ? 'justify-center' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                    className="min-w-[20px]"
                  />
                </div>
                {(!isCollapsed || isHovered) && (
                  <div className="flex-1 transition-opacity duration-200">
                    <span className="block text-gray-700 font-medium">{item.label}</span>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200/10">
        <div className={`flex items-center ${isCollapsed && !isHovered ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 rounded-full bg-gray-200/50 flex items-center justify-center overflow-hidden flex-shrink-0">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          {(!isCollapsed || isHovered) && (
            <div className="flex-1 transition-opacity duration-200">
              <p className="text-sm font-medium text-gray-700">{username}</p>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-50"
      >
        <svg
          className={`w-4 h-4 text-gray-600 transform transition-transform ${isCollapsed && !isHovered ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}