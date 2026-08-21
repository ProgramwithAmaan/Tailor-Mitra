import React, { useState, useEffect } from 'react';
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiCreditCard,
  FiSettings,
} from 'react-icons/fi';

const BottomNav = () => {
  const [showBottomNav, setShowBottomNav] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortrait = height > width;
      const shouldShow = width < 768 || (width < 1024 && isPortrait);
      setShowBottomNav(shouldShow);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('orientationchange', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', checkScreenSize);
    };
  }, []);

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/customers', icon: FiUsers, label: 'Customers' },
    { path: '/orders', icon: FiPackage, label: 'Orders' },
    { path: '/payments', icon: FiCreditCard, label: 'Payments' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  const getActiveClass = (path) => {
    const currentPath = window.location.pathname;
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  if (!showBottomNav) {
    return null;
  }

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 px-2 sm:px-4 py-2 w-[92%] max-w-md">
      <div className="flex items-center justify-around w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = getActiveClass(item.path);

          return (
            <div
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center justify-center py-1 px-1 sm:px-2 min-h-[44px] min-w-[44px] flex-1 relative group cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${
                    active
                      ? 'text-[#C96B1D] dark:text-blue-400 scale-110'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-[#C96B1D] dark:group-hover:text-blue-400'
                  }`}
                />
                {active && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#C96B1D] dark:bg-blue-400 rounded-full shadow-lg shadow-[#C96B1D]/30" />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-1 font-medium transition-colors duration-200 ${
                  active
                    ? 'text-[#C96B1D] dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-[#C96B1D] dark:group-hover:text-blue-400'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;






