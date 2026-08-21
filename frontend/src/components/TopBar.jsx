import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiUser, FiBell, FiChevronDown, FiLogOut,
  FiSettings, FiHelpCircle, FiMail, FiX, FiUsers,
  FiPackage, FiDollarSign
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { searchCustomers } from '../api';
import toast from 'react-hot-toast';

const TopBar = () => {
  const navigate = useNavigate();
  const { profile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const { data } = await searchCustomers(query);
      setSearchResults(data || []);
      setShowSearchResults(data && data.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      navigate(`/customers?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery('');
    } else if (searchQuery.trim()) {
      toast.info('No customers found matching your search');
    }
  };

  const handleResultClick = (customer) => {
    navigate(`/customers?customer=${customer._id}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  const notifications = [
    { id: 1, message: 'New order received from Ramesh', time: '5 min ago', read: false },
    { id: 2, message: 'Payment received from Priya', time: '1 hour ago', read: false },
    { id: 3, message: 'Order #ORD1234 is ready', time: '2 hours ago', read: true },
    { id: 4, message: 'New customer registered', time: '5 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getInitials = (name) => {
    return name?.charAt(0)?.toUpperCase() || '?';
  };

  const getStatusColor = (status) => {
    const colors = {
      cutting: 'bg-amber-100 text-amber-800',
      stitch: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      received: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side - Search Bar */}
        <div className="flex-1 max-w-xl relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className={`relative flex items-center transition-all duration-300 ${
              isSearchFocused ? 'ring-2 ring-blue-500/50' : ''
            }`}>
              <FiSearch className={`absolute left-3 text-gray-400 transition-colors duration-300 ${
                isSearchFocused ? 'text-blue-500' : ''
              }`} />
              <input
                type="text"
                placeholder="Search customers "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  setIsSearchFocused(true);
                  if (searchQuery.trim() && searchResults.length > 0) {
                    setShowSearchResults(true);
                  }
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-0 text-gray-800 placeholder-gray-400 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
              {isSearching && (
                <div className="absolute right-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              )}
            </div>
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs text-gray-500">
                    Found {searchResults.length} customer{searchResults.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((customer) => (
                    <div
                      key={customer._id}
                      onClick={() => handleResultClick(customer)}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 bg-gradient-to-br from-blue-400 to-blue-600`}>
                          {getInitials(customer.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {customer.name}
                            </p>
                            <span className="text-xs font-semibold text-blue-600">
                              ₹{customer.price || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="truncate">{customer.phone}</span>
                            <span>•</span>
                            <span className="truncate">{customer.customerId}</span>
                            {customer.email && (
                              <>
                                <span>•</span>
                                <span className="truncate">{customer.email}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-medium ${getStatusColor(customer.status || 'pending')}`}>
                              {customer.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full text-center text-sm text-blue-600 hover:underline font-medium"
                  >
                    View all results in Customers →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No Results */}
          <AnimatePresence>
            {showSearchResults && searchResults.length === 0 && searchQuery.trim() && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="px-6 py-8 text-center">
                  <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No customers found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try searching by name, phone, ID or email
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side - Profile Area */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            {/* <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <FiBell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button> */}

            {/* Notifications Dropdown */}
            {/* <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                        Mark all read
                      </span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notif.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-700">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100 text-center">
                    <button className="text-sm text-blue-600 hover:underline font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                {profile?.name?.charAt(0) || 'T'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {profile?.name || 'Tailor'}
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  {profile?.shopName || 'TailorStudio'}
                </p>
              </div>
              <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                showProfileDropdown ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                        {profile?.name?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {profile?.name || 'Tailor'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {profile?.email || 'tailor@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        navigate('/profile');
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                    >
                      <FiUser className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100"></div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600 text-sm"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

