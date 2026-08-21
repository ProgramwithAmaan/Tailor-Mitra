import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Settings = () => {
  const navigate = useNavigate();

  const comingSoon = (feature) => {
    toast(feature + " is coming soon 🚀", {
      icon: "🔒",
    });
  };

  return (
    <div className="min-h-[calc(100vh-150px)] pb-10">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Settings
            </h1>

            <p className="text-slate-500 mt-1">
              Manage your account and application settings
            </p>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            Open Profile
          </button>

        </div>
      </div>

      {/* =========================
          MAIN GRID
      ========================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* =========================
            LEFT SIDE
        ========================== */}
        <div className="xl:col-span-2 space-y-6">

          {/* =========================
              ACCOUNT
          ========================== */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-start gap-4 mb-6">

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                👤
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Account
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Manage your profile and account information
                </p>
              </div>

            </div>

            {/* PROFILE */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-slate-100">

              <div>
                <h3 className="font-semibold text-slate-800">
                  My Profile
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Update your name, email, phone and shop information
                </p>
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition"
              >
                Open Profile
              </button>

            </div>

            {/* SECURITY */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">

              <div>
                <h3 className="font-semibold text-slate-800">
                  Account Security
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Change your password and manage account security
                </p>
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Manage
              </button>

            </div>

          </div>

          {/* =========================
              COMING SOON
          ========================== */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-start gap-4 mb-6">

              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
                🚀
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  More Features
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Additional settings are being developed
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Notifications */}
              <button
                onClick={() => comingSoon("Notifications")}
                className="text-left p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition"
              >
                <div className="text-2xl mb-3">
                  🔔
                </div>

                <h3 className="font-semibold text-slate-800">
                  Notifications
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Notification preferences
                </p>

                <span className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 text-slate-600">
                  Coming Soon
                </span>
              </button>

              {/* App Preferences */}
              <button
                onClick={() => comingSoon("App Preferences")}
                className="text-left p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition"
              >
                <div className="text-2xl mb-3">
                  ⚙️
                </div>

                <h3 className="font-semibold text-slate-800">
                  App Preferences
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Customize application behavior
                </p>

                <span className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 text-slate-600">
                  Coming Soon
                </span>
              </button>

              {/* Business Preferences */}
              <button
                onClick={() => comingSoon("Business Preferences")}
                className="text-left p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition"
              >
                <div className="text-2xl mb-3">
                  🏪
                </div>

                <h3 className="font-semibold text-slate-800">
                  Business Preferences
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Configure your tailoring business
                </p>

                <span className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 text-slate-600">
                  Coming Soon
                </span>
              </button>

              {/* Security */}
              <button
                onClick={() => comingSoon("Advanced Security")}
                className="text-left p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition"
              >
                <div className="text-2xl mb-3">
                  🔐
                </div>

                <h3 className="font-semibold text-slate-800">
                  Advanced Security
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Additional account security options
                </p>

                <span className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 text-slate-600">
                  Coming Soon
                </span>
              </button>

            </div>

          </div>

        </div>

        {/* =========================
            RIGHT SIDE
        ========================== */}
        <div className="space-y-6">

          {/* =========================
              QUICK SETTINGS
          ========================== */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-xl font-bold text-slate-900 mb-5">
              Quick Settings
            </h2>

            <div className="space-y-3">

              {/* PROFILE */}
              <button
                onClick={() => navigate("/profile")}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                  👤
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    My Profile
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Personal information
                  </p>
                </div>

                <span className="text-slate-400">
                  →
                </span>
              </button>

              {/* PAYMENTS */}
              <button
                onClick={() => navigate("/payments")}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                  💳
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    Payments
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Manage customer payments
                  </p>
                </div>

                <span className="text-slate-400">
                  →
                </span>
              </button>

              {/* CUSTOMERS */}
              <button
                onClick={() => navigate("/customers")}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                  👥
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    Customers
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Manage your customers
                  </p>
                </div>

                <span className="text-slate-400">
                  →
                </span>
              </button>

              {/* ORDERS */}
              <button
                onClick={() => navigate("/orders")}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-xl">
                  📦
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    Orders
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Manage your orders
                  </p>
                </div>

                <span className="text-slate-400">
                  →
                </span>
              </button>

            </div>

          </div>

          {/* =========================
              COMING SOON SIDEBAR
          ========================== */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-sm p-6 text-white">

            <div className="flex items-center gap-3 mb-4">

              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                🚀
              </div>

              <div>
                <h2 className="font-bold text-lg">
                  More Coming Soon
                </h2>

                <p className="text-blue-100 text-xs">
                  We're improving your experience
                </p>
              </div>

            </div>

            <div className="space-y-3">

              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-sm text-blue-100">
                  Notifications
                </span>

                <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">
                  Soon
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-sm text-blue-100">
                  Business Settings
                </span>

                <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">
                  Soon
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-blue-100">
                  Advanced Security
                </span>

                <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">
                  Soon
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          BOTTOM INFORMATION
      ========================== */}
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
            ✓
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              Your account is active
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Profile and account security settings are available now.
              Other features will be added soon.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;