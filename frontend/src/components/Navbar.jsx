import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUsers, FiPackage, FiCreditCard, FiLogOut, 
  FiUser, FiGlobe, FiChevronDown, FiBell,
  FiCalendar, FiMenu
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import Profile from './Profile';
import MobileDrawer from './MobileDrawer';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, profile } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('dashboard');
    else if (path.includes('customers')) setActiveTab('customers');
    else if (path.includes('orders')) setActiveTab('orders');
    else if (path.includes('payments')) setActiveTab('payments');
    else if (path.includes('calendar')) setActiveTab('calendar');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧' },
    { code: 'hindi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'spanish', name: 'Español', flag: '🇪🇸' },
    { code: 'french', name: 'Français', flag: '🇫🇷' },
  ];

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard', id: 'dashboard' },
    { path: '/customers', icon: FiUsers, label: 'Customers', id: 'customers' },
    { path: '/orders', icon: FiPackage, label: 'Orders', id: 'orders' },
    { path: '/payments', icon: FiCreditCard, label: 'Payments', id: 'payments' },
    { path: '/calendar', icon: FiCalendar, label: 'Calendar', id: 'calendar' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[999] bg-blue-900/80 backdrop-blur-xl shadow-md lg:top-3 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:w-[96%] lg:max-w-7xl lg:rounded-2xl lg:shadow-lg transition-all duration-300 border-b border-blue-800/30 lg:border-0 ${
          scrolled ? 'lg:shadow-xl' : 'lg:shadow-md'
        }`}
      >
        <div className="px-3 sm:px-4 lg:px-6 py-2 lg:py-2.5 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
              <span className="text-base sm:text-lg lg:text-xl">👔</span>
            </div>
            <span className="font-bold text-sm sm:text-base lg:text-lg text-white hidden xs:block truncate max-w-[100px] sm:max-w-[150px] lg:max-w-[200px]">
              {profile?.shopName || 'TailorStudio'}
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative flex items-center gap-1.5 xl:gap-2 px-3 xl:px-4 py-1.5 xl:py-2 rounded-xl text-sm xl:text-base font-medium transition-all duration-300
                    ${active 
                      ? 'bg-white/20 text-white shadow-md' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span>{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="navbarActive"
                      className="absolute inset-0 bg-white/20 rounded-xl -z-10"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="p-2 lg:p-2.5 rounded-xl bg-white/10 text-blue-100 hover:bg-white/20 transition-all duration-300 flex items-center gap-1"
              >
                <FiGlobe className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="text-sm hidden md:inline">
                  {languages.find(l => l.code === language)?.flag}
                </span>
              </motion.button>

              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 lg:w-56 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="bg-white border border-gray-100 rounded-xl">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLanguageMenu(false);
                            toast.success(`Language changed to ${lang.name}`);
                          }}
                          className={`w-full px-4 py-2.5 lg:py-3 text-left flex items-center gap-3 transition-colors hover:bg-blue-50 text-sm lg:text-base ${
                            language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          <span className="text-lg lg:text-xl">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Bell */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 lg:p-2.5 rounded-xl bg-white/10 text-blue-100 hover:bg-white/20 transition-all duration-300 relative touch-target"
            >
              <FiBell className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* Profile Button - Desktop */}
            <div className="relative hidden xs:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-2 py-1.5 lg:px-3 lg:py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-xs sm:text-sm lg:text-base shadow-md">
                  {profile?.name?.charAt(0) || 'T'}
                </div>
                <FiChevronDown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-100 hidden sm:block" />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 lg:w-64 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="bg-white border border-gray-100 rounded-xl">
                      <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                            {profile?.name?.charAt(0) || 'T'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm lg:text-base truncate">
                              {profile?.name || 'Tailor'}
                            </p>
                            <p className="text-xs lg:text-sm text-gray-400 truncate max-w-[120px] lg:max-w-[160px]">
                              {profile?.email || 'tailor@example.com'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            setShowProfile(true);
                          }}
                          className="w-full px-4 py-2.5 lg:px-6 lg:py-3 text-left flex items-center gap-3 hover:bg-blue-50 transition-colors text-gray-700 text-sm lg:text-base"
                        >
                          <FiUser className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                          <span>Profile</span>
                        </button>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 lg:px-6 lg:py-3 text-left flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600 text-sm lg:text-base"
                        >
                          <FiLogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/10 text-blue-100 hover:bg-white/20 transition-all duration-300 touch-target"
            >
              <FiMenu className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && <Profile onClose={() => setShowProfile(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

