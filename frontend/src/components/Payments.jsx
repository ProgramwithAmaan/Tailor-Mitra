import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

import {
  FiDollarSign,
  FiPlus,
  FiX,
  FiCreditCard,
  FiSmartphone,
  FiTrendingUp,
  FiCheckCircle,
  FiDownload,
  FiClock,
  FiSearch,
  FiMessageSquare,
  FiUsers,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiAlertCircle,
  FiUser,
  FiPhone,
  FiPackage,
  FiSave,
} from "react-icons/fi";

import { getCustomers } from "../api";
import toast from "react-hot-toast";

/* =========================================================
   CONSTANTS
========================================================= */

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "partial",
  "advance",
];

const PAYMENT_METHODS = [
  "cash",
  "upi",
  "card",
  "bank",
];

/* =========================================================
   COMPONENT
========================================================= */

const Payments = () => {
  /* =========================================================
     USER
  ========================================================= */

  const getLoggedInUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const getUserKey = () => {
    const user = getLoggedInUser();

    const id =
      user?._id ||
      user?.id ||
      user?.userId ||
      user?.profile?._id;

    const email =
      user?.email ||
      user?.profile?.email;

    const key = id || email;

    if (!key) return "guest";

    return String(key)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_");
  };

  const userKey = getUserKey();

  const paymentsStorageKey =
    `paymentsData_${userKey}`;

  const customersStorageKey =
    `customersData_${userKey}`;

  /* =========================================================
     EMPTY PAYMENT
  ========================================================= */

  const getEmptyPayment = () => ({
    _id: "",
    tailorId: userKey,
    customerId: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    amount: "",
    method: "cash",
    status: "pending",
    date: new Date()
      .toISOString()
      .split("T")[0],
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    description: "",
    orderId: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  /* =========================================================
     LOAD LOCAL DATA
  ========================================================= */

  const loadPayments = () => {
    try {
      const saved =
        localStorage.getItem(
          paymentsStorageKey
        );

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        "Error loading payments:",
        error
      );

      return [];
    }
  };

  const loadCustomers = () => {
    try {
      const saved =
        localStorage.getItem(
          customersStorageKey
        );

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        "Error loading customers:",
        error
      );

      return [];
    }
  };

  /* =========================================================
     STATE
  ========================================================= */

  const [payments, setPayments] =
    useState(loadPayments);

  const [customers, setCustomers] =
    useState(loadCustomers);

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [showAddPayment, setShowAddPayment] =
    useState(false);

  const [showEditPayment, setShowEditPayment] =
    useState(false);

  const [showDetailModal, setShowDetailModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  const [paymentToDelete, setPaymentToDelete] =
    useState(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("newest");

  const [newPayment, setNewPayment] =
    useState(getEmptyPayment);

  const [editPayment, setEditPayment] =
    useState(getEmptyPayment);

  /* =========================================================
     SAVE PAYMENTS
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      paymentsStorageKey,
      JSON.stringify(payments)
    );
  }, [
    payments,
    paymentsStorageKey,
  ]);

  /* =========================================================
     SAVE CUSTOMERS
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      customersStorageKey,
      JSON.stringify(customers)
    );
  }, [
    customers,
    customersStorageKey,
  ]);

  /* =========================================================
     FETCH CUSTOMERS
  ========================================================= */

  useEffect(() => {
    fetchRealCustomers();
  }, []);

  const fetchRealCustomers = async () => {
    setLoading(true);

    try {
      const response =
        await getCustomers();

      const serverCustomers =
        Array.isArray(response?.data)
          ? response.data
          : [];

      if (serverCustomers.length > 0) {
        setCustomers(serverCustomers);

        localStorage.setItem(
          customersStorageKey,
          JSON.stringify(
            serverCustomers
          )
        );
      }
    } catch (error) {
      console.error(
        "Unable to load customers:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     REFRESH
  ========================================================= */

  const handleRefresh = async () => {
    setRefreshing(true);

    await fetchRealCustomers();

    setRefreshing(false);

    toast.success(
      "Data refreshed!"
    );
  };

  /* =========================================================
     CUSTOMER OPTIONS
  ========================================================= */

  const customerOptions = useMemo(() => {
    return customers
      .filter(
        customer =>
          customer?.name &&
          customer.name !== "Unknown"
      )
      .map(customer => ({
        value: customer._id,
        label: customer.name,
        phone: customer.phone || "",
        customerId:
          customer.customerId || "",
        email:
          customer.email || "",
        price:
          Number(customer.price) || 0,
      }));
  }, [customers]);

  /* =========================================================
     CUSTOMER OPTION UI
  ========================================================= */

  const formatCustomerOption = (
    option
  ) => {
    if (!option) return null;

    return (
      <div className="flex items-center gap-3 py-1">
        <div
          className="
            w-9 h-9
            rounded-lg
            bg-gradient-to-br
            from-[#4F7CFF]
            to-[#8B7CFF]
            text-white
            flex items-center
            justify-center
            font-semibold
            text-sm
          "
        >
          {option.label
            ?.charAt(0)
            ?.toUpperCase() || "?"}
        </div>

        <div className="min-w-0">
          <p className="font-medium text-[#161A2B] truncate">
            {option.label}
          </p>

          <div className="flex gap-2 text-xs text-gray-500">
            {option.phone && (
              <span>
                {option.phone}
              </span>
            )}

            {option.phone &&
              option.customerId && (
                <span>•</span>
              )}

            {option.customerId && (
              <span>
                {option.customerId}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* =========================================================
     SELECT CUSTOMER
  ========================================================= */

  const handleCustomerSelect = (
    customerId,
    isEdit = false
  ) => {
    const customer =
      customers.find(
        c =>
          String(c._id) ===
          String(customerId)
      );

    if (!customer) return;

    const data = {
      customerId:
        customer._id,

      customerName:
        customer.name || "",

      customerPhone:
        customer.phone || "",

      customerEmail:
        customer.email || "",

      orderId:
        customer.customerId ||
        `ORD-${Math.floor(
          Math.random() * 9000
        ) + 1000}`,

      amount:
        customer.price
          ? String(customer.price)
          : "",
    };

    if (isEdit) {
      setEditPayment(prev => ({
        ...prev,
        ...data,
      }));
    } else {
      setNewPayment(prev => ({
        ...prev,
        ...data,
      }));
    }
  };

  /* =========================================================
     PAYMENT UNIQUE KEY
  ========================================================= */

  const getPaymentKey = payment => {
    const customerId =
      payment?.customerId || "";

    const customer =
      customers.find(
        c =>
          String(c._id) ===
          String(customerId)
      );

    const orderId =
      payment?.orderId ||
      customer?.customerId ||
      "";

    return `${customerId}__${orderId}`;
  };

  /* =========================================================
     NORMALIZE DUPLICATES
  ========================================================= */

  const normalizePayments = (
    paymentList
  ) => {
    const map = new Map();

    paymentList.forEach(payment => {
      const key =
        getPaymentKey(payment);

      if (!key) return;

      const existing =
        map.get(key);

      if (!existing) {
        map.set(key, payment);
        return;
      }

      const existingDate =
        new Date(
          existing.updatedAt ||
          existing.date ||
          0
        ).getTime();

      const currentDate =
        new Date(
          payment.updatedAt ||
          payment.date ||
          0
        ).getTime();

      if (
        currentDate >=
        existingDate
      ) {
        map.set(key, payment);
      }
    });

    return Array.from(
      map.values()
    );
  };

  /* =========================================================
     CLEAN DUPLICATES
  ========================================================= */

  useEffect(() => {
    const normalized =
      normalizePayments(
        payments
      );

    if (
      normalized.length !==
      payments.length
    ) {
      setPayments(normalized);

      toast.success(
        "Duplicate payment records cleaned!"
      );
    }
  }, []);

  /* =========================================================
     ADD PAYMENT
     OR UPDATE EXISTING CUSTOMER PAYMENT
  ========================================================= */

  const handleAddPayment = e => {
    e.preventDefault();

    if (
      !newPayment.customerId ||
      !newPayment.amount
    ) {
      toast.error(
        "Please select customer and enter amount"
      );
      return;
    }

    const existingIndex =
      payments.findIndex(
        payment =>
          getPaymentKey(payment) ===
          getPaymentKey(newPayment)
      );

    const now =
      new Date().toISOString();

    /* =====================================================
       UPDATE EXISTING PAYMENT
    ===================================================== */

    if (existingIndex !== -1) {
      const updatedPayments =
        [...payments];

      updatedPayments[
        existingIndex
      ] = {
        ...updatedPayments[
          existingIndex
        ],

        customerId:
          newPayment.customerId,

        customerName:
          newPayment.customerName,

        customerPhone:
          newPayment.customerPhone,

        customerEmail:
          newPayment.customerEmail,

        amount:
          Number(
            newPayment.amount
          ),

        method:
          newPayment.method,

        status:
          newPayment.status,

        date:
          newPayment.date,

        description:
          newPayment.description,

        orderId:
          newPayment.orderId,

        updatedAt: now,
      };

      setPayments(
        updatedPayments
      );

      toast.success(
        `Payment updated to ${newPayment.status.toUpperCase()}`
      );
    }

    /* =====================================================
       CREATE NEW PAYMENT
    ===================================================== */

    else {
      const paymentData = {
        ...newPayment,

        _id:
          `pay_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 7)}`,

        tailorId:
          userKey,

        amount:
          Number(
            newPayment.amount
          ),

        createdAt: now,

        updatedAt: now,
      };

      setPayments(prev => [
        paymentData,
        ...prev,
      ]);

      toast.success(
        `Payment of ₹${newPayment.amount} recorded successfully!`
      );
    }

    setShowAddPayment(false);

    setNewPayment(
      getEmptyPayment()
    );
  };

  /* =========================================================
     EDIT PAYMENT
  ========================================================= */

  const handleEditPayment = payment => {
    const customer =
      customers.find(
        c =>
          String(c._id) ===
          String(
            payment.customerId
          )
      );

    setEditPayment({
      ...payment,

      customerName:
        payment.customerName ||
        customer?.name ||
        "",

      customerPhone:
        payment.customerPhone ||
        customer?.phone ||
        "",

      customerEmail:
        payment.customerEmail ||
        customer?.email ||
        "",

      amount:
        String(
          payment.amount || ""
        ),

      method:
        payment.method ||
        "cash",

      status:
        payment.status ||
        "pending",

      date:
        payment.date ||
        new Date()
          .toISOString()
          .split("T")[0],

      description:
        payment.description ||
        "",

      orderId:
        payment.orderId ||
        customer?.customerId ||
        "",
    });

    setShowDetailModal(false);

    setShowEditPayment(true);
  };

  /* =========================================================
     UPDATE PAYMENT
  ========================================================= */

  const handleUpdatePayment = e => {
    e.preventDefault();

    if (!editPayment._id) {
      toast.error(
        "Payment record not found"
      );
      return;
    }

    if (!editPayment.amount) {
      toast.error(
        "Please enter payment amount"
      );
      return;
    }

    const updatedPayments =
      payments.map(payment => {
        if (
          payment._id !==
          editPayment._id
        ) {
          return payment;
        }

        return {
          ...payment,

          amount:
            Number(
              editPayment.amount
            ),

          method:
            editPayment.method,

          status:
            editPayment.status,

          date:
            editPayment.date,

          description:
            editPayment.description,

          updatedAt:
            new Date().toISOString(),
        };
      });

    setPayments(
      updatedPayments
    );

    setShowEditPayment(false);

    setEditPayment(
      getEmptyPayment()
    );

    toast.success(
      `Payment updated to ${editPayment.status.toUpperCase()}`
    );
  };

  /* =========================================================
     DELETE PAYMENT
  ========================================================= */

  const handleDeletePayment =
    paymentId => {
      setPaymentToDelete(
        paymentId
      );

      setShowDeleteModal(true);
    };

  const confirmDeletePayment = () => {
    if (!paymentToDelete) return;

    const updatedPayments =
      payments.filter(
        payment =>
          payment._id !==
          paymentToDelete
      );

    setPayments(
      updatedPayments
    );

    setShowDeleteModal(false);

    setPaymentToDelete(null);

    toast.success(
      "Payment deleted successfully!"
    );
  };

  /* =========================================================
     CUSTOMER HELPERS
  ========================================================= */

  const getCustomer = customerId => {
    return customers.find(
      customer =>
        String(customer._id) ===
        String(customerId)
    );
  };

  const getCustomerName =
    customerId => {
      const customer =
        getCustomer(customerId);

      return (
        customer?.name ||
        "Customer"
      );
    };

  const getCustomerOrderId =
    customerId => {
      const customer =
        getCustomer(customerId);

      return (
        customer?.customerId ||
        "N/A"
      );
    };

  /* =========================================================
     STATISTICS
  ========================================================= */

  const todayTotal =
    payments
      .filter(payment => {
        if (!payment.date)
          return false;

        const date =
          new Date(
            payment.date
          );

        return (
          date.toDateString() ===
          new Date().toDateString()
        );
      })
      .filter(
        payment =>
          payment.status ===
            "paid" ||
          payment.status ===
            "completed"
      )
      .reduce(
        (sum, payment) =>
          sum +
          (Number(
            payment.amount
          ) || 0),
        0
      );

  const pendingTotal =
    payments
      .filter(
        payment =>
          payment.status ===
          "pending"
      )
      .reduce(
        (sum, payment) =>
          sum +
          (Number(
            payment.amount
          ) || 0),
        0
      );

  const advanceTotal =
    payments
      .filter(
        payment =>
          payment.status ===
            "advance" ||
          payment.status ===
            "partial"
      )
      .reduce(
        (sum, payment) =>
          sum +
          (Number(
            payment.amount
          ) || 0),
        0
      );

  const paidCustomers =
    new Set(
      payments
        .filter(
          payment =>
            payment.status ===
              "paid" ||
            payment.status ===
              "completed"
        )
        .map(
          payment =>
            payment.customerId
        )
    ).size;

  /* =========================================================
     STATUS COLORS
  ========================================================= */

  const getStatusColor =
    status => {
      const colors = {
        paid:
          "bg-green-50 text-green-600 border-green-200",

        completed:
          "bg-green-50 text-green-600 border-green-200",

        pending:
          "bg-red-50 text-red-600 border-red-200",

        partial:
          "bg-yellow-50 text-yellow-600 border-yellow-200",

        advance:
          "bg-purple-50 text-purple-600 border-purple-200",
      };

      return (
        colors[status] ||
        colors.pending
      );
    };

  const getStatusIcon =
    status => {
      const icons = {
        paid: FiCheckCircle,
        completed:
          FiCheckCircle,
        pending: FiClock,
        partial:
          FiAlertCircle,
        advance:
          FiDollarSign,
      };

      return (
        icons[status] ||
        FiClock
      );
    };

  /* =========================================================
     PAYMENT METHOD
  ========================================================= */

  const getMethodColor =
    method => {
      const colors = {
        upi:
          "bg-purple-50 text-purple-600 border-purple-200",

        cash:
          "bg-green-50 text-green-600 border-green-200",

        card:
          "bg-blue-50 text-blue-600 border-blue-200",

        bank:
          "bg-orange-50 text-orange-600 border-orange-200",
      };

      return (
        colors[method] ||
        "bg-gray-50 text-gray-600 border-gray-200"
      );
    };

  const getMethodIcon =
    method => {
      const icons = {
        upi: FiSmartphone,
        cash: FiDollarSign,
        card: FiCreditCard,
        bank: FiTrendingUp,
      };

      return (
        icons[method] ||
        FiDollarSign
      );
    };

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredPayments =
    payments.filter(payment => {
      const customer =
        getCustomer(
          payment.customerId
        );

      const name =
        customer?.name ||
        payment.customerName ||
        "";

      const phone =
        customer?.phone ||
        payment.customerPhone ||
        "";

      const orderId =
        payment.orderId ||
        customer?.customerId ||
        "";

      const search =
        searchQuery
          .toLowerCase()
          .trim();

      const matchesSearch =
        !search ||
        name
          .toLowerCase()
          .includes(search) ||
        phone.includes(search) ||
        orderId
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        payment.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  /* =========================================================
     SORT
  ========================================================= */

  const sortedPayments =
    [...filteredPayments].sort(
      (a, b) => {
        const dateA =
          new Date(
            a.updatedAt ||
              a.date ||
              a.createdAt ||
              0
          );

        const dateB =
          new Date(
            b.updatedAt ||
              b.date ||
              b.createdAt ||
              0
          );

        if (
          sortBy ===
          "newest"
        ) {
          return dateB - dateA;
        }

        if (
          sortBy ===
          "oldest"
        ) {
          return dateA - dateB;
        }

        if (
          sortBy ===
          "highest"
        ) {
          return (
            Number(b.amount || 0) -
            Number(a.amount || 0)
          );
        }

        if (
          sortBy ===
          "lowest"
        ) {
          return (
            Number(a.amount || 0) -
            Number(b.amount || 0)
          );
        }

        return 0;
      }
    );

  /* =========================================================
     EXPORT EXCEL
  ========================================================= */

  const exportExcel = () => {
    try {
      if (
        sortedPayments.length ===
        0
      ) {
        toast.error(
          "No payment data to export"
        );
        return;
      }

      const excelData =
        sortedPayments.map(
          payment => {
            const customer =
              getCustomer(
                payment.customerId
              );

            return {
              Customer:
                customer?.name ||
                payment.customerName ||
                "Customer",

              Phone:
                customer?.phone ||
                payment.customerPhone ||
                "",

              Email:
                customer?.email ||
                payment.customerEmail ||
                "",

              "Customer ID":
                customer?.customerId ||
                payment.orderId ||
                "",

              Date:
                payment.date
                  ? new Date(
                      payment.date
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "",

              Amount:
                Number(
                  payment.amount
                ) || 0,

              Method:
                (
                  payment.method ||
                  ""
                ).toUpperCase(),

              Status:
                (
                  payment.status ||
                  ""
                ).toUpperCase(),

              Description:
                payment.description ||
                "",
            };
          }
        );

      const worksheet =
        XLSX.utils.json_to_sheet(
          excelData
        );

      /* Column widths */

      worksheet["!cols"] = [
        { wch: 22 },
        { wch: 15 },
        { wch: 28 },
        { wch: 20 },
        { wch: 14 },
        { wch: 14 },
        { wch: 12 },
        { wch: 14 },
        { wch: 30 },
      ];

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Payments"
      );

      const date =
        new Date()
          .toISOString()
          .split("T")[0];

      XLSX.writeFile(
        workbook,
        `Tailor-Payments-${date}.xlsx`
      );

      toast.success(
        "Excel file exported successfully!"
      );
    } catch (error) {
      console.error(
        "Excel export error:",
        error
      );

      toast.error(
        "Failed to export Excel"
      );
    }
  };

  /* =========================================================
     EXPORT PDF
  ========================================================= */

  const exportPDF = () => {
    try {
      if (
        sortedPayments.length ===
        0
      ) {
        toast.error(
          "No payment data to export"
        );
        return;
      }

      const user =
        getLoggedInUser();

      const shopName =
        user?.shopDetails
          ?.shopName ||
        user?.profile?.name ||
        "Tailor Management System";

      const shopPhone =
        user?.profile?.phone ||
        "";

      const doc =
        new jsPDF({
          orientation:
            "landscape",
          unit: "mm",
          format: "a4",
        });

      const pageWidth =
        doc.internal.pageSize
          .getWidth();

      const pageHeight =
        doc.internal.pageSize
          .getHeight();

      /* Header */

      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");

      doc.text(
        shopName,
        15,
        18
      );

      doc.setFontSize(10);
      doc.setFont(
        "helvetica",
        "normal"
      );

      if (shopPhone) {
        doc.text(
          `Phone: ${shopPhone}`,
          15,
          25
        );
      }

      doc.setFontSize(16);
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "Payment Report",
        pageWidth - 15,
        18,
        {
          align: "right",
        }
      );

      doc.setFontSize(9);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `Generated: ${new Date().toLocaleString(
          "en-IN"
        )}`,
        pageWidth - 15,
        25,
        {
          align: "right",
        }
      );

      /* Line */

      doc.setDrawColor(
        220,
        220,
        220
      );

      doc.line(
        15,
        30,
        pageWidth - 15,
        30
      );

      /* Summary */

      const summaryY = 40;

      doc.setFontSize(10);
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        `Today's Collection: ₹${todayTotal.toLocaleString(
          "en-IN"
        )}`,
        15,
        summaryY
      );

      doc.text(
        `Pending: ₹${pendingTotal.toLocaleString(
          "en-IN"
        )}`,
        90,
        summaryY
      );

      doc.text(
        `Advance: ₹${advanceTotal.toLocaleString(
          "en-IN"
        )}`,
        155,
        summaryY
      );

      doc.text(
        `Paid Customers: ${paidCustomers}`,
        225,
        summaryY
      );

      /* Table */

      let y = 52;

      const columns = [
        {
          title: "Customer",
          x: 15,
          width: 42,
        },
        {
          title: "Phone",
          x: 57,
          width: 30,
        },
        {
          title: "Order ID",
          x: 87,
          width: 35,
        },
        {
          title: "Date",
          x: 122,
          width: 28,
        },
        {
          title: "Amount",
          x: 150,
          width: 28,
        },
        {
          title: "Method",
          x: 178,
          width: 28,
        },
        {
          title: "Status",
          x: 206,
          width: 28,
        },
        {
          title: "Description",
          x: 234,
          width: 48,
        },
      ];

      /* Header background */

      doc.setFillColor(
        79,
        124,
        255
      );

      doc.rect(
        15,
        y - 6,
        pageWidth - 30,
        9,
        "F"
      );

      doc.setTextColor(
        255,
        255,
        255
      );

      doc.setFontSize(8);
      doc.setFont(
        "helvetica",
        "bold"
      );

      columns.forEach(
        column => {
          doc.text(
            column.title,
            column.x + 2,
            y
          );
        }
      );

      y += 10;

      doc.setTextColor(
        30,
        30,
        30
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(7.5);

      /* Rows */

      sortedPayments.forEach(
        (payment, index) => {
          const customer =
            getCustomer(
              payment.customerId
            );

          const customerName =
            customer?.name ||
            payment.customerName ||
            "Customer";

          const phone =
            customer?.phone ||
            payment.customerPhone ||
            "";

          const orderId =
            payment.orderId ||
            customer?.customerId ||
            "";

          const date =
            payment.date
              ? new Date(
                  payment.date
                ).toLocaleDateString(
                  "en-IN"
                )
              : "";

          const amount =
            `₹${Number(
              payment.amount || 0
            ).toLocaleString(
              "en-IN"
            )}`;

          const method =
            (
              payment.method ||
              ""
            ).toUpperCase();

          const status =
            (
              payment.status ||
              ""
            ).toUpperCase();

          const description =
            payment.description ||
            "";

          /* New page */

          if (
            y >
            pageHeight - 20
          ) {
            doc.addPage();

            y = 20;

            doc.setFillColor(
              79,
              124,
              255
            );

            doc.rect(
              15,
              y - 6,
              pageWidth - 30,
              9,
              "F"
            );

            doc.setTextColor(
              255,
              255,
              255
            );

            columns.forEach(
              column => {
                doc.text(
                  column.title,
                  column.x + 2,
                  y
                );
              }
            );

            y += 10;

            doc.setTextColor(
              30,
              30,
              30
            );
          }

          /* Alternate row */

          if (index % 2 === 0) {
            doc.setFillColor(
              248,
              249,
              252
            );

            doc.rect(
              15,
              y - 5,
              pageWidth - 30,
              8,
              "F"
            );
          }

          doc.text(
            String(
              customerName
            ).slice(0, 24),
            17,
            y
          );

          doc.text(
            String(
              phone
            ).slice(0, 16),
            59,
            y
          );

          doc.text(
            String(
              orderId
            ).slice(0, 20),
            89,
            y
          );

          doc.text(
            date,
            124,
            y
          );

          doc.text(
            amount,
            152,
            y
          );

          doc.text(
            method.slice(0, 12),
            180,
            y
          );

          doc.text(
            status.slice(0, 12),
            208,
            y
          );

          doc.text(
            String(
              description
            ).slice(0, 30),
            236,
            y
          );

          y += 8;
        }
      );

      /* Footer */

      const totalAmount =
        sortedPayments.reduce(
          (sum, payment) =>
            sum +
            (Number(
              payment.amount
            ) || 0),
          0
        );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(9);

      doc.text(
        `Total Records: ${sortedPayments.length}`,
        15,
        pageHeight - 10
      );

      doc.text(
        `Total Amount: ₹${totalAmount.toLocaleString(
          "en-IN"
        )}`,
        pageWidth - 15,
        pageHeight - 10,
        {
          align: "right",
        }
      );

      /* Download */

      const date =
        new Date()
          .toISOString()
          .split("T")[0];

      doc.save(
        `Tailor-Payments-${date}.pdf`
      );

      toast.success(
        "PDF exported successfully!"
      );
    } catch (error) {
      console.error(
        "PDF export error:",
        error
      );

      toast.error(
        "Failed to export PDF"
      );
    }
  };

  /* =========================================================
     STATS
  ========================================================= */

  const statsCards = [
    {
      title:
        "TODAY'S COLLECTION",
      value:
        `₹${todayTotal.toLocaleString(
          "en-IN"
        )}`,
      icon: FiDollarSign,
      gradient:
        "from-blue-500 to-blue-600",
    },

    {
      title:
        "PENDING AMOUNT",
      value:
        `₹${pendingTotal.toLocaleString(
          "en-IN"
        )}`,
      icon: FiClock,
      gradient:
        "from-orange-500 to-red-500",
    },

    {
      title:
        "ADVANCE BALANCE",
      value:
        `₹${advanceTotal.toLocaleString(
          "en-IN"
        )}`,
      icon: FiCreditCard,
      gradient:
        "from-purple-500 to-purple-600",
    },

    {
      title:
        "PAID CUSTOMERS",
      value:
        paidCustomers,
      icon: FiUsers,
      gradient:
        "from-green-500 to-green-600",
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full bg-[#F5F7FC] min-h-screen p-4">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          flex
          flex-col
          sm:flex-row
          justify-between
          items-start
          sm:items-center
          mb-6
        "
      >
        <div>
          <h1 className="text-2xl font-bold text-[#161A2B]">
            Payment Management
          </h1>

          <p className="text-sm text-[#6B7280] mt-1">
            Manage customer payments,
            pending dues, advance payments
            and transaction history.
          </p>
        </div>

        <motion.button
          whileHover={{
            rotate: 180,
          }}
          whileTap={{
            scale: 0.9,
          }}
          onClick={
            handleRefresh
          }
          className="
            mt-3
            sm:mt-0
            p-2.5
            bg-white
            rounded-lg
            border
            border-[#EDF0F7]
            shadow-sm
          "
        >
          <FiRefreshCw
            className={`
              w-5 h-5
              text-gray-500
              ${
                refreshing
                  ? "animate-spin"
                  : ""
              }
            `}
          />
        </motion.button>
      </motion.div>

      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <div className="flex flex-wrap gap-3 mb-6">

        {/* Collect Payment */}

        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={() => {
            setNewPayment(
              getEmptyPayment()
            );

            setShowAddPayment(
              true
            );
          }}
          className="
            bg-[#4F7CFF]
            hover:bg-[#3D63E0]
            text-white
            font-medium
            py-2.5
            px-5
            rounded-xl
            flex
            items-center
            gap-2
            text-sm
            shadow-sm
          "
        >
          <FiPlus />
          Collect Payment
        </motion.button>

        {/* PDF */}

        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={
            exportPDF
          }
          className="
            bg-white
            hover:bg-gray-50
            text-[#161A2B]
            font-medium
            py-2.5
            px-5
            rounded-xl
            flex
            items-center
            gap-2
            text-sm
            border
            border-[#EDF0F7]
            shadow-sm
          "
        >
          <FiDownload />
          Export PDF
        </motion.button>

        {/* Excel */}

        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={
            exportExcel
          }
          className="
            bg-white
            hover:bg-gray-50
            text-[#161A2B]
            font-medium
            py-2.5
            px-5
            rounded-xl
            flex
            items-center
            gap-2
            text-sm
            border
            border-[#EDF0F7]
            shadow-sm
          "
        >
          <FiDownload />
          Export Excel
        </motion.button>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="
        grid
        grid-cols-2
        lg:grid-cols-4
        gap-4
        mb-6
      ">
        {statsCards.map(
          (card, index) => {
            const Icon =
              card.icon;

            return (
              <motion.div
                key={
                  card.title
                }
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.08,
                }}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                }}
                className={`
                  bg-gradient-to-br
                  ${card.gradient}
                  rounded-xl
                  p-5
                  text-white
                  shadow-lg
                `}
              >
                <div className="
                  w-10 h-10
                  bg-white/20
                  rounded-full
                  flex
                  items-center
                  justify-center
                ">
                  <Icon />
                </div>

                <p className="
                  text-2xl
                  font-bold
                  mt-3
                ">
                  {card.value}
                </p>

                <p className="
                  text-xs
                  text-white/80
                  font-medium
                  mt-1
                ">
                  {card.title}
                </p>
              </motion.div>
            );
          }
        )}
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="
        bg-white
        rounded-xl
        border
        border-[#EDF0F7]
        p-4
        mb-4
      ">
        <div className="
          flex
          flex-wrap
          gap-3
        ">

          <div className="
            flex-1
            min-w-[220px]
            relative
          ">
            <FiSearch
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              value={
                searchQuery
              }
              onChange={e =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="
                Search customer by name, phone or order...
              "
              className="
                w-full
                pl-9
                pr-3
                py-2.5
                bg-[#F5F7FC]
                border
                border-[#EDF0F7]
                rounded-lg
                text-sm
                outline-none
                focus:ring-2
                focus:ring-[#4F7CFF]
              "
            />
          </div>

          <select
            value={
              statusFilter
            }
            onChange={e =>
              setStatusFilter(
                e.target.value
              )
            }
            className="
              px-3
              py-2
              rounded-lg
              border
              border-[#EDF0F7]
              bg-[#F5F7FC]
              text-sm
            "
          >
            <option value="all">
              All Status
            </option>

            <option value="paid">
              Paid
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="partial">
              Partial
            </option>

            <option value="advance">
              Advance
            </option>
          </select>

          <select
            value={sortBy}
            onChange={e =>
              setSortBy(
                e.target.value
              )
            }
            className="
              px-3
              py-2
              rounded-lg
              border
              border-[#EDF0F7]
              bg-[#F5F7FC]
              text-sm
            "
          >
            <option value="newest">
              Newest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="highest">
              Highest Amount
            </option>

            <option value="lowest">
              Lowest Amount
            </option>
          </select>
        </div>
      </div>

      {/* =====================================================
          PAYMENT TABLE
      ===================================================== */}

      <div className="
        bg-white
        rounded-xl
        border
        border-[#EDF0F7]
        overflow-hidden
      ">
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="
              bg-[#F5F7FC]
              border-b
              border-[#EDF0F7]
            ">
              <tr>

                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Customer
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Order
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Date
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Amount
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Method
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Status
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="
              divide-y
              divide-[#EDF0F7]
            ">

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center"
                  >
                    <div className="
                      animate-spin
                      rounded-full
                      h-8
                      w-8
                      border-b-2
                      border-[#4F7CFF]
                      mx-auto
                    " />
                  </td>
                </tr>
              ) : sortedPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="
                      py-10
                      text-center
                      text-gray-500
                    "
                  >
                    No payments found
                  </td>
                </tr>
              ) : (
                sortedPayments.map(
                  (payment, index) => {
                    const customer =
                      getCustomer(
                        payment.customerId
                      );

                    const customerName =
                      customer?.name ||
                      payment.customerName ||
                      "Customer";

                    const orderId =
                      payment.orderId ||
                      customer?.customerId ||
                      "N/A";

                    const StatusIcon =
                      getStatusIcon(
                        payment.status
                      );

                    const MethodIcon =
                      getMethodIcon(
                        payment.method
                      );

                    return (
                      <motion.tr
                        key={
                          payment._id ||
                          index
                        }
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        className="
                          hover:bg-[#F8FAFF]
                          transition-colors
                        "
                      >

                        {/* CUSTOMER */}

                        <td className="px-4 py-3">
                          <div className="
                            flex
                            items-center
                            gap-2
                          ">
                            <div className="
                              w-9 h-9
                              rounded-lg
                              bg-gradient-to-br
                              from-[#4F7CFF]
                              to-[#8B7CFF]
                              text-white
                              flex
                              items-center
                              justify-center
                              font-bold
                              text-sm
                            ">
                              {customerName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="
                                text-sm
                                font-medium
                                text-[#161A2B]
                              ">
                                {
                                  customerName
                                }
                              </p>

                              <p className="
                                text-[11px]
                                text-gray-400
                              ">
                                {
                                  customer?.phone ||
                                  payment.customerPhone ||
                                  ""
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ORDER */}

                        <td className="
                          px-4
                          py-3
                          text-sm
                          text-gray-500
                          font-mono
                        ">
                          {orderId}
                        </td>

                        {/* DATE */}

                        <td className="
                          px-4
                          py-3
                          text-sm
                          text-gray-500
                        ">
                          {payment.date
                            ? new Date(
                                payment.date
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </td>

                        {/* AMOUNT */}

                        <td className="
                          px-4
                          py-3
                          text-sm
                          font-bold
                          text-[#161A2B]
                        ">
                          ₹
                          {Number(
                            payment.amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        {/* METHOD */}

                        <td className="px-4 py-3">
                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1
                              px-2.5
                              py-1
                              rounded-full
                              text-xs
                              font-medium
                              ${getMethodColor(
                                payment.method
                              )}
                            `}
                          >
                            <MethodIcon className="w-3 h-3" />

                            {(
                              payment.method ||
                              ""
                            ).toUpperCase()}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-3">
                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1
                              px-2.5
                              py-1
                              rounded-full
                              text-xs
                              font-medium
                              ${getStatusColor(
                                payment.status
                              )}
                            `}
                          >
                            <StatusIcon className="w-3 h-3" />

                            {(
                              payment.status ||
                              "pending"
                            ).toUpperCase()}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-4 py-3">
                          <div className="
                            flex
                            items-center
                            gap-1
                          ">

                            <button
                              onClick={() => {
                                setSelectedPayment(
                                  payment
                                );

                                setShowDetailModal(
                                  true
                                );
                              }}
                              className="
                                p-2
                                rounded-lg
                                hover:bg-blue-50
                                text-gray-500
                                hover:text-[#4F7CFF]
                              "
                              title="View"
                            >
                              <FiEye />
                            </button>

                            <button
                              onClick={() =>
                                handleEditPayment(
                                  payment
                                )
                              }
                              className="
                                p-2
                                rounded-lg
                                hover:bg-blue-50
                                text-gray-500
                                hover:text-[#4F7CFF]
                              "
                              title="Edit"
                            >
                              <FiEdit2 />
                            </button>

                            <button
                              onClick={() =>
                                handleDeletePayment(
                                  payment._id
                                )
                              }
                              className="
                                p-2
                                rounded-lg
                                hover:bg-red-50
                                text-gray-500
                                hover:text-red-500
                              "
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>

                          </div>
                        </td>

                      </motion.tr>
                    );
                  }
                )
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          ADD PAYMENT MODAL
      ===================================================== */}

      <AnimatePresence>
        {showAddPayment && (
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
              bg-black/50
              flex
              items-center
              justify-center
              z-[100]
              p-4
            "
            onClick={() =>
              setShowAddPayment(
                false
              )
            }
          >

            <motion.div
              initial={{
                scale: 0.95,
                y: 20,
              }}
              animate={{
                scale: 1,
                y: 0,
              }}
              exit={{
                scale: 0.95,
                y: 20,
              }}
              className="
                bg-white
                rounded-2xl
                max-w-lg
                w-full
                max-h-[90vh]
                overflow-y-auto
              "
              onClick={e =>
                e.stopPropagation()
              }
            >

              <div className="
                p-5
                border-b
                flex
                justify-between
                items-center
              ">
                <h2 className="
                  text-xl
                  font-bold
                  text-[#161A2B]
                ">
                  Record Payment
                </h2>

                <button
                  onClick={() =>
                    setShowAddPayment(
                      false
                    )
                  }
                >
                  <FiX className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form
                onSubmit={
                  handleAddPayment
                }
                className="
                  p-5
                  space-y-4
                "
              >

                {/* CUSTOMER */}

                <div>
                  <label className="
                    block
                    text-sm
                    font-medium
                    mb-1
                  ">
                    Customer
                  </label>

                  <Select
                    options={
                      customerOptions
                    }
                    value={
                      customerOptions.find(
                        option =>
                          String(
                            option.value
                          ) ===
                          String(
                            newPayment.customerId
                          )
                      ) || null
                    }
                    onChange={
                      selected => {
                        if (
                          selected
                        ) {
                          handleCustomerSelect(
                            selected.value
                          );
                        } else {
                          setNewPayment(
                            getEmptyPayment()
                          );
                        }
                      }
                    }
                    placeholder="
                      Search customer...
                    "
                    isSearchable
                    isClearable
                    formatOptionLabel={
                      formatCustomerOption
                    }
                  />
                </div>

                {/* CUSTOMER INFO */}

                {newPayment.customerId && (
                  <div className="
                    bg-[#F5F7FC]
                    rounded-xl
                    p-3
                    space-y-2
                  ">

                    <div className="
                      flex
                      gap-2
                      items-center
                    ">
                      <FiPackage />

                      <span className="
                        text-xs
                        text-gray-600
                      ">
                        Order:
                        {" "}
                        {
                          newPayment.orderId
                        }
                      </span>
                    </div>

                    {newPayment.customerPhone && (
                      <div className="
                        flex
                        gap-2
                        items-center
                      ">
                        <FiPhone />

                        <span className="
                          text-xs
                          text-gray-600
                        ">
                          {
                            newPayment.customerPhone
                          }
                        </span>
                      </div>
                    )}

                  </div>
                )}

                {/* AMOUNT */}

                <div>
                  <label className="
                    block
                    text-sm
                    font-medium
                    mb-1
                  ">
                    Amount (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    required
                    value={
                      newPayment.amount
                    }
                    onChange={e =>
                      setNewPayment({
                        ...newPayment,
                        amount:
                          e.target.value,
                      })
                    }
                    className="
                      w-full
                      px-4
                      py-2.5
                      border
                      border-[#EDF0F7]
                      rounded-lg
                      outline-none
                      focus:ring-2
                      focus:ring-[#4F7CFF]
                    "
                    placeholder="Enter amount"
                  />
                </div>

                {/* DATE */}

                <div>
                  <label className="
                    block
                    text-sm
                    font-medium
                    mb-1
                  ">
                    Date
                  </label>

                  <input
                    type="date"
                    value={
                      newPayment.date
                    }
                    onChange={e =>
                      setNewPayment({
                        ...newPayment,
                        date:
                          e.target.value,
                      })
                    }
                    className="
                      w-full
                      px-4
                      py-2.5
                      border
                      border-[#EDF0F7]
                      rounded-lg
                    "
                  />
                </div>

                {/* METHOD */}

                <div>
                  <label className="
                    block
                    text-sm
                    font-medium
                    mb-2
                  ">
                    Payment Method
                  </label>

                  <div className="
                    grid
                    grid-cols-2
                    gap-2
                  ">
                    {PAYMENT_METHODS.map(
                      method => (
                        <button
                          key={method}
                          type="button"
                          onClick={() =>
                            setNewPayment({
                              ...newPayment,
                              method,
                            })
                          }
                          className={`
                            p-3
                            rounded-lg
                            border-2
                            capitalize
                            ${
                              newPayment.method ===
                              method
                                ? "border-[#4F7CFF] bg-blue-50 text-[#4F7CFF]"
                                : "border-[#EDF0F7]"
                            }
                          `}
                        >
                          {method}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* STATUS */}

                <div>
                  <label className="
                    block
                    text-sm
                    font-medium
                    mb-1
                  ">
                    Status
                  </label>

                  <select
                    value={
                      newPayment.status
                    }
                    onChange={e =>
                      setNewPayment({
                        ...newPayment,
                        status:
                          e.target.value,
                      })
                    }
                    className="
                      w-full
                      px-4
                      py-2.5
                      border
                      border-[#EDF0F7]
                      rounded-lg
                    "
                  >
                    {PAYMENT_STATUSES.map(
                      status => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status
                            .charAt(0)
                            .toUpperCase() +
                            status.slice(
                              1
                            )}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="
                    block
                    text-sm
                    font-medium
                    mb-1
                  ">
                    Description
                  </label>

                  <textarea
                    rows="3"
                    value={
                      newPayment.description
                    }
                    onChange={e =>
                      setNewPayment({
                        ...newPayment,
                        description:
                          e.target.value,
                      })
                    }
                    className="
                      w-full
                      px-4
                      py-2.5
                      border
                      border-[#EDF0F7]
                      rounded-lg
                    "
                    placeholder="Payment notes..."
                  />
                </div>

                {/* BUTTONS */}

                <div className="
                  flex
                  justify-end
                  gap-3
                  pt-4
                  border-t
                ">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAddPayment(
                        false
                      )
                    }
                    className="
                      px-4
                      py-2
                      border
                      rounded-lg
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      px-5
                      py-2
                      bg-[#4F7CFF]
                      hover:bg-[#3D63E0]
                      text-white
                      rounded-lg
                      font-medium
                    "
                  >
                    Save Payment
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          EDIT PAYMENT MODAL
      ===================================================== */}

      <AnimatePresence>
        {showEditPayment && (
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
              bg-black/50
              flex
              items-center
              justify-center
              z-[110]
              p-4
            "
            onClick={() =>
              setShowEditPayment(
                false
              )
            }
          >

            <motion.div
              initial={{
                scale: 0.95,
                y: 20,
              }}
              animate={{
                scale: 1,
                y: 0,
              }}
              className="
                bg-white
                rounded-2xl
                max-w-lg
                w-full
                max-h-[90vh]
                overflow-y-auto
              "
              onClick={e =>
                e.stopPropagation()
              }
            >

              <div className="
                p-5
                border-b
                flex
                justify-between
                items-center
              ">
                <div>
                  <h2 className="
                    text-xl
                    font-bold
                    text-[#161A2B]
                  ">
                    Edit Payment
                  </h2>

                  <p className="
                    text-xs
                    text-gray-500
                    mt-1
                  ">
                    Update the existing payment
                    record without creating
                    another row.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowEditPayment(
                      false
                    )
                  }
                >
                  <FiX className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form
                onSubmit={
                  handleUpdatePayment
                }
                className="
                  p-5
                  space-y-4
                "
              >

                {/* CUSTOMER */}

                <div className="
                  bg-[#F5F7FC]
                  rounded-xl
                  p-4
                ">
                  <p className="
                    font-semibold
                    text-[#161A2B]
                  ">
                    {
                      editPayment.customerName ||
                      getCustomerName(
                        editPayment.customerId
                      )
                    }
                  </p>

                  <p className="
                    text-xs
                    text-gray-500
                    mt-1
                  ">
                    Order:
                    {" "}
                    {
                      editPayment.orderId ||
                      getCustomerOrderId(
                        editPayment.customerId
                      )
                    }
                  </p>
                </div>

                {/* AMOUNT */}

                <div>
                  <label className="
                    block
                    text-sm
                    font-medium
                    mb-1
                  ">
                    Amount (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    required
                    value={
                      editPayment.amount
                    }
                    onChange={e =>
                      setEditPayment({
                        ...editPayment,
                        amount:
                          e.target.value,
                      })
                    }
                    className="
                      w-full
                      px-4
                      py-2.5
                      border
                      border-[#EDF0F7]
                      rounded-lg
                    "
                  />
                </div>

                {/* METHOD */}

                <div>
                  <label className="
                    block
                    text-sm
                    font-medium
                    mb-2
                  ">
                    Payment Method
                  </label>

                  <div className="
                    grid
                    grid-cols-2
                    gap-2
                  ">
                    {PAYMENT_METHODS.map(
                      method => (
                        <button
                          key={method}
                          type="button"
                          onClick={() =>
                            setEditPayment({
                              ...editPayment,
                              method,
                            })
                          }
                          className={`
                            p-3
                            rounded-lg
                            border-2
                            capitalize
                            ${
                              editPayment.method ===
                              method
                                ? "border-[#4F7CFF] bg-blue-50 text-[#4F7CFF]"
                                : "border-[#EDF0F7]"
                            }
                          `}
                        >
                          {method}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* STATUS */}

                <div>
                  <label className="
                    block
                    text-sm
                    font-medium
                    mb-1
                  ">
                    Payment Status
                  </label>

                  <select
                    value={
                      editPayment.status
                    }
                    onChange={e =>
                      setEditPayment({
                        ...editPayment,
                        status:
                          e.target.value,
                      })
                    }
                    className="
                      w-full
                      px-4
                      py-2.5
                      border
                      border-[#EDF0F7]
                      rounded-lg
                    "
                  >
                    {PAYMENT_STATUSES.map(
                      status => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status
                            .charAt(0)
                            .toUpperCase() +
                            status.slice(
                              1
                            )}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* DATE */}

                <div>
                  <label className="
                    block
                    text-sm
                    font-medium
                    mb-1
                  ">
                    Payment Date
                  </label>

                  <input
                    type="date"
                    value={
                      editPayment.date
                    }
                    onChange={e =>
                      setEditPayment({
                        ...editPayment,
                        date:
                          e.target.value,
                      })
                    }
                    className="
                      w-full
                      px-4
                      py-2.5
                      border
                      border-[#EDF0F7]
                      rounded-lg
                    "
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="
                    block
                    text-sm
                    font-medium
                    mb-1
                  ">
                    Description
                  </label>

                  <textarea
                    rows="3"
                    value={
                      editPayment.description ||
                      ""
                    }
                    onChange={e =>
                      setEditPayment({
                        ...editPayment,
                        description:
                          e.target.value,
                      })
                    }
                    className="
                      w-full
                      px-4
                      py-2.5
                      border
                      border-[#EDF0F7]
                      rounded-lg
                    "
                  />
                </div>

                {/* BUTTONS */}

                <div className="
                  flex
                  justify-end
                  gap-3
                  pt-4
                  border-t
                ">

                  <button
                    type="button"
                    onClick={() =>
                      setShowEditPayment(
                        false
                      )
                    }
                    className="
                      px-4
                      py-2
                      border
                      rounded-lg
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      px-5
                      py-2
                      bg-[#4F7CFF]
                      hover:bg-[#3D63E0]
                      text-white
                      rounded-lg
                      font-medium
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <FiSave />
                    Update Payment
                  </button>

                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          VIEW PAYMENT MODAL
      ===================================================== */}

      <AnimatePresence>
        {showDetailModal &&
          selectedPayment && (
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
                bg-black/50
                flex
                items-center
                justify-center
                z-[120]
                p-4
              "
              onClick={() =>
                setShowDetailModal(
                  false
                )
              }
            >

              <motion.div
                initial={{
                  scale: 0.95,
                  y: 20,
                }}
                animate={{
                  scale: 1,
                  y: 0,
                }}
                className="
                  bg-white
                  rounded-2xl
                  max-w-md
                  w-full
                "
                onClick={e =>
                  e.stopPropagation()
                }
              >

                <div className="p-6">

                  <div className="
                    flex
                    justify-between
                    items-center
                    mb-5
                  ">
                    <h2 className="
                      text-xl
                      font-bold
                    ">
                      Payment Details
                    </h2>

                    <button
                      onClick={() =>
                        setShowDetailModal(
                          false
                        )
                      }
                    >
                      <FiX className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  {/* CUSTOMER */}

                  <div className="
                    flex
                    items-center
                    gap-3
                    bg-[#F5F7FC]
                    rounded-xl
                    p-4
                    mb-4
                  ">
                    <div className="
                      w-12 h-12
                      rounded-xl
                      bg-gradient-to-br
                      from-[#4F7CFF]
                      to-[#8B7CFF]
                      text-white
                      flex
                      items-center
                      justify-center
                      font-bold
                    ">
                      {getCustomerName(
                        selectedPayment.customerId
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="
                        font-semibold
                      ">
                        {
                          getCustomerName(
                            selectedPayment.customerId
                          )
                        }
                      </p>

                      <p className="
                        text-xs
                        text-gray-500
                      ">
                        Order:
                        {" "}
                        {
                          selectedPayment.orderId ||
                          getCustomerOrderId(
                            selectedPayment.customerId
                          )
                        }
                      </p>
                    </div>
                  </div>

                  {/* DETAILS */}

                  <div className="
                    grid
                    grid-cols-2
                    gap-3
                  ">

                    <div className="
                      bg-[#F5F7FC]
                      rounded-xl
                      p-4
                    ">
                      <p className="
                        text-xs
                        text-gray-500
                      ">
                        Amount
                      </p>

                      <p className="
                        text-xl
                        font-bold
                      ">
                        ₹
                        {Number(
                          selectedPayment.amount ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <div className="
                      bg-[#F5F7FC]
                      rounded-xl
                      p-4
                    ">
                      <p className="
                        text-xs
                        text-gray-500
                      ">
                        Method
                      </p>

                      <p className="
                        font-semibold
                        uppercase
                      ">
                        {
                          selectedPayment.method
                        }
                      </p>
                    </div>

                    <div className="
                      bg-[#F5F7FC]
                      rounded-xl
                      p-4
                    ">
                      <p className="
                        text-xs
                        text-gray-500
                      ">
                        Status
                      </p>

                      <span
                        className={`
                          inline-flex
                          mt-1
                          px-2
                          py-1
                          rounded-full
                          text-xs
                          ${getStatusColor(
                            selectedPayment.status
                          )}
                        `}
                      >
                        {
                          selectedPayment.status
                        }
                      </span>
                    </div>

                    <div className="
                      bg-[#F5F7FC]
                      rounded-xl
                      p-4
                    ">
                      <p className="
                        text-xs
                        text-gray-500
                      ">
                        Date
                      </p>

                      <p className="
                        font-semibold
                      ">
                        {selectedPayment.date
                          ? new Date(
                              selectedPayment.date
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}
                      </p>
                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  {selectedPayment.description && (
                    <div className="
                      bg-[#F5F7FC]
                      rounded-xl
                      p-4
                      mt-4
                    ">
                      <p className="
                        text-xs
                        text-gray-500
                        mb-1
                      ">
                        Description
                      </p>

                      <p className="
                        text-sm
                      ">
                        {
                          selectedPayment.description
                        }
                      </p>
                    </div>
                  )}

                  {/* BUTTONS */}

                  <div className="
                    flex
                    gap-3
                    mt-5
                    pt-4
                    border-t
                  ">

                    <button
                      onClick={() =>
                        handleEditPayment(
                          selectedPayment
                        )
                      }
                      className="
                        flex-1
                        bg-[#4F7CFF]
                        text-white
                        py-2.5
                        rounded-lg
                        font-medium
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <FiEdit2 />
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setShowDetailModal(
                          false
                        );

                        handleDeletePayment(
                          selectedPayment._id
                        );
                      }}
                      className="
                        px-4
                        border
                        border-red-200
                        text-red-500
                        rounded-lg
                      "
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      <AnimatePresence>
        {showDeleteModal && (
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
              bg-black/50
              flex
              items-center
              justify-center
              z-[150]
              p-4
            "
            onClick={() =>
              setShowDeleteModal(
                false
              )
            }
          >

            <motion.div
              initial={{
                scale: 0.95,
              }}
              animate={{
                scale: 1,
              }}
              className="
                bg-white
                rounded-2xl
                max-w-md
                w-full
                p-6
              "
              onClick={e =>
                e.stopPropagation()
              }
            >

              <div className="
                flex
                items-center
                gap-3
                mb-4
              ">
                <div className="
                  w-12 h-12
                  bg-red-100
                  rounded-full
                  flex
                  items-center
                  justify-center
                ">
                  <FiTrash2 className="
                    text-red-500
                    w-6 h-6
                  " />
                </div>

                <div>
                  <h2 className="
                    text-xl
                    font-bold
                  ">
                    Delete Payment
                  </h2>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    This action cannot
                    be undone.
                  </p>
                </div>
              </div>

              <p className="
                text-gray-600
                mb-6
              ">
                Are you sure you want
                to delete this payment
                record?
              </p>

              <div className="
                flex
                justify-end
                gap-3
              ">

                <button
                  onClick={() =>
                    setShowDeleteModal(
                      false
                    )
                  }
                  className="
                    px-4
                    py-2
                    border
                    rounded-lg
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={
                    confirmDeletePayment
                  }
                  className="
                    px-4
                    py-2
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    rounded-lg
                    flex
                    items-center
                    gap-2
                  "
                >
                  <FiTrash2 />
                  Delete
                </button>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Payments;