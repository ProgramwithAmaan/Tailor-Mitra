import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiPackage, FiClock, FiUsers, FiDollarSign, FiTrendingUp, 
  FiTrendingDown, FiCalendar, FiCheckCircle, FiXCircle, 
  FiShoppingBag, FiAward, FiTarget, FiSmile, FiBarChart2,
  FiRefreshCw, FiEye, FiMessageSquare, FiStar, FiTruck,
  FiScissors, FiWatch, FiGift, FiBell, FiActivity,
  FiList, FiPlus, FiTrash2, FiCircle, FiGrid, FiClipboard,
  FiCheck, FiClock as FiClockIcon, FiTruck as FiTruckIcon,
  FiSun, FiCloud, FiMoon, FiCoffee, FiChevronDown, FiChevronUp,
  FiUser, FiPhone, FiMail, FiFilter, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { getDashboardStats, getOrders, getCustomers } from '../api';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import DotGrid from './DotGrid';
import GreetingCard from './GreetingCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useApp();

  // Fallback to the current authenticated user while AppContext hydrates.
  // This also prevents the dashboard from briefly showing the default
  // 'Tailor / TailorStudio' values after a fresh login.
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();

  const currentProfile = profile || {};
  const tailorName = currentProfile.name || storedUser?.profile?.name || 'Tailor';
  const shopName = currentProfile.shopName || storedUser?.shopDetails?.shopName || 'TailorStudio';
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalPayment: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [ordersByDate, setOrdersByDate] = useState({});

  const [orderStats, setOrderStats] = useState({
    cutting: 0,
    stitch: 0,
    ready: 0,
    received: 0,
    total: 0
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todayTasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Check pending orders', completed: false, priority: 'high' },
      { id: 2, text: 'Update order statuses', completed: false, priority: 'medium' },
      { id: 3, text: 'Contact customers for ready orders', completed: false, priority: 'high' },
      { id: 4, text: 'Review new measurements', completed: false, priority: 'low' },
      { id: 5, text: 'Prepare delivery notes', completed: false, priority: 'medium' },
    ];
  });
  const [newTask, setNewTask] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getCurrentDate = () => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getReadyOrdersCount = () => {
    return orderStats.ready || 0;
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return <FiSun className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500" />;
    if (hour < 17) return <FiSun className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500" />;
    if (hour < 21) return <FiCoffee className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-600" />;
    return <FiMoon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-indigo-500" />;
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  // Process orders for calendar
  const processOrdersForCalendar = (orders) => {
    const ordersMap = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const dateKey = date.toISOString().split('T')[0];
      if (!ordersMap[dateKey]) {
        ordersMap[dateKey] = [];
      }
      ordersMap[dateKey].push(order);
    });
    return ordersMap;
  };

  useEffect(() => {
    setCalendarDays(getDaysInMonth(currentDate));
  }, [currentDate]);

  useEffect(() => {
    if (recentOrders.length > 0) {
      const ordersMap = processOrdersForCalendar(recentOrders);
      setOrdersByDate(ordersMap);
    }
  }, [recentOrders]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  useEffect(() => {
    fetchDashboardData();
    generateSampleNotifications();
  }, []);

  useEffect(() => {
    localStorage.setItem('todayTasks', JSON.stringify(tasks));
  }, [tasks]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, customersRes] = await Promise.all([
        getDashboardStats(),
        getOrders(),
        getCustomers(),
      ]);
      
      const ordersData = ordersRes.data || [];
      const customersData = customersRes.data || [];
      
      setStats(statsRes.data);
      setRecentOrders(ordersData.slice(0, 5));
      setRecentCustomers(customersData.slice(0, 4));
      
      // Process orders for calendar
      const ordersMap = processOrdersForCalendar(ordersData);
      setOrdersByDate(ordersMap);
      
      const cutting = ordersData.filter(o => o.status === 'cutting').length;
      const stitch = ordersData.filter(o => o.status === 'stitch').length;
      const ready = ordersData.filter(o => o.status === 'ready').length;
      const received = ordersData.filter(o => o.status === 'received').length;
      
      setOrderStats({
        cutting,
        stitch,
        ready,
        received,
        total: ordersData.length
      });
      
      setFilteredOrders(ordersData);
      
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const generateSampleNotifications = () => {
    setNotifications([
      { id: 1, message: "3 orders ready for delivery", time: "5 min ago", type: "success", read: false },
      { id: 2, message: "New customer registered", time: "1 hour ago", type: "info", read: false },
      { id: 3, message: "Payment received from John", time: "2 hours ago", type: "success", read: true },
      { id: 4, message: "Low stock alert: Cotton fabric", time: "5 hours ago", type: "warning", read: true },
    ]);
  };

  const filterOrdersByStatus = (status) => {
    setSelectedStatus(status);
    setIsFilterOpen(false);
    if (status === 'all') {
      setFilteredOrders(recentOrders);
    } else {
      const filtered = recentOrders.filter(o => o.status === status);
      setFilteredOrders(filtered);
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setShowAddTask(false);
      toast.success('Task added! ✅');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task removed');
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
    toast.success('Completed tasks cleared');
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-[#FDEBEB] text-[#DC2626] border-[#EF4444]/30',
      medium: 'bg-[#FFF4E0] text-[#B45309] border-[#F5A623]/30',
      low: 'bg-[#E6F9ED] text-[#16A34A] border-[#22C55E]/30',
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: '🔴',
      medium: '🟡',
      low: '🟢',
    };
    return icons[priority] || '🟡';
  };

  const filteredTasks = tasks.filter(task => {
    if (filterPriority === 'all') return true;
    return task.priority === filterPriority;
  });

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Stats cards WITHOUT trend arrows
  const statCards = [
    { 
      title: 'Total Orders', 
      value: stats.totalOrders, 
      icon: FiPackage, 
      color: 'from-[#4F7CFF] to-[#8B7CFF]',
      bgColor: 'bg-[#EAF0FF]',
      iconColor: 'text-[#4F7CFF]'
    },
    { 
      title: 'Pending Orders', 
      value: stats.pendingOrders, 
      icon: FiClock, 
      color: 'from-[#F5A623] to-[#F5A623]',
      bgColor: 'bg-[#FFF4E0]',
      iconColor: 'text-[#B45309]'
    },
    { 
      title: 'Total Customers', 
      value: stats.totalCustomers, 
      icon: FiUsers, 
      color: 'from-[#22C55E] to-[#22C55E]',
      bgColor: 'bg-[#E6F9ED]',
      iconColor: 'text-[#22C55E]'
    },
    { 
      title: 'Total Revenue', 
      value: `₹${stats.totalPayment.toLocaleString()}`, 
      icon: FiDollarSign, 
      color: 'from-[#8B5CF6] to-[#8B5CF6]',
      bgColor: 'bg-[#F1ECFE]',
      iconColor: 'text-[#8B5CF6]'
    },
  ];

  const quickActions = [
    { icon: FiUsers, label: 'Add Customer', color: 'bg-[#4F7CFF]', action: '/customers' },
    { icon: FiShoppingBag, label: 'New Order', color: 'bg-[#22C7B5]', action: '/orders' },
    { icon: FiScissors, label: 'Update Status', color: 'bg-[#8B5CF6]', action: '/orders' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      cutting: 'bg-[#FFF4E0] text-[#B45309] border-[#F5A623]',
      stitch: 'bg-[#EAF0FF] text-[#4F7CFF] border-[#8B7CFF]',
      ready: 'bg-[#E6F9ED] text-[#16A34A] border-[#22C55E]',
      received: 'bg-[#F1ECFE] text-[#7C3AED] border-[#8B5CF6]',
    };
    return styles[status] || styles.cutting;
  };

  const progressData = [
    {
      status: 'Cutting',
      count: orderStats.cutting,
      icon: FiScissors,
      color: 'bg-[#F5A623]',
      bgColor: 'bg-[#FFF4E0]',
      textColor: 'text-[#B45309]',
      borderColor: 'border-[#F5A623]/30',
      percent: orderStats.total > 0 ? Math.round((orderStats.cutting / orderStats.total) * 100) : 0
    },
    {
      status: 'Stitching',
      count: orderStats.stitch,
      icon: FiClockIcon,
      color: 'bg-[#4F7CFF]',
      bgColor: 'bg-[#EAF0FF]',
      textColor: 'text-[#4F7CFF]',
      borderColor: 'border-[#8B7CFF]/30',
      percent: orderStats.total > 0 ? Math.round((orderStats.stitch / orderStats.total) * 100) : 0
    },
    {
      status: 'Ready',
      count: orderStats.ready,
      icon: FiCheckCircle,
      color: 'bg-[#22C55E]',
      bgColor: 'bg-[#E6F9ED]',
      textColor: 'text-[#16A34A]',
      borderColor: 'border-[#22C55E]/30',
      percent: orderStats.total > 0 ? Math.round((orderStats.ready / orderStats.total) * 100) : 0
    },
    {
      status: 'Received',
      count: orderStats.received,
      icon: FiGift,
      color: 'bg-[#8B5CF6]',
      bgColor: 'bg-[#F1ECFE]',
      textColor: 'text-[#7C3AED]',
      borderColor: 'border-[#8B5CF6]/30',
      percent: orderStats.total > 0 ? Math.round((orderStats.received / orderStats.total) * 100) : 0
    }
  ];

  const getStatusLabel = (status) => {
    const labels = {
      cutting: 'Cutting',
      stitch: 'Stitching',
      ready: 'Ready',
      received: 'Received'
    };
    return labels[status] || status;
  };

  // tailorName/shopName are defined above with a localStorage fallback.
  const greeting = getGreeting();
  const currentDateDisplay = getCurrentDate();
  const readyCount = getReadyOrdersCount();

  // Get the current selected status label
  const getSelectedStatusLabel = () => {
    if (selectedStatus === 'all') return 'All Orders';
    return getStatusLabel(selectedStatus);
  };

  // Get status color for filter button
  const getFilterStatusColor = (status) => {
    const colors = {
      all: 'border-[#4F7CFF] text-[#4F7CFF]',
      cutting: 'border-[#F5A623] text-[#B45309]',
      stitch: 'border-[#4F7CFF] text-[#4F7CFF]',
      ready: 'border-[#22C55E] text-[#22C55E]',
      received: 'border-[#8B5CF6] text-[#8B5CF6]',
    };
    return colors[status] || colors.all;
  };

  // Check if date has orders
  const hasOrdersOnDate = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return ordersByDate[dateKey] && ordersByDate[dateKey].length > 0;
  };

  // Get order count for date
  const getOrderCountForDate = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return ordersByDate[dateKey] ? ordersByDate[dateKey].length : 0;
  };

  // Get month/year for calendar header
  const getMonthYear = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Navigation handlers
  const handleViewAllOrders = () => {
    navigate('/orders');
  };

  const handleViewAllCustomers = () => {
    navigate('/customers');
  };

  return (
    <div className="w-full">
      {/* Greeting Card */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <GreetingCard
          name={tailorName}
          tag={shopName}
          date={currentDateDisplay}
          todaysOrders={orderStats.total}
          pending={stats.pendingOrders}
          ready={readyCount}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 border border-[#EDF0F7] hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`${card.bgColor} p-2 sm:p-3 lg:p-3.5 rounded-xl`}>
                <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.iconColor}`} />
              </div>
            </div>
            <h3 className="text-[#6B7280] text-xs sm:text-sm font-medium">{card.title}</h3>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#161A2B] mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ORDER PROGRESS BOARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#EDF0F7] p-4 sm:p-5 md:p-6 lg:p-8 mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-[#EAF0FF] rounded-lg sm:rounded-xl">
              <FiClipboard className="w-5 h-5 sm:w-6 sm:h-6 text-[#4F7CFF]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#161A2B]">Order Progress Board</h2>
              <p className="text-xs sm:text-sm text-[#6B7280]">Real-time order status tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-[#6B7280]">
              Total: <span className="font-bold text-[#161A2B]">{orderStats.total}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-4 sm:mb-6">
          {progressData.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => filterOrdersByStatus(item.status.toLowerCase())}
                className={`${item.bgColor} rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border-2 ${item.borderColor} cursor-pointer transition-all shadow-sm hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className={`${item.color} p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white shadow-md`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className={`text-xl sm:text-2xl lg:text-3xl font-bold ${item.textColor}`}>
                    {item.count}
                  </span>
                </div>
                <h3 className={`font-semibold text-sm sm:text-base ${item.textColor}`}>{item.status}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 sm:h-2 bg-[#E5E9F0] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-[#6B7280]">{item.percent}%</span>
                </div>
                <div className="mt-1 sm:mt-2 flex justify-between text-[10px] sm:text-xs text-gray-400">
                  <span>Orders</span>
                  <span>{item.count} of {orderStats.total}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filter Dropdown */}
        <div className="mt-4 pt-4 border-t border-[#EDF0F7]">
          <div className="relative inline-block">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                getFilterStatusColor(selectedStatus)
              } bg-white hover:shadow-md`}
            >
              <FiFilter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter: {getSelectedStatusLabel()}</span>
              {isFilterOpen ? (
                <FiChevronUp className="w-4 h-4" />
              ) : (
                <FiChevronDown className="w-4 h-4" />
              )}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="py-1">
                    <button
                      onClick={() => filterOrdersByStatus('all')}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                        selectedStatus === 'all'
                          ? 'bg-[#EAF0FF] text-[#4F7CFF] font-medium'
                          : 'text-[#6B7280] hover:bg-[#F5F7FC]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      All Orders
                      <span className="ml-auto text-xs text-gray-400">{orderStats.total}</span>
                    </button>
                    <button
                      onClick={() => filterOrdersByStatus('cutting')}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                        selectedStatus === 'cutting'
                          ? 'bg-[#FFF4E0] text-[#B45309] font-medium'
                          : 'text-[#6B7280] hover:bg-[#F5F7FC]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#F5A623]"></span>
                      Cutting
                      <span className="ml-auto text-xs text-gray-400">{orderStats.cutting}</span>
                    </button>
                    <button
                      onClick={() => filterOrdersByStatus('stitch')}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                        selectedStatus === 'stitch'
                          ? 'bg-[#EAF0FF] text-[#4F7CFF] font-medium'
                          : 'text-[#6B7280] hover:bg-[#F5F7FC]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Stitching
                      <span className="ml-auto text-xs text-gray-400">{orderStats.stitch}</span>
                    </button>
                    <button
                      onClick={() => filterOrdersByStatus('ready')}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                        selectedStatus === 'ready'
                          ? 'bg-[#E6F9ED] text-[#16A34A] font-medium'
                          : 'text-[#6B7280] hover:bg-[#F5F7FC]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                      Ready
                      <span className="ml-auto text-xs text-gray-400">{orderStats.ready}</span>
                    </button>
                    <button
                      onClick={() => filterOrdersByStatus('received')}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                        selectedStatus === 'received'
                          ? 'bg-[#F1ECFE] text-[#7C3AED] font-medium'
                          : 'text-[#6B7280] hover:bg-[#F5F7FC]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                      Received
                      <span className="ml-auto text-xs text-gray-400">{orderStats.received}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="max-h-40 sm:max-h-48 md:max-h-60 overflow-y-auto custom-scrollbar mt-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-4 sm:py-6 text-gray-400">
                <FiPackage className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-xs sm:text-sm">No {selectedStatus !== 'all' ? getStatusLabel(selectedStatus).toLowerCase() : ''} orders found</p>
              </div>
            ) : (
              <div className="space-y-1.5 sm:space-y-2">
                {filteredOrders.map((order) => (
                  <div 
                    key={order._id} 
                    className="flex flex-wrap items-center justify-between p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl border border-gray-100 hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#EAF0FF] rounded-full flex items-center justify-center">
                        <span className="text-[#4F7CFF] text-[10px] sm:text-sm font-medium">
                          {order.customerId?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-xs sm:text-sm">{order.customerId?.name || 'Unknown'}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">{order.customerId?.customerId || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#161A2B]">₹{order.customerId?.price || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Small Calendar Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#EDF0F7] p-4 sm:p-5 mb-6 sm:mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#EAF0FF] rounded-lg">
              <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#4F7CFF]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#161A2B]">Monthly Calendar</h2>
              <p className="text-[10px] sm:text-xs text-[#6B7280]">Orders: {orderStats.total}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-[#EAF0FF] text-[#6B7280] hover:text-[#4F7CFF] transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-[#161A2B] min-w-[80px] text-center">
              {getMonthYear()}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-[#EAF0FF] text-[#6B7280] hover:text-[#4F7CFF] transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-[10px] font-medium text-gray-400 py-0.5">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, index) => {
            const hasOrders = hasOrdersOnDate(day.date);
            const orderCount = getOrderCountForDate(day.date);
            const isTodayDate = isToday(day.date);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.005 }}
                className={`
                  text-center py-1 text-xs rounded-md relative
                  ${day.isCurrentMonth ? 'text-gray-700' : 'text-gray-300'}
                  ${isTodayDate ? 'bg-[#4F7CFF] text-white font-bold shadow-sm' : ''}
                  ${!isTodayDate && day.isCurrentMonth && hasOrders ? 'bg-[#EAF0FF] border border-[#4F7CFF]/30 cursor-pointer hover:bg-[#8B7CFF]/10' : ''}
                  ${!isTodayDate && day.isCurrentMonth && !hasOrders ? 'hover:bg-gray-50 cursor-pointer' : ''}
                  transition-all duration-200
                `}
              >
                {day.day}
                {hasOrders && day.isCurrentMonth && !isTodayDate && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#4F7CFF] rounded-full"></span>
                )}
                {hasOrders && day.isCurrentMonth && (
                  <span className="block text-[8px] text-[#4F7CFF] font-medium">
                    {orderCount}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
            <span className="text-[10px] text-gray-500">Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 border border-blue-300 rounded-full bg-blue-50"></div>
            <span className="text-[10px] text-gray-500">Orders</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-gray-200 rounded-full"></div>
            <span className="text-[10px] text-gray-500">No Orders</span>
          </div>
        </div>
      </motion.div>

      {/* Today's Work Checklist & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {/* Today's Work Checklist Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/30 p-4 sm:p-5 md:p-6 lg:p-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-[#EAF0FF] rounded-lg sm:rounded-xl">
                <FiList className="w-5 h-5 sm:w-6 sm:h-6 text-[#4F7CFF]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#161A2B]">Today's Work Checklist</h2>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#6B7280]">
                  <span>{completedTasks}/{totalTasks} completed</span>
                  <div className="w-16 sm:w-24 h-1.5 bg-[#E5E9F0] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#4F7CFF] to-[#3D63E0] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span>{progress}%</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="bg-[#4F7CFF] hover:bg-[#3D63E0] text-white text-xs sm:text-sm py-1.5 px-3 sm:px-4 rounded-lg flex items-center gap-1 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Task
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            <button
              onClick={() => setFilterPriority('all')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs transition-all ${
                filterPriority === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterPriority('high')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs transition-all ${
                filterPriority === 'high' 
                  ? 'bg-[#FDEBEB] text-[#DC2626]' 
                  : 'bg-[#F5F7FC] text-[#6B7280] hover:bg-[#EAF0FF]'
              }`}
            >
              🔴 High
            </button>
            <button
              onClick={() => setFilterPriority('medium')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs transition-all ${
                filterPriority === 'medium' 
                  ? 'bg-[#FFF4E0] text-[#B45309]' 
                  : 'bg-[#F5F7FC] text-[#6B7280] hover:bg-[#EAF0FF]'
              }`}
            >
              🟡 Medium
            </button>
            <button
              onClick={() => setFilterPriority('low')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs transition-all ${
                filterPriority === 'low' 
                  ? 'bg-[#E6F9ED] text-[#16A34A]' 
                  : 'bg-[#F5F7FC] text-[#6B7280] hover:bg-[#EAF0FF]'
              }`}
            >
              🟢 Low
            </button>
          </div>

          <div className="space-y-1.5 sm:space-y-2 max-h-[200px] sm:max-h-[300px] overflow-y-auto custom-scrollbar">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-400">
                <FiCheckCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm sm:text-base">No tasks for today!</p>
                <p className="text-xs sm:text-sm">Click "Add Task" to create one</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all ${
                      task.completed 
                        ? 'bg-green-50 border-green-200 opacity-75' 
                        : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0"
                    >
                      {task.completed ? (
                        <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                      ) : (
                        <FiCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-blue-500 transition-colors" />
                      )}
                    </button>
                    
                    <span className={`flex-1 text-xs sm:text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.text}
                    </span>
                    
                    <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon(task.priority)} {task.priority}
                    </span>
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 flex flex-wrap justify-between text-[10px] sm:text-xs text-gray-400 border-t border-blue-100">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span>📋 Total: {totalTasks}</span>
              <span>✅ Completed: {completedTasks}</span>
              <span>⏳ Pending: {totalTasks - completedTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiTarget className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Today's Progress: {progress}%</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/30 p-4 sm:p-5 md:p-6 lg:p-8"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-blue-100 rounded-lg sm:rounded-xl">
              <FiTarget className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-blue-900">Quick Actions</h2>
          </div>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = action.action}
                className="flex-shrink-0 min-w-[130px] sm:min-w-0 sm:flex-1 bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 text-center hover:shadow-lg transition-all border border-blue-100/30 group"
              >
                <div className={`${action.color} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-700">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/30 overflow-hidden"
        >
          <div className="p-4 sm:p-5 lg:p-6 border-b border-blue-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiPackage className="text-[#4F7CFF]" />
              Recent Orders
              <span className="ml-2 text-[10px] sm:text-xs bg-[#EAF0FF] text-[#4F7CFF] px-2 py-1 rounded-full">Last 5</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <FiPackage className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-gray-500">No orders yet</p>
              </div>
            ) : (
              <table className="w-full min-w-[400px] sm:min-w-full">
                <thead className="bg-[#EAF0FF]">
                  <tr>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-sm font-medium text-gray-600">Customer</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-sm font-medium text-gray-600">Order ID</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-sm font-medium text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <motion.tr 
                      key={order._id} 
                      className="border-b border-[#EDF0F7] hover:bg-[#EAF0FF]/40 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className="py-2 sm:py-3 px-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#EAF0FF] rounded-full flex items-center justify-center">
                            <span className="text-[#4F7CFF] text-[10px] sm:text-sm font-medium">
                              {order.customerId?.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-800">{order.customerId?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-sm text-gray-500">{order.customerId?.customerId?.slice(-6) || 'N/A'}</td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-xs font-semibold ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-[#4F7CFF]">₹{order.customerId?.price || 0}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-3 sm:p-4 border-t border-blue-100 bg-blue-50/30">
            <button 
              onClick={handleViewAllOrders}
              className="text-xs sm:text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              View All Orders <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </motion.div>

        {/* Recent Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/30 overflow-hidden"
        >
          <div className="p-4 sm:p-5 lg:p-6 border-b border-blue-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiUsers className="text-blue-600" />
              Recent Customers
              <span className="ml-2 text-[10px] sm:text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">New</span>
            </h2>
          </div>
          <div className="p-3 sm:p-4">
            {loading ? (
              <div className="flex justify-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentCustomers.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <FiUsers className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-gray-500">No customers yet</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {recentCustomers.map((customer, idx) => (
                  <motion.div
                    key={customer._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                        {customer.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm sm:text-base">{customer.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">{customer.customerId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-700 text-sm sm:text-base">₹{customer.price}</p>
                      <p className="text-[10px] sm:text-xs text-gray-400">{customer.phone}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 sm:p-4 border-t border-blue-100 bg-blue-50/30">
            <button 
              onClick={handleViewAllCustomers}
              className="text-xs sm:text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              View All Customers <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddTask(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-blue-900">Add New Task</h3>
                <button onClick={() => setShowAddTask(false)} className="text-gray-400 hover:text-gray-600">
                  <FiXCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter task..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTask}
                    disabled={!newTask.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;









