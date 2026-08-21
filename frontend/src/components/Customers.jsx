import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiPlus,
  FiSearch,
  FiX,
  FiUser,
  FiPhone,
  FiDollarSign,
  FiTool,
  FiMail,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiGrid,
  FiList,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiHeart,
  FiShare2,
  FiMoreVertical,
  FiChevronDown,
  FiChevronUp,
  FiPlusCircle,
} from "react-icons/fi";

import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} from "../api";

import toast from "react-hot-toast";

/* =========================================================
   EMPTY FORM
========================================================= */

const createEmptyForm = () => ({
  name: "",
  phone: "",
  email: "",
  address: "",
  price: "",

  measurements: [
    {
      name: "",
      value: "",
    },
  ],
});

/* =========================================================
   NORMALIZE MEASUREMENTS
========================================================= */

const normalizeMeasurementsForUI = (measurements) => {
  if (!measurements) {
    return [
      {
        name: "",
        value: "",
      },
    ];
  }

  /* New format */

  if (Array.isArray(measurements)) {
    const result = measurements.map((item) => ({
      name: item?.name || "",
      value: item?.value || "",
    }));

    return result.length
      ? result
      : [
          {
            name: "",
            value: "",
          },
        ];
  }

  /* Old format */

  if (
    typeof measurements === "object" &&
    !Array.isArray(measurements)
  ) {
    const result = Object.entries(measurements)
      .filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          value !== ""
      )
      .map(([name, value]) => ({
        name:
          name.charAt(0).toUpperCase() +
          name.slice(1),

        value: String(value),
      }));

    return result.length
      ? result
      : [
          {
            name: "",
            value: "",
          },
        ];
  }

  return [
    {
      name: "",
      value: "",
    },
  ];
};

