import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import { AppProvider } from "./context/AppContext";

// Layout components
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import TailorSignIn from "./components/SignIn";
import TailorSignUp from "./components/SignUp";
import TailorDashboard from "./components/Dashboard";
import TailorCustomers from "./components/Customers";
import TailorOrders from "./components/Orders";
import PaymentPage from "./components/PaymentPage";
import Payments from "./components/Payments";
import Calendar from "./components/Calendar";
import ProfilePage from "./components/ProfilePage";
import Settings from "./components/Settings";


/* =========================================================
   APP
========================================================= */

function App() {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  return (
    <AppProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {/* =================================================
            TOASTER
        ================================================= */}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "13px",
              maxWidth: "90vw",
              padding: "12px 16px",
            },
          }}
        />

        <Routes>

          {/* =================================================
              PUBLIC ROUTES
          ================================================= */}

          {/* SIGN IN */}
          <Route
            path="/signin"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <TailorSignIn />
              )
            }
          />

          {/* SIGN UP */}
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <TailorSignUp />
              )
            }
          />

          {/* CUSTOMER PAYMENT PAGE
              This page is intentionally public so customers
              can open their payment link.
          */}
          <Route
            path="/pay/:orderId"
            element={<PaymentPage />}
          />


          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Sidebar>
                  <TopBar />

                  <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6">
                    <TailorDashboard />
                  </main>

                  <BottomNav />
                </Sidebar>
              </PrivateRoute>
            }
          />


          {/* =================================================
              CUSTOMERS
          ================================================= */}

          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Sidebar>
                  <TopBar />

                  <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6">
                    <TailorCustomers />
                  </main>

                  <BottomNav />
                </Sidebar>
              </PrivateRoute>
            }
          />


          {/* =================================================
              ORDERS
          ================================================= */}

          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Sidebar>
                  <TopBar />

                  <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6">
                    <TailorOrders />
                  </main>

                  <BottomNav />
                </Sidebar>
              </PrivateRoute>
            }
          />


          {/* =================================================
              PAYMENTS
          ================================================= */}

          <Route
            path="/payments"
            element={
              <PrivateRoute>
                <Sidebar>
                  <TopBar />

                  <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6">
                    <Payments />
                  </main>

                  <BottomNav />
                </Sidebar>
              </PrivateRoute>
            }
          />


          {/* =================================================
              CALENDAR
          ================================================= */}

          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <Sidebar>
                  <TopBar />

                  <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6">
                    <Calendar />
                  </main>

                  <BottomNav />
                </Sidebar>
              </PrivateRoute>
            }
          />


          {/* =================================================
              SETTINGS
          ================================================= */}

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Sidebar>
                  <TopBar />

                  <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6">
                    <Settings />
                  </main>

                  <BottomNav />
                </Sidebar>
              </PrivateRoute>
            }
          />


          {/* =================================================
              PROFILE
          ================================================= */}

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Sidebar>
                  <TopBar />

                  <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6">
                    <ProfilePage />
                  </main>

                  <BottomNav />
                </Sidebar>
              </PrivateRoute>
            }
          />


          {/* =================================================
              FALLBACK
          ================================================= */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;



















