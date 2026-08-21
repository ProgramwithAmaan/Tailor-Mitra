import axios from "axios";

// ======================================================
// API BASE URL
// ======================================================

// const API_BASE_URL = import.meta.env.VITE_API_URL || "/api"; ----------------------------------- <--
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5001/api' : '/api');

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// REQUEST INTERCEPTOR
// Adds authentication token to every request
// ======================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["x-auth-token"] = token;
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================================================
// RESPONSE INTERCEPTOR
// Handles expired/invalid token
// ======================================================

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");

      // Avoid redirect loop
      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);

// ======================================================
// AUTH
// ======================================================

export const signUp = (formData) => {
  // return API.post("/auth/signup", formData); -------------------------------------------
  return API.post("/auth/signup", formData);
};

export const signIn = (formData) => {
  return API.post("/auth/signin", formData);
};

// ======================================================
// CUSTOMERS
// ======================================================

export const getCustomers = () => {
  return API.get("/customers");
};

export const getCustomer = (id) => {
  return API.get(`/customers/${id}`);
};

export const searchCustomers = (query) => {
  return API.get(
    `/customers/search?q=${encodeURIComponent(query)}`
  );
};

export const addCustomer = (data) => {
  return API.post("/customers", data);
};

export const updateCustomer = (id, data) => {
  return API.put(`/customers/${id}`, data);
};

export const deleteCustomer = (id) => {
  return API.delete(`/customers/${id}`);
};

// ======================================================
// ORDERS
// ======================================================

export const getOrders = () => {
  return API.get("/orders");
};

export const updateOrderStatus = (id, status) => {
  return API.put(`/orders/${id}/status`, {
    status,
  });
};

export const getDashboardStats = () => {
  return API.get("/orders/dashboard/stats");
};

// ======================================================
// PAYMENTS
// ======================================================

export const getPayments = () => {
  return API.get("/payments");
};

export const addPayment = (data) => {
  return API.post("/payments", data);
};

export const updatePayment = (id, data) => {
  return API.put(`/payments/${id}`, data);
};

export const deletePayment = (id) => {
  return API.delete(`/payments/${id}`);
};

export const getMonthlyPayments = (year, month) => {
  return API.get(`/payments/monthly/${year}/${month}`);
};

// ======================================================
// PROFILE
// ======================================================

export const getProfile = () => {
  return API.get("/profile");
};

export const updateProfile = (data) => {
  return API.put("/profile", data);
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default API;