/* =========================================================
   CUSTOMERS COMPONENT
========================================================= */

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchHistory, setSearchHistory] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [editingCustomer, setEditingCustomer] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const [viewMode, setViewMode] = useState("grid");

  const [filterBy, setFilterBy] = useState("all");

  const [isBasicInfoOpen, setIsBasicInfoOpen] =
    useState(true);

  const [isMeasurementsOpen, setIsMeasurementsOpen] =
    useState(true);

  const [isSearchFocused, setIsSearchFocused] =
    useState(false);

  const [formData, setFormData] =
    useState(createEmptyForm());

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  /* =======================================================
     LOAD CUSTOMERS
  ======================================================= */

  useEffect(() => {
    fetchCustomers();

    const savedHistory =
      localStorage.getItem("searchHistory");

    if (savedHistory) {
      try {
        setSearchHistory(
          JSON.parse(savedHistory)
        );
      } catch {
        setSearchHistory([]);
      }
    }
  }, []);

  /* =======================================================
     SAVE SEARCH HISTORY
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      "searchHistory",
      JSON.stringify(searchHistory)
    );
  }, [searchHistory]);

  /* =======================================================
     OUTSIDE SEARCH CLICK
  ======================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =======================================================
     FETCH CUSTOMERS
  ======================================================= */

  const fetchCustomers = async () => {
    setLoading(true);

    try {
      const response = await getCustomers();

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setCustomers(data);
      setSearchResults(data);
    } catch (error) {
      console.error(
        "Fetch customers error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch customers"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults(customers);
      return;
    }

    try {
      const response =
        await searchCustomers(query);

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setSearchResults(data);

      if (query.trim().length > 2) {
        const newHistory = [
          query,
          ...searchHistory.filter(
            (item) => item !== query
          ),
        ].slice(0, 5);

        setSearchHistory(newHistory);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed");
    }
  };

  /* =======================================================
     CLEAR SEARCH
  ======================================================= */

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(customers);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /* =======================================================
     ADD MODAL
  ======================================================= */

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData(createEmptyForm());

    setIsBasicInfoOpen(true);
    setIsMeasurementsOpen(true);

    setShowModal(true);
  };

  /* =======================================================
     EDIT MODAL
  ======================================================= */

  const openEditModal = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
      price:
        customer.price !== undefined
          ? String(customer.price)
          : "",

      measurements:
        normalizeMeasurementsForUI(
          customer.measurements
        ),
    });

    setIsBasicInfoOpen(true);
    setIsMeasurementsOpen(true);

    setShowDetailModal(false);
    setShowModal(true);
  };

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleFieldChange = (
    field,
    value
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =======================================================
     MEASUREMENT CHANGE
  ======================================================= */

  const handleMeasurementChange = (
    index,
    field,
    value
  ) => {
    setFormData((previous) => {
      const measurements = [
        ...previous.measurements,
      ];

      measurements[index] = {
        ...measurements[index],
        [field]: value,
      };

      return {
        ...previous,
        measurements,
      };
    });
  };

  /* =======================================================
     ADD MEASUREMENT
  ======================================================= */

  const addMeasurementRow = () => {
    setFormData((previous) => ({
      ...previous,

      measurements: [
        ...previous.measurements,
        {
          name: "",
          value: "",
        },
      ],
    }));
  };

  /* =======================================================
     REMOVE MEASUREMENT
  ======================================================= */

  const removeMeasurementRow = (index) => {
    setFormData((previous) => {
      const measurements =
        previous.measurements.filter(
          (_, i) => i !== index
        );

      return {
        ...previous,

        measurements:
          measurements.length > 0
            ? measurements
            : [
                {
                  name: "",
                  value: "",
                },
              ],
      };
    });
  };

  /* =======================================================
     SUBMIT CUSTOMER
  ======================================================= */

  const handleSubmitCustomer = async (
    event
  ) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error(
        "Customer name is required"
      );
      return;
    }

    if (!formData.phone.trim()) {
      toast.error(
        "Phone number is required"
      );
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      toast.error(
        "Please enter a valid price"
      );
      return;
    }

    const cleanedMeasurements =
      formData.measurements
        .map((measurement) => ({
          name:
            measurement.name?.trim() || "",
          value:
            measurement.value?.trim() || "",
        }))
        .filter(
          (measurement) =>
            measurement.name ||
            measurement.value
        );

    const invalidMeasurement =
      cleanedMeasurements.some(
        (measurement) =>
          !measurement.name &&
          measurement.value
      );

    if (invalidMeasurement) {
      toast.error(
        "Please enter a name for every measurement"
      );
      return;
    }

    const payload = {
      name: formData.name.trim(),

      phone: formData.phone.trim(),

      email: formData.email
        ? formData.email
            .trim()
            .toLowerCase()
        : "",

      address: formData.address.trim(),

      price: Number(formData.price),

      measurements:
        cleanedMeasurements,
    };

    setLoading(true);

    try {
      let response;

      if (editingCustomer) {
        response = await updateCustomer(
          editingCustomer._id,
          payload
        );

        toast.success(
          "Customer updated successfully ✨"
        );
      } else {
        response =
          await addCustomer(payload);

        toast.success(
          "Customer added successfully 🎉"
        );
      }

      if (response?.data) {
        setShowModal(false);
        setEditingCustomer(null);

        setFormData(
          createEmptyForm()
        );

        await fetchCustomers();
      }
    } catch (error) {
      console.error(
        "Save customer error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        toast.error(
          "Session expired. Please login again."
        );

        window.location.href =
          "/signin";

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Failed to save customer"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDeleteCustomer = async (
    customer
  ) => {
    const confirmed = window.confirm(
      `Delete ${customer.name}? This will also remove their related orders.`
    );

    if (!confirmed) return;

    try {
      await deleteCustomer(
        customer._id
      );

      toast.success(
        "Customer deleted successfully"
      );

      setShowDetailModal(false);
      setSelectedCustomer(null);

      await fetchCustomers();
    } catch (error) {
      console.error(
        "Delete customer error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete customer"
      );
    }
  };

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredCustomers =
    searchResults.filter((customer) => {
      const price = Number(
        customer.price || 0
      );

      if (filterBy === "all") {
        return true;
      }

      if (filterBy === "high") {
        return price > 2000;
      }

      if (filterBy === "medium") {
        return (
          price >= 1000 &&
          price <= 2000
        );
      }

      if (filterBy === "low") {
        return price < 1000;
      }

      return true;
    });

  /* =======================================================
     STATS
  ======================================================= */

  const totalCustomers =
    customers.length;

  const totalRevenue =
    customers.reduce(
      (sum, customer) =>
        sum +
        Number(customer.price || 0),
      0
    );

  const averageOrder =
    totalCustomers > 0
      ? Math.round(
          totalRevenue /
            totalCustomers
        )
      : 0;

  const highValueCustomers =
    customers.filter(
      (customer) =>
        Number(customer.price || 0) >
        2000
    ).length;

  const statsCards = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: FiUsers,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },

    {
      title: "Average Order",
      value: `₹${averageOrder.toLocaleString()}`,
      icon: FiTrendingUp,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },

    {
      title: "High Value",
      value: highValueCustomers,
      icon: FiAward,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  /* =======================================================
     AVATAR
  ======================================================= */

  const getAvatarGradient = (
    name
  ) => {
    const gradients = [
      "from-amber-400 to-amber-600",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-purple-400 to-purple-600",
      "from-pink-400 to-pink-600",
      "from-indigo-400 to-indigo-600",
      "from-red-400 to-red-600",
      "from-teal-400 to-teal-600",
    ];

    const index =
      name?.length %
        gradients.length || 0;

    return gradients[index];
  };

  /* =======================================================
     STATUS
  ======================================================= */

  const getStatusText = (
    customer
  ) => {
    const orderCount =
      customer.totalOrders || 0;

    if (orderCount > 10) {
      return "Premium";
    }

    if (orderCount > 5) {
      return "Regular";
    }

    if (orderCount > 0) {
      return "New";
    }

    return "Inactive";
  };

  const getStatusColor = (
    customer
  ) => {
    const status =
      getStatusText(customer);

    if (status === "Premium") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Regular") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "New") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  /* =======================================================
     MEASUREMENTS
  ======================================================= */

  const getMeasurements = (
    customer
  ) => {
    return normalizeMeasurementsForUI(
      customer?.measurements
    ).filter(
      (measurement) =>
        measurement.name ||
        measurement.value
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="w-full min-w-0 pb-32 lg:pb-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-5 lg:mb-8">

        <div className="flex flex-col gap-4">

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#5B2C18]">
              Customers
            </h1>

            <p className="text-sm text-gray-600 mt-1">
              Manage and track all your customers
            </p>
          </div>

          {/* SEARCH + VIEW */}

          <div className="flex items-center gap-2 w-full">

            <div
              ref={searchRef}
              className="relative flex-1 min-w-0"
            >
              <div
                className={`relative flex items-center bg-white rounded-xl border transition-all ${
                  isSearchFocused
                    ? "border-[#C96B1D] ring-2 ring-[#C96B1D]/20"
                    : "border-gray-200"
                }`}
              >

                <FiSearch className="absolute left-3 text-gray-400" />

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onFocus={() =>
                    setIsSearchFocused(
                      true
                    )
                  }
                  onChange={(e) =>
                    handleSearch(
                      e.target.value
                    )
                  }
                  className="w-full min-w-0 pl-10 pr-9 py-3 bg-transparent outline-none text-sm"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={
                      clearSearch
                    }
                    className="absolute right-3 text-gray-400"
                  >
                    <FiX />
                  </button>
                )}

              </div>
            </div>

            {/* GRID */}

            <button
              type="button"
              onClick={() =>
                setViewMode("grid")
              }
              className={`shrink-0 p-3 rounded-xl ${
                viewMode === "grid"
                  ? "bg-[#C96B1D] text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              <FiGrid />
            </button>

            {/* LIST */}

            <button
              type="button"
              onClick={() =>
                setViewMode("list")
              }
              className={`shrink-0 p-3 rounded-xl ${
                viewMode === "list"
                  ? "bg-[#C96B1D] text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              <FiList />
            </button>

          </div>

        </div>
      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">

        {statsCards.map(
          (card, index) => (
            <motion.div
              key={card.title}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay:
                  index * 0.06,
              }}
              className="bg-white rounded-2xl shadow-sm border border-[#C96B1D]/10 p-4 sm:p-5 min-w-0"
            >

              <div
                className={`${card.bgColor} w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3`}
              >
                <card.icon
                  className={`w-5 h-5 ${card.iconColor}`}
                />
              </div>

              <p className="text-gray-500 text-xs sm:text-sm truncate">
                {card.title}
              </p>

              <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1 truncate">
                {card.value}
              </p>

            </motion.div>
          )
        )}

      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="mb-6 w-full overflow-hidden">

        <div
          className="
            flex
            gap-2
            overflow-x-auto
            pb-2
            scrollbar-thin
            scrollbar-thumb-gray-300
            scrollbar-track-transparent
            w-full
          "
          style={{
            WebkitOverflowScrolling:
              "touch",
          }}
        >

          {[
            [
              "all",
              "All Customers",
            ],
            [
              "high",
              "High Value ₹2000+",
            ],
            [
              "medium",
              "Medium ₹1000–₹2000",
            ],
            [
              "low",
              "Low < ₹1000",
            ],
          ].map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setFilterBy(value)
                }
                className={`
                  shrink-0
                  whitespace-nowrap
                  px-4
                  py-2.5
                  rounded-xl
                  text-sm
                  font-medium
                  border
                  transition-all
                  ${
                    filterBy === value
                      ? "bg-[#C96B1D] text-white border-[#C96B1D] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#C96B1D]/40"
                  }
                `}
              >
                {label}
              </button>
            )
          )}

        </div>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading &&
      customers.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-[#C96B1D] border-t-transparent animate-spin" />
        </div>
      ) : filteredCustomers.length ===
        0 ? (

        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <FiUsers className="w-14 h-14 mx-auto text-gray-300 mb-4" />

          <h3 className="text-lg font-semibold text-gray-700">
            No customers found
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            Add your first customer using
            the + button.
          </p>
        </div>

      ) : viewMode === "grid" ? (

        /* =================================================
           GRID VIEW
        ================================================= */

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">

          {filteredCustomers.map(
            (customer, index) => {

              const gradient =
                getAvatarGradient(
                  customer.name
                );

              const statusText =
                getStatusText(
                  customer
                );

              const statusColor =
                getStatusColor(
                  customer
                );

              const measurements =
                getMeasurements(
                  customer
                );

              return (
                <motion.div
                  key={customer._id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.03,
                  }}
                  className="
                    bg-white
                    rounded-2xl
                    shadow-sm
                    border
                    border-[#C96B1D]/10
                    overflow-hidden
                    min-w-0
                  "
                >

                  {/* HEADER */}

                  <div className="p-4 sm:p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3 min-w-0">

                        <div
                          className={`
                            shrink-0
                            w-11
                            h-11
                            sm:w-12
                            sm:h-12
                            bg-gradient-to-br
                            ${gradient}
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            text-white
                            font-bold
                            text-lg
                          `}
                        >
                          {customer.name?.charAt(
                            0
                          ) || "?"}
                        </div>

                        <div className="min-w-0">

                          <h3 className="font-bold text-gray-800 truncate">
                            {customer.name}
                          </h3>

                          <p className="text-xs text-gray-400 font-mono truncate">
                            {customer.customerId}
                          </p>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex gap-1 shrink-0">

                        <button
                          type="button"
                          title="Edit customer"
                          onClick={() =>
                            openEditModal(
                              customer
                            )
                          }
                          className="p-2 rounded-lg text-[#C96B1D] hover:bg-orange-50 active:bg-orange-100"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          title="Delete customer"
                          onClick={() =>
                            handleDeleteCustomer(
                              customer
                            )
                          }
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 active:bg-red-100"
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="flex flex-wrap items-center gap-2 mt-3">

                      <span
                        className={`
                          px-2.5
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${statusColor}
                        `}
                      >
                        {statusText}
                      </span>

                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FiCalendar />

                        {customer.createdAt
                          ? new Date(
                              customer.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </span>

                    </div>

                  </div>

                  {/* CONTACT */}

                  <div className="px-4 sm:px-5 pb-4 space-y-2">

                    <div className="flex items-start gap-2 text-sm text-gray-600 min-w-0">

                      <FiPhone className="text-[#C96B1D] mt-0.5 shrink-0" />

                      <span className="break-all">
                        {customer.phone}
                      </span>

                    </div>

                    {customer.email ? (
                      <div className="flex items-start gap-2 text-sm text-gray-600 min-w-0">

                        <FiMail className="text-[#C96B1D] mt-0.5 shrink-0" />

                        <span className="break-all">
                          {customer.email}
                        </span>

                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">
                        No email added
                      </div>
                    )}

                  </div>

                  {/* =================================================
                      MEASUREMENTS PREVIEW
                  ================================================= */}

                  {measurements.length > 0 && (

                    <div className="px-4 sm:px-5 pb-4">

                      <div className="flex items-center justify-between mb-2">

                        <p className="text-xs font-semibold text-gray-500">
                          Measurements
                        </p>

                        <span className="text-[11px] text-gray-400">
                          {measurements.length}{" "}
                          saved
                        </span>

                      </div>

                      {/* IMPORTANT:
                          Responsive measurement grid.
                          No fixed height.
                          Nothing is hidden behind FAB.
                      */}

                      <div className="grid grid-cols-2 gap-2">

                        {measurements.map(
                          (
                            measurement,
                            i
                          ) => (

                            <div
                              key={i}
                              className="
                                min-w-0
                                rounded-xl
                                bg-[#FAF7F2]
                                border
                                border-orange-100
                                px-3
                                py-2.5
                              "
                            >

                              <p
                                className="
                                  text-[11px]
                                  text-gray-500
                                  leading-4
                                  break-words
                                  whitespace-normal
                                "
                              >
                                {measurement.name ||
                                  "Measurement"}
                              </p>

                              <p
                                className="
                                  text-sm
                                  sm:text-base
                                  font-bold
                                  text-[#C96B1D]
                                  mt-0.5
                                  break-words
                                "
                              >
                                {measurement.value ||
                                  "-"}
                              </p>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

                  {/* PRICE */}

                  <div className="px-4 sm:px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-3">

                    <div className="flex items-center gap-2 text-gray-500 text-sm min-w-0">

                      <FiHeart className="text-red-400 shrink-0" />

                      <span className="truncate">
                        {statusText}
                      </span>

                    </div>

                    <div className="text-right shrink-0">

                      <p className="text-lg sm:text-xl font-bold text-[#C96B1D]">
                        ₹
                        {Number(
                          customer.price ||
                            0
                        ).toLocaleString()}
                      </p>

                      <p className="text-[11px] text-gray-400">
                        Total order
                      </p>

                    </div>

                  </div>

                  {/* FOOTER */}

                  <div className="px-4 sm:px-5 py-3 bg-gray-50 flex items-center justify-between gap-2">

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(
                          customer
                        );

                        setShowDetailModal(
                          true
                        );
                      }}
                      className="
                        text-sm
                        font-medium
                        text-[#C96B1D]
                        flex
                        items-center
                        gap-1
                        min-w-0
                      "
                    >
                      <FiEye className="shrink-0" />

                      <span className="truncate">
                        View Details
                      </span>
                    </button>

                    <div className="flex gap-1 shrink-0">

                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-[#C96B1D]"
                      >
                        <FiShare2 />
                      </button>

                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-[#C96B1D]"
                      >
                        <FiMoreVertical />
                      </button>

                    </div>

                  </div>

                </motion.div>
              );
            }
          )}

        </div>

      ) : (

        /* =================================================
           LIST VIEW
        ================================================= */

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead className="bg-[#FAF7F2]">

                <tr>

                  <th className="text-left p-4 text-sm text-gray-600">
                    Customer
                  </th>

                  <th className="text-left p-4 text-sm text-gray-600">
                    Phone
                  </th>

                  <th className="text-left p-4 text-sm text-gray-600">
                    Email
                  </th>

                  <th className="text-left p-4 text-sm text-gray-600">
                    Amount
                  </th>

                  <th className="text-left p-4 text-sm text-gray-600">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCustomers.map(
                  (customer) => (

                    <tr
                      key={customer._id}
                      className="border-t border-gray-100 hover:bg-[#FAF7F2]"
                    >

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <div
                            className={`
                              w-10
                              h-10
                              bg-gradient-to-br
                              ${getAvatarGradient(
                                customer.name
                              )}
                              rounded-xl
                              flex
                              items-center
                              justify-center
                              text-white
                              font-bold
                            `}
                          >
                            {customer.name?.charAt(
                              0
                            )}
                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              {customer.name}
                            </p>

                            <p className="text-xs text-gray-400 font-mono">
                              {
                                customer.customerId
                              }
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="p-4 text-sm">
                        {customer.phone}
                      </td>

                      <td className="p-4 text-sm max-w-[220px] break-all">
                        {customer.email ||
                          "Not added"}
                      </td>

                      <td className="p-4 font-bold text-[#C96B1D]">
                        ₹
                        {Number(
                          customer.price ||
                            0
                        ).toLocaleString()}
                      </td>

                      <td className="p-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              openEditModal(
                                customer
                              )
                            }
                            className="p-2 text-[#C96B1D] hover:bg-orange-50 rounded-lg"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteCustomer(
                                customer
                              )
                            }
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedCustomer(
                                customer
                              );

                              setShowDetailModal(
                                true
                              );
                            }}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                            title="View"
                          >
                            <FiEye />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* =================================================
          FLOATING ADD BUTTON
          
          IMPORTANT MOBILE FIX:
          bottom-24 instead of bottom-20
          + pb-32 on page
          
          This keeps it above bottom navigation.
      ================================================= */}

      <motion.button
        onClick={openAddModal}
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.94,
        }}
        aria-label="Add customer"
        className="
          fixed
          right-4
          sm:right-6
          lg:right-8
          bottom-[88px]
          lg:bottom-8
          z-[900]
        "
      >

        <div
          className="
            w-14
            h-14
            sm:w-16
            sm:h-16
            bg-gradient-to-br
            from-[#C96B1D]
            to-[#b85e1a]
            rounded-full
            shadow-2xl
            flex
            items-center
            justify-center
            text-white
            border-4
            border-white
          "
        >
          <FiPlus className="w-7 h-7" />
        </div>

      </motion.button>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      <AnimatePresence>

        {showModal && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[999]
              bg-black/50
              flex
              items-center
              justify-center
              p-2
              sm:p-5
            "
            onClick={() =>
              setShowModal(false)
            }
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 15,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                bg-white
                rounded-2xl
                w-full
                max-w-3xl
                max-h-[96vh]
                overflow-y-auto
                overscroll-contain
              "
            >

              {/* HEADER */}

              <div className="sticky top-0 z-20 bg-white border-b border-gray-100 rounded-t-2xl">

                <div className="flex justify-between items-center p-4 sm:p-5 gap-3">

                  <div className="min-w-0">

                    <h2 className="text-lg sm:text-2xl font-bold text-[#5B2C18] flex items-center gap-2">

                      <FiUser className="text-[#C96B1D] shrink-0" />

                      <span className="truncate">
                        {editingCustomer
                          ? "Edit Customer"
                          : "Add New Customer"}
                      </span>

                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                      {editingCustomer
                        ? "Update customer information and measurements"
                        : "Enter customer details and custom measurements"}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(false)
                    }
                    className="
                      shrink-0
                      w-10
                      h-10
                      rounded-full
                      bg-red-500
                      hover:bg-red-600
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FiX />
                  </button>

                </div>

              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleSubmitCustomer
                }
                className="p-3 sm:p-5 space-y-4"
              >

                {/* BASIC INFORMATION */}

                <div className="border border-gray-200 rounded-xl overflow-hidden">

                  <button
                    type="button"
                    onClick={() =>
                      setIsBasicInfoOpen(
                        !isBasicInfoOpen
                      )
                    }
                    className="w-full flex justify-between items-center p-4 bg-gray-50"
                  >

                    <div className="flex items-center gap-2">

                      <FiUser className="text-[#C96B1D]" />

                      <span className="font-semibold text-gray-800">
                        Basic Information
                      </span>

                    </div>

                    {isBasicInfoOpen ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}

                  </button>

                  {isBasicInfoOpen && (

                    <div className="p-4">

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* NAME */}

                        <div>

                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                            <span className="text-red-500">
                              {" "}
                              *
                            </span>
                          </label>

                          <input
                            type="text"
                            required
                            value={
                              formData.name
                            }
                            onChange={(e) =>
                              handleFieldChange(
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Enter customer name"
                            className="
                              w-full
                              px-3
                              py-2.5
                              border
                              border-gray-300
                              rounded-xl
                              focus:ring-2
                              focus:ring-[#C96B1D]
                              focus:outline-none
                            "
                          />

                        </div>

                        {/* PHONE */}

                        <div>

                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                            <span className="text-red-500">
                              {" "}
                              *
                            </span>
                          </label>

                          <input
                            type="tel"
                            required
                            value={
                              formData.phone
                            }
                            onChange={(e) =>
                              handleFieldChange(
                                "phone",
                                e.target.value
                              )
                            }
                            placeholder="Enter phone number"
                            className="
                              w-full
                              px-3
                              py-2.5
                              border
                              border-gray-300
                              rounded-xl
                              focus:ring-2
                              focus:ring-[#C96B1D]
                              focus:outline-none
                            "
                          />

                        </div>

                        {/* EMAIL */}

                        <div>

                          <label className="block text-sm font-medium text-gray-700 mb-1">

                            Email Address

                            <span className="text-gray-400 text-xs ml-2">
                              Optional
                            </span>

                          </label>

                          <input
                            type="email"
                            value={
                              formData.email
                            }
                            onChange={(e) =>
                              handleFieldChange(
                                "email",
                                e.target.value
                              )
                            }
                            placeholder="customer@example.com"
                            className="
                              w-full
                              px-3
                              py-2.5
                              border
                              border-gray-300
                              rounded-xl
                              focus:ring-2
                              focus:ring-[#C96B1D]
                              focus:outline-none
                            "
                          />

                          <p className="text-xs text-gray-400 mt-1">
                            Email is optional. WhatsApp notifications use the phone number.
                          </p>

                        </div>

                        {/* PRICE */}

                        <div>

                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹)
                            <span className="text-red-500">
                              {" "}
                              *
                            </span>
                          </label>

                          <input
                            type="number"
                            min="0"
                            required
                            value={
                              formData.price
                            }
                            onChange={(e) =>
                              handleFieldChange(
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="Enter price"
                            className="
                              w-full
                              px-3
                              py-2.5
                              border
                              border-gray-300
                              rounded-xl
                              focus:ring-2
                              focus:ring-[#C96B1D]
                              focus:outline-none
                            "
                          />

                        </div>

                        {/* ADDRESS */}

                        <div className="sm:col-span-2">

                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                            <span className="text-gray-400 text-xs ml-2">
                              Optional
                            </span>
                          </label>

                          <textarea
                            rows="2"
                            value={
                              formData.address
                            }
                            onChange={(e) =>
                              handleFieldChange(
                                "address",
                                e.target.value
                              )
                            }
                            placeholder="Enter customer address"
                            className="
                              w-full
                              px-3
                              py-2.5
                              border
                              border-gray-300
                              rounded-xl
                              focus:ring-2
                              focus:ring-[#C96B1D]
                              focus:outline-none
                              resize-none
                            "
                          />

                        </div>

                      </div>

                    </div>

                  )}

                </div>

                {/* CUSTOM MEASUREMENTS */}

                <div className="border border-gray-200 rounded-xl overflow-hidden">

                  <button
                    type="button"
                    onClick={() =>
                      setIsMeasurementsOpen(
                        !isMeasurementsOpen
                      )
                    }
                    className="w-full flex justify-between items-center p-4 bg-gray-50"
                  >

                    <div className="flex items-center gap-2">

                      <FiTool className="text-[#C96B1D]" />

                      <div className="text-left">

                        <span className="font-semibold text-gray-800 block">
                          Custom Measurements
                        </span>

                        <span className="text-xs text-gray-400">
                          Add names in any language
                        </span>

                      </div>

                    </div>

                    {isMeasurementsOpen ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}

                  </button>

                  {isMeasurementsOpen && (

                    <div className="p-4">

                      <div className="bg-[#FAF7F2] rounded-xl p-3 mb-4">

                        <p className="text-xs text-gray-600 leading-5">
                          Example:
                          <span className="font-semibold ml-1">
                            Chest → 40
                          </span>

                          <span className="mx-2">
                            •
                          </span>

                          <span className="font-semibold">
                            छाती → 40
                          </span>

                          <span className="mx-2">
                            •
                          </span>

                          <span className="font-semibold">
                            कुर्ता लंबाई → 42
                          </span>
                        </p>

                      </div>

                      <div className="space-y-3">

                        {formData.measurements.map(
                          (
                            measurement,
                            index
                          ) => (

                            <div
                              key={index}
                              className="
                                grid
                                grid-cols-[minmax(0,1fr)_90px_42px]
                                sm:grid-cols-[minmax(0,1fr)_140px_44px]
                                gap-2
                                items-end
                              "
                            >

                              {/* NAME */}

                              <div className="min-w-0">

                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Measurement Name
                                </label>

                                <input
                                  type="text"
                                  value={
                                    measurement.name
                                  }
                                  onChange={(e) =>
                                    handleMeasurementChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Chest / छाती / Sleeve"
                                  className="
                                    w-full
                                    min-w-0
                                    px-3
                                    py-2.5
                                    border
                                    border-gray-300
                                    rounded-xl
                                    focus:ring-2
                                    focus:ring-[#C96B1D]
                                    focus:outline-none
                                  "
                                />

                              </div>

                              {/* VALUE */}

                              <div>

                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Value
                                </label>

                                <input
                                  type="text"
                                  value={
                                    measurement.value
                                  }
                                  onChange={(e) =>
                                    handleMeasurementChange(
                                      index,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  placeholder="40"
                                  className="
                                    w-full
                                    px-3
                                    py-2.5
                                    border
                                    border-gray-300
                                    rounded-xl
                                    focus:ring-2
                                    focus:ring-[#C96B1D]
                                    focus:outline-none
                                  "
                                />

                              </div>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  removeMeasurementRow(
                                    index
                                  )
                                }
                                className="
                                  h-11
                                  w-11
                                  flex
                                  items-center
                                  justify-center
                                  rounded-xl
                                  text-red-500
                                  hover:bg-red-50
                                "
                              >
                                <FiTrash2 />
                              </button>

                            </div>

                          )
                        )}

                      </div>

                      {/* ADD MEASUREMENT */}

                      <button
                        type="button"
                        onClick={
                          addMeasurementRow
                        }
                        className="
                          mt-4
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-semibold
                          text-[#C96B1D]
                        "
                      >
                        <FiPlusCircle />

                        Add Measurement
                      </button>

                    </div>

                  )}

                </div>

                {/* FOOTER */}

                <div
                  className="
                    sticky
                    bottom-0
                    bg-white
                    border-t
                    border-gray-100
                    pt-4
                    flex
                    flex-col-reverse
                    sm:flex-row
                    justify-end
                    gap-2
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(false)
                    }
                    className="
                      w-full
                      sm:w-auto
                      px-5
                      py-2.5
                      border
                      border-gray-300
                      rounded-xl
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      sm:w-auto
                      px-6
                      py-2.5
                      bg-[#C96B1D]
                      hover:bg-[#b85e1a]
                      text-white
                      rounded-xl
                      font-semibold
                      disabled:opacity-50
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >

                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />

                        Saving...
                      </>
                    ) : editingCustomer ? (
                      <>
                        <FiEdit2 />

                        Update Customer
                      </>
                    ) : (
                      <>
                        <FiPlus />

                        Add Customer
                      </>
                    )}

                  </button>

                </div>

              </form>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

      {/* =================================================
          CUSTOMER DETAILS MODAL
      ================================================= */}

      <AnimatePresence>

        {showDetailModal &&
          selectedCustomer && (

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="
                fixed
                inset-0
                z-[999]
                bg-black/50
                flex
                items-center
                justify-center
                p-2
                sm:p-4
              "
              onClick={() =>
                setShowDetailModal(false)
              }
            >

              <motion.div
                initial={{
                  scale: 0.96,
                  y: 15,
                }}
                animate={{
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  scale: 0.96,
                  y: 15,
                }}
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="
                  bg-white
                  rounded-2xl
                  max-w-2xl
                  w-full
                  max-h-[94vh]
                  overflow-y-auto
                  overscroll-contain
                "
              >

                {/* TOP */}

                <div className="relative">

                  <div className="h-24 sm:h-28 bg-gradient-to-r from-[#C96B1D] to-[#b85e1a]" />

                  <div className="absolute -bottom-10 left-5 sm:left-6">

                    <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">

                      <span className="text-3xl font-bold text-[#5B2C18]">
                        {selectedCustomer.name?.charAt(
                          0
                        )}
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowDetailModal(
                        false
                      )
                    }
                    className="
                      absolute
                      top-3
                      right-3
                      w-10
                      h-10
                      rounded-full
                      bg-red-500
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FiX />
                  </button>

                </div>

                <div className="p-4 sm:p-6 pt-14">

                  {/* TITLE */}

                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

                    <div className="min-w-0">

                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">
                        {selectedCustomer.name}
                      </h2>

                      <p className="text-sm text-gray-500 font-mono break-all">
                        {
                          selectedCustomer.customerId
                        }
                      </p>

                    </div>

                    <div className="text-left sm:text-right shrink-0">

                      <p className="text-2xl font-bold text-[#C96B1D]">
                        ₹
                        {Number(
                          selectedCustomer.price ||
                            0
                        ).toLocaleString()}
                      </p>

                      <p className="text-xs text-gray-400">
                        Total Order
                      </p>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-2 mb-6">

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(
                          selectedCustomer
                        )
                      }
                      className="
                        flex-1
                        bg-[#C96B1D]
                        text-white
                        py-2.5
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        gap-2
                        font-medium
                      "
                    >
                      <FiEdit2 />
                      Edit Customer
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteCustomer(
                          selectedCustomer
                        )
                      }
                      className="
                        px-4
                        bg-red-50
                        text-red-500
                        rounded-xl
                      "
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                  {/* CONTACT */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">

                    <div className="p-3 bg-gray-50 rounded-xl flex gap-3 min-w-0">

                      <FiPhone className="text-[#C96B1D] mt-1 shrink-0" />

                      <div className="min-w-0">

                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        <p className="font-medium break-all">
                          {
                            selectedCustomer.phone
                          }
                        </p>

                      </div>

                    </div>

                    {selectedCustomer.email && (

                      <div className="p-3 bg-gray-50 rounded-xl flex gap-3 min-w-0">

                        <FiMail className="text-[#C96B1D] mt-1 shrink-0" />

                        <div className="min-w-0">

                          <p className="text-xs text-gray-400">
                            Email
                          </p>

                          <p className="font-medium break-all">
                            {
                              selectedCustomer.email
                            }
                          </p>

                        </div>

                      </div>

                    )}

                    <div className="p-3 bg-gray-50 rounded-xl flex gap-3">

                      <FiCalendar className="text-[#C96B1D] mt-1 shrink-0" />

                      <div>

                        <p className="text-xs text-gray-400">
                          Customer Since
                        </p>

                        <p className="font-medium">
                          {selectedCustomer.createdAt
                            ? new Date(
                                selectedCustomer.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ADDRESS */}

                  {selectedCustomer.address && (

                    <div className="mb-6">

                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </p>

                      <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 break-words">
                        {
                          selectedCustomer.address
                        }
                      </div>

                    </div>

                  )}

                  {/* =================================================
                      FULL MEASUREMENTS
                  ================================================= */}

                  <div>

                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">

                      <FiTool className="text-[#C96B1D]" />

                      Measurements

                    </h3>

                    {getMeasurements(
                      selectedCustomer
                    ).length === 0 ? (

                      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-400">
                        No measurements added.
                      </div>

                    ) : (

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">

                        {getMeasurements(
                          selectedCustomer
                        ).map(
                          (
                            measurement,
                            index
                          ) => (

                            <div
                              key={index}
                              className="
                                bg-[#FAF7F2]
                                rounded-xl
                                p-3
                                text-center
                                min-w-0
                                border
                                border-orange-100
                              "
                            >

                              <p className="text-xs text-gray-500 break-words whitespace-normal leading-4">
                                {
                                  measurement.name
                                }
                              </p>

                              <p className="text-lg font-bold text-[#C96B1D] mt-1 break-words">
                                {
                                  measurement.value
                                }
                              </p>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                </div>

              </motion.div>

            </motion.div>

          )}

      </AnimatePresence>

    </div>
  );
};

export default Customers;