import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUsers, FiPackage, FiCreditCard, FiCalendar, 
  FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX,
  FiChevronLeft, FiChevronRight, FiSun, FiMoon,
  FiScissors
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, darkMode, setDarkMode } = useApp();

  // Check screen size for mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard', id: 'dashboard' },
    { path: '/customers', icon: FiUsers, label: 'Customers', id: 'customers' },
    { path: '/orders', icon: FiPackage, label: 'Orders', id: 'orders' },
    { path: '/payments', icon: FiCreditCard, label: 'Payments', id: 'payments' },
    { path: '/settings', icon: FiSettings, label: 'Settings', id: 'settings' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // If on mobile or tablet, render only children with mobile sidebar (hidden initially)
  if (isMobileOrTablet) {
    return (
      <>
        {/* Mobile Hamburger Button - Hidden by default, can be toggled if needed */}
        {/* Commented out to hide it completely on mobile/tablet */}
        {/* <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 p-2.5 bg-blue-900/90 backdrop-blur-xl text-white rounded-xl shadow-lg hover:bg-blue-800 transition-all duration-300"
        >
          <FiMenu className="w-5 h-5" />
        </button> */}

        {/* Mobile Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar - Only shows when toggled */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-gradient-to-b from-[#1a1a3e] to-[#0d0d2b] shadow-2xl z-50 flex flex-col overflow-y-auto"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-xl">👔</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-white truncate">
                      {profile?.shopName || 'TailorStudio'}
                    </p>
                    <p className="text-[10px] text-blue-300 truncate">
                      {profile?.name || 'Tailor'}
                    </p>
                  </div>
                </div> 
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-blue-200 transition-all"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
                        active
                          ? 'bg-white/15 text-white shadow-lg'
                          : 'text-blue-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {active && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/30"></span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Bottom Section */}
              <div className="border-t border-white/5 p-4 space-y-2">
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center gap-3 px-4 w-full py-2.5 rounded-xl hover:bg-white/10 text-blue-200 transition-all"
                >
                  {darkMode ? (
                    <FiSun className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  ) : (
                    <FiMoon className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 w-full py-2.5 rounded-xl hover:bg-red-500/20 text-red-300 transition-all"
                >
                  <FiLogOut className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content - No sidebar wrapper on mobile */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </>
    );
  }

  // Desktop Sidebar - Original code for desktop
  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF7F2] dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? '280px' : '72px',
          transition: { duration: 0.3, type: 'spring', stiffness: 200, damping: 25 }
        }}
        className="hidden lg:flex flex-col bg-gradient-to-b from-[#1a1a3e] to-[#0d0d2b] shadow-2xl z-30 flex-shrink-0 overflow-hidden border-r border-white/5 relative"
      >
        {/* Logo Section */}
        <div className={`flex items-center ${isOpen ? 'justify-between px-4' : 'justify-center px-2'} py-4 border-b border-white/5`}>
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-xl">👔</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white truncate">
                  {profile?.shopName || 'TailorStudio'}
                </p>
                <p className="text-[10px] text-blue-300 truncate">
                  {profile?.name || 'Tailor'}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">👔</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center'} py-2.5 rounded-xl mb-1 transition-all duration-200 group ${
                  active
                    ? 'bg-white/15 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${isOpen ? '' : 'w-5 h-5'} flex-shrink-0`} />
                {isOpen && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                    {item.label}
                  </div>
                )}
                {active && isOpen && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 w-1 h-8 bg-blue-400 rounded-r-full shadow-lg shadow-blue-400/30"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className={`border-t border-white/5 p-4 ${isOpen ? 'space-y-2' : 'space-y-2'}`}>
          {/* Settings */}
          {/* <Link
            to="/settings"
            className={`flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center'} w-full py-2.5 rounded-xl hover:bg-white/10 text-blue-200 transition-all duration-200`}
          >
            <FiSettings className="w-5 h-5 flex-shrink-0" />
            {isOpen && (
              <span className="text-sm font-medium">Settings</span>
            )}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                Settings
              </div>
            )}
          </Link> */}

            <div className="mt-auto px-5 py-4 border-t border-gray-200">
  <p className="text-[11px] text-gray-400">
    Made by <strong style={{ color: '#79f909' }}>Amaan Saifi</strong><h5>All rights are reserved. © 2026</h5>
  </p>


  {/* <p className="text-[10px] text-gray-400 mt-1">
    © 2026
  </p> */}
</div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center'} w-full py-2.5 rounded-xl hover:bg-red-500/20 text-red-300 transition-all duration-200`}
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && (
              <span className="text-sm font-medium">Logout</span>
            )}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                Logout
              </div>
            )}
          </button>

          {/* Toggle Arrow at Bottom */}
          <button
            onClick={toggleSidebar}
            className={`flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center'} w-full py-2.5 rounded-xl hover:bg-white/10 text-blue-200 transition-all duration-200 mt-2 border-t border-white/5 pt-3`}
          >
            {isOpen ? (
              <>
                <FiChevronLeft className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            ) : (
              <>
                <FiChevronRight className="w-5 h-5 flex-shrink-0" />
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                  Expand
                </div>
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;




