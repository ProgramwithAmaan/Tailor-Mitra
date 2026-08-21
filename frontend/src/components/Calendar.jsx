import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronLeft, FiChevronRight, FiCalendar, FiPackage, 
  FiUsers, FiClock, FiCheckCircle, FiAlertCircle, FiPlus,
  FiX, FiEdit2, FiTrash2, FiBell, FiTruck, FiScissors,
  FiDollarSign, FiUser, FiMapPin, FiPhone, FiMail,
  FiRefreshCw, FiStar, FiAward, FiTrendingUp
} from 'react-icons/fi';
import { getCustomers, getOrders } from '../api';
import toast from 'react-hot-toast';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Real data from API
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Stats
  const [stats, setStats] = useState({
    totalCustomers: 0,
    ongoingOrders: 0,
    monthlyRevenue: 0,
    totalDeliveries: 0,
    inProgress: 0,
    readyForDelivery: 0,
    completed: 0,
    todayDeliveries: 0,
    activeCustomers: 0,
    totalRevenue: 0,
  });

  // Fetch real data
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [customersRes, ordersRes] = await Promise.all([
        getCustomers(),
        getOrders(),
      ]);
      
      const customersData = customersRes.data || [];
      const ordersData = ordersRes.data || [];
      
      setCustomers(customersData);
      setOrders(ordersData);
      
      // Generate calendar events from real orders
      generateCalendarEvents(customersData, ordersData);
      
      // Calculate stats
      calculateStats(customersData, ordersData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate real stats
  const calculateStats = (customersData, ordersData) => {
    const totalCustomers = customersData.length;
    
    // Ongoing orders (cutting, stitch, ready, pending - not received)
    const ongoingOrders = ordersData.filter(o => o.status !== 'received' && o.status !== 'delivered').length;
    
    // Total deliveries (all orders)
    const totalDeliveries = ordersData.length;
    
    // In progress (cutting, stitch, pending)
    const inProgress = ordersData.filter(o => o.status === 'cutting' || o.status === 'stitch' || o.status === 'pending').length;
    
    // Ready for delivery
    const readyForDelivery = ordersData.filter(o => o.status === 'ready').length;
    
    // Completed (received)
    const completed = ordersData.filter(o => o.status === 'received' || o.status === 'delivered').length;
    
    // Today's deliveries (orders created today)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayDeliveries = ordersData.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.toISOString().split('T')[0] === todayStr;
    }).length;
    
    // Active customers (customers with at least one order)
    const activeCustomers = customersData.filter(c => 
      ordersData.some(o => o.customerId === c._id)
    ).length;

    setStats({
      totalCustomers,
      ongoingOrders,
      monthlyRevenue: 0,
      totalDeliveries,
      inProgress,
      readyForDelivery,
      completed,
      todayDeliveries,
      activeCustomers,
      totalRevenue: 0,
    });
  };

  // Generate calendar events from orders
  const generateCalendarEvents = (customersList, ordersList) => {
    const events = [];
    
    ordersList.forEach(order => {
      const customer = customersList.find(c => c._id === order.customerId);
      if (customer) {
        const eventDate = new Date(order.createdAt);
        
        const statusMap = {
          'cutting': { label: 'Cutting', color: '#f59e0b', bg: 'bg-amber-100', text: 'text-amber-700' },
          'stitch': { label: 'Stitching', color: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-700' },
          'ready': { label: 'Ready', color: '#10b981', bg: 'bg-green-100', text: 'text-green-700' },
          'received': { label: 'Received', color: '#8b5cf6', bg: 'bg-purple-100', text: 'text-purple-700' },
          'pending': { label: 'Pending', color: '#6b7280', bg: 'bg-gray-100', text: 'text-gray-700' },
          'delivered': { label: 'Delivered', color: '#8b5cf6', bg: 'bg-purple-100', text: 'text-purple-700' },
        };
        
        const statusInfo = statusMap[order.status] || statusMap.pending;
        
        events.push({
          id: order._id,
          date: eventDate,
          title: `${customer.name}'s Order`,
          customerName: customer.name,
          customerId: customer.customerId,
          phone: customer.phone,
          email: customer.email,
          amount: customer.price || 0,
          status: order.status,
          statusLabel: statusInfo.label,
          statusColor: statusInfo.color,
          statusBg: statusInfo.bg,
          statusText: statusInfo.text,
          orderNumber: customer.customerId || order._id.slice(-8),
          measurements: customer.measurements || {},
          notes: order.notes || '',
          updatedAt: order.updatedAt,
          createdAt: order.createdAt,
        });
      }
    });
    
    setCalendarEvents(events);
  };

  // Get current month/year
  const getMonthYear = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        day: prevMonthLastDay - i,
      });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        day: i,
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        day: i,
      });
    }
    
    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarEvents.filter(event => {
      const eventDateStr = new Date(event.date).toISOString().split('T')[0];
      return eventDateStr === dateStr;
    });
  };

  // Get status color for badge
  const getStatusBadgeColor = (status) => {
    const colors = {
      cutting: 'bg-amber-100 text-amber-700 border-amber-200',
      stitch: 'bg-blue-100 text-blue-700 border-blue-200',
      ready: 'bg-green-100 text-green-700 border-green-200',
      received: 'bg-purple-100 text-purple-700 border-purple-200',
      pending: 'bg-gray-100 text-gray-700 border-gray-200',
      delivered: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      cutting: FiScissors,
      stitch: FiClock,
      ready: FiCheckCircle,
      received: FiTruck,
      pending: FiClock,
      delivered: FiCheckCircle,
    };
    return icons[status] || FiClock;
  };

  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const eventsOnDate = getEventsForDate(date);
    if (eventsOnDate.length > 0) {
      setSelectedEvent(eventsOnDate[0]);
      setShowDetailModal(true);
    } else {
      toast.info('No orders on this date');
    }
  };

  const days = getDaysInMonth(currentDate);
  const hasOrders = calendarEvents.length > 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold text-[#5B2C18] flex items-center gap-3">
              <FiCalendar className="text-[#C96B1D]" />
              Delivery Calendar
            </h1>
            <p className="text-gray-600 mt-1">Track all your orders and deliveries</p>
          </motion.div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm font-medium text-[#5B2C18]"
            >
              Today
            </button>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm font-medium text-[#5B2C18] flex items-center gap-2"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-[#5B2C18]">{stats.totalDeliveries}</p>
            <p className="text-[10px] text-gray-500">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-[10px] text-gray-500">In Progress</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-green-600">{stats.readyForDelivery}</p>
            <p className="text-[10px] text-gray-500">Ready for Delivery</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-purple-600">{stats.completed}</p>
            <p className="text-[10px] text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-emerald-600">{stats.todayDeliveries}</p>
            <p className="text-[10px] text-gray-500">Today's Orders</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-indigo-600">{stats.totalCustomers}</p>
            <p className="text-[10px] text-gray-500">Total Customers</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-rose-600">{stats.activeCustomers}</p>
            <p className="text-[10px] text-gray-500">Active Customers</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-amber-600">{stats.ongoingOrders}</p>
            <p className="text-[10px] text-gray-500">Ongoing Orders</p>
          </div>
        </div>

        {/* Active Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-gray-500">Active Customers</p>
            <p className="text-2xl font-bold text-amber-700">{stats.activeCustomers}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-gray-500">Ongoing Orders</p>
            <p className="text-2xl font-bold text-blue-700">{stats.ongoingOrders}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-green-700">{stats.totalDeliveries}</p>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm"
            >
              <FiChevronLeft className="w-5 h-5 text-[#5B2C18]" />
            </button>
            <h2 className="text-2xl font-bold text-[#5B2C18]">{getMonthYear()}</h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm"
            >
              <FiChevronRight className="w-5 h-5 text-[#5B2C18]" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Cutting
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Stitching
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Ready
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Received
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C96B1D]"></div>
          </div>
        ) : !hasOrders ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <FiCalendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No Orders Yet</h3>
            <p className="text-gray-500 mt-2">Add customers and create orders to see them on the calendar</p>
            <div className="mt-6 flex gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/customers'}
                className="bg-[#C96B1D] hover:bg-[#b85e1a] text-white px-6 py-2 rounded-xl transition-colors"
              >
                <FiUser className="inline mr-2" />
                Add Customer
              </button>
              <button 
                onClick={() => window.location.href = '/orders'}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl transition-colors"
              >
                <FiPackage className="inline mr-2" />
                View Orders
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-amber-50/50 border-b border-gray-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-sm font-semibold text-[#5B2C18]">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
              {days.map((day, index) => {
                const eventsOnDay = getEventsForDate(day.date);
                const isToday = day.date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
                const hasReady = eventsOnDay.some(e => e.status === 'ready');
                const hasCompleted = eventsOnDay.some(e => e.status === 'received' || e.status === 'delivered');
                const hasInProgress = eventsOnDay.some(e => e.status === 'cutting' || e.status === 'stitch' || e.status === 'pending');

                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDateClick(day.date)}
                    className={`min-h-[120px] p-2 cursor-pointer transition-all ${
                      !day.isCurrentMonth ? 'bg-gray-50/50 opacity-50' : ''
                    } ${isToday ? 'bg-amber-50/70 ring-2 ring-amber-500' : ''} ${
                      isSelected ? 'ring-2 ring-amber-500 ring-inset bg-amber-50/30' : ''
                    } hover:bg-amber-50/40`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${
                        isToday ? 'text-amber-700 font-bold' : 'text-gray-700'
                      }`}>
                        {day.day}
                      </span>
                      {eventsOnDay.length > 0 && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                          {eventsOnDay.length}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {hasInProgress && (
                        <span className="w-2 h-2 bg-blue-400 rounded-full" title="In Progress"></span>
                      )}
                      {hasReady && (
                        <span className="w-2 h-2 bg-green-500 rounded-full" title="Ready"></span>
                      )}
                      {hasCompleted && (
                        <span className="w-2 h-2 bg-purple-500 rounded-full" title="Completed"></span>
                      )}
                    </div>

                    {eventsOnDay.length > 0 && (
                      <div className="mt-1 text-[10px] text-gray-400 leading-relaxed">
                        {eventsOnDay.slice(0, 2).map((e, i) => (
                          <div key={i} className="truncate">
                            • {e.customerName} ({e.statusLabel})
                          </div>
                        ))}
                        {eventsOnDay.length > 2 && (
                          <div className="text-amber-500 font-medium">
                            +{eventsOnDay.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-[#5B2C18]">Order Details</h2>
                      <p className="text-sm text-gray-500">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedEvent.customerName?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{selectedEvent.customerName}</p>
                      <p className="text-xs text-gray-500">ID: {selectedEvent.customerId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedEvent.statusBg} ${selectedEvent.statusText}`}>
                      {selectedEvent.statusLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400">Order ID</p>
                      <p className="font-medium text-sm">{selectedEvent.orderNumber}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400">Amount</p>
                      <p className="font-medium text-sm text-[#C96B1D]">₹{selectedEvent.amount}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="font-medium text-sm">{selectedEvent.phone || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="font-medium text-sm truncate">{selectedEvent.email || 'N/A'}</p>
                    </div>
                  </div>

                  {selectedEvent.measurements && Object.values(selectedEvent.measurements).some(v => v) && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400 mb-2">Measurements</p>
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        {selectedEvent.measurements.chest && <span>Chest: {selectedEvent.measurements.chest}"</span>}
                        {selectedEvent.measurements.waist && <span>Waist: {selectedEvent.measurements.waist}"</span>}
                        {selectedEvent.measurements.hips && <span>Hips: {selectedEvent.measurements.hips}"</span>}
                        {selectedEvent.measurements.length && <span>Length: {selectedEvent.measurements.length}"</span>}
                        {selectedEvent.measurements.shoulder && <span>Shoulder: {selectedEvent.measurements.shoulder}"</span>}
                        {selectedEvent.measurements.arm && <span>Arm: {selectedEvent.measurements.arm}"</span>}
                        {selectedEvent.measurements.neck && <span>Neck: {selectedEvent.measurements.neck}"</span>}
                      </div>
                    </div>
                  )}

                  {selectedEvent.notes && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400">Notes</p>
                      <p className="text-sm text-gray-600">{selectedEvent.notes}</p>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      window.location.href = `/orders`;
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <FiPackage className="w-4 h-4" />
                    View All Orders
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="bg-[#C96B1D] hover:bg-[#b85e1a] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Calendar;

