import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUsers, FiPackage, FiCreditCard, FiLogOut, 
  FiUser, FiCalendar, FiX, FiGlobe,
  FiSun, FiMoon, FiSettings, FiHelpCircle
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const MobileDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode, language, setLanguage, profile } = useApp();
  
  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard', id: 'dashboard' },
    { path: '/customers', icon: FiUsers, label: 'Customers', id: 'customers' },
    { path: '/orders', icon: FiPackage, label: 'Orders', id: 'orders' },
    { path: '/payments', icon: FiCreditCard, label: 'Payments', id: 'payments' },
    { path: '/calendar', icon: FiCalendar, label: 'Calendar', id: 'calendar' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    toast.success('Logged out successfully');
    navigate('/signin');
    onClose();
  };

  const handleNavClick = (path) => {
    navigate(path);
    onClose();
  };

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧' },
    { code: 'hindi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'spanish', name: 'Español', flag: '🇪🇸' },
    { code: 'french', name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[999] lg:hidden"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[75%] max-w-[320px] bg-blue-900 shadow-2xl z-[1000] lg:hidden overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-blue-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👔</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-white truncate">
                      {profile?.shopName || 'TailorStudio'}
                    </p>
                    <p className="text-[10px] text-blue-200 truncate">
                      {profile?.name || 'Tailor'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors touch-target flex-shrink-0"
                >
                  <FiX className="w-5 h-5 text-blue-200" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition-all ${
                      isActive
                        ? 'bg-white/20 text-white border-r-4 border-blue-400'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-200'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-blue-400"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-blue-800/50 my-2"></div>

            {/* Dark Mode Toggle */}
            <div className="px-4 py-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-full px-4 py-3 flex items-center gap-3 rounded-xl hover:bg-white/10 transition-colors text-blue-100"
              >
                {darkMode ? (
                  <FiSun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <FiMoon className="w-5 h-5 text-blue-200" />
                )}
                <span className="text-sm font-medium">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
            </div>

            {/* Language Selector */}
            <div className="px-4 py-2">
              <div className="flex flex-wrap gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      toast.success(`Language changed to ${lang.name}`);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all touch-target ${
                      language === lang.code 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/10 text-blue-100 hover:bg-white/20'
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-blue-800/50 my-2"></div>

            {/* Profile & Settings */}
            <div className="py-2">
              <button
                onClick={onClose}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-blue-100"
              >
                <FiUser className="w-5 h-5 text-blue-200" />
                <span className="text-sm font-medium">Profile</span>
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-blue-100"
              >
                <FiSettings className="w-5 h-5 text-blue-200" />
                <span className="text-sm font-medium">Settings</span>
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-blue-100"
              >
                <FiHelpCircle className="w-5 h-5 text-blue-200" />
                <span className="text-sm font-medium">Help & Support</span>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-blue-800/50 my-2"></div>

            {/* Logout */}
            <div className="py-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-500/20 transition-colors text-red-300"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-blue-800/50 mt-auto">
              <p className="text-[10px] text-blue-300/50 text-center">
                Version 1.0.0 © 2026
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;

