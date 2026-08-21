import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Phone,
  Mail,
  IndianRupee,
  Scissors,
  Clock3,
  CheckCircle2,
  Gift,
  MessageCircle,
  Copy,
  Check,
  Send,
  PackageCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import { getOrders, updateOrderStatus } from "../api";

const STATUS_ORDER = ["cutting", "stitch", "ready", "received"];

const STATUS_LABELS = {
  cutting: "Cutting",
  stitch: "Stitch",
  ready: "Ready",
  received: "Received",
};

const STATUS_COLORS = {
  cutting: "bg-orange-50 text-orange-600 border-orange-200",
  stitch: "bg-blue-50 text-blue-600 border-blue-200",
  ready: "bg-green-50 text-green-600 border-green-200",
  received: "bg-purple-50 text-purple-600 border-purple-200",
};

const STATUS_ICONS = {
  cutting: Scissors,
  stitch: Clock3,
  ready: CheckCircle2,
  received: Gift,
};

const getInitial = (name = "") => {
  return name.trim().charAt(0).toUpperCase() || "C";
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getNextStatus = (status) => {
  const index = STATUS_ORDER.indexOf(status);

  if (index === -1 || index === STATUS_ORDER.length - 1) {
    return null;
  }

  return STATUS_ORDER[index + 1];
};

const getProgress = (status) => {
  const index = STATUS_ORDER.indexOf(status);

  if (index === -1) return 0;

  return ((index + 1) / STATUS_ORDER.length) * 100;
};

const normalizePhone = (phone = "") => {
  let cleaned = phone.toString().replace(/\D/g, "");

  // India
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return cleaned;
  }

  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }

  return cleaned;
};

const createWhatsAppMessage = (order) => {
  const customer = order.customerId || {};

  const customerName = customer.name || "Customer";
  const orderId =
    customer.customerId ||
    order._id?.toString().slice(-8).toUpperCase() ||
    "ORDER";

  const amount = Number(customer.price || order.totalAmount || 0);

  // These fields should come from the tailor/user profile
  // if your backend includes them.
  const upiId =
    order?.tailor?.shopDetails?.upiId ||
    order?.user?.shopDetails?.upiId ||
    order?.shopDetails?.upiId ||
    "";

  const tailorPhone =
    order?.tailor?.profile?.phone ||
    order?.user?.profile?.phone ||
    order?.profile?.phone ||
    "";

  let message = `Hello ${customerName} 👋

Your order is ready! 🎉

Order ID: ${orderId}
Amount: ₹${amount}

Please collect your order from the tailor.

`;

  if (upiId) {
    message += `💳 UPI ID: ${upiId}\n`;
  }

  if (tailorPhone) {
    message += `📞 Tailor Contact: ${tailorPhone}\n`;
  }

  message += `
Thank you for choosing us! 😊`;

  return message;
};

const getWhatsAppUrl = (order) => {
  const customer = order.customerId || {};

  const phone = normalizePhone(customer.phone);

  if (!phone) return null;

  const message = createWhatsAppMessage(order);

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [updatingId, setUpdatingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await getOrders();

      const data = response?.data || [];

      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = order.customerId || {};

      const searchText = search.toLowerCase();

      const matchesSearch =
        customer.name?.toLowerCase().includes(searchText) ||
        customer.phone?.toLowerCase().includes(searchText) ||
        customer.email?.toLowerCase().includes(searchText) ||
        customer.customerId?.toLowerCase().includes(searchText);

      const matchesFilter =
        activeFilter === "all" || order.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, activeFilter]);

  const stats = useMemo(() => {
    return {
      all: orders.length,
      cutting: orders.filter((o) => o.status === "cutting").length,
      stitch: orders.filter((o) => o.status === "stitch").length,
      ready: orders.filter((o) => o.status === "ready").length,
      received: orders.filter((o) => o.status === "received").length,
    };
  }, [orders]);

  const handleStatusUpdate = async (order, nextStatus) => {
    try {
      setUpdatingId(order._id);

      const response = await updateOrderStatus(order._id, nextStatus);

      const updatedOrder = response?.data?.order;

      setOrders((prev) =>
        prev.map((item) =>
          item._id === order._id
            ? updatedOrder || { ...item, status: nextStatus }
            : item
        )
      );

      if (nextStatus === "ready") {
        if (response?.data?.whatsappSent) {
          toast.success("Order marked ready & WhatsApp sent 🎉");
        } else if (response?.data?.whatsappError) {
          toast.success("Order marked ready");
          toast.error(
            `WhatsApp not sent: ${response.data.whatsappError}`
          );
        } else {
          toast.success("Order marked ready");
        }
      } else if (nextStatus === "received") {
        if (response?.data?.whatsappSent) {
          toast.success("Order received & WhatsApp sent");
        } else {
          toast.success("Order marked received");
        }
      } else {
        toast.success(`Order marked as ${STATUS_LABELS[nextStatus]}`);
      }
    } catch (error) {
      console.error("Status update error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleWhatsApp = (order) => {
    const customer = order.customerId || {};

    if (!customer.phone) {
      toast.error("Customer phone number is missing");
      return;
    }

    const url = getWhatsAppUrl(order);

    if (!url) {
      toast.error("Invalid customer phone number");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyWhatsApp = async (order) => {
    const url = getWhatsAppUrl(order);

    if (!url) {
      toast.error("Customer phone number is missing");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);

      setCopiedId(order._id);

      toast.success("WhatsApp link copied");

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy link");
    }
  };

  const renderStatusIcon = (status) => {
    const Icon = STATUS_ICONS[status] || Clock3;

    return <Icon size={16} />;
  };

  const renderProgress = (status) => {
    const progress = getProgress(status);

    return (
      <div className="flex items-center gap-3 min-w-[180px]">
        <div className="flex-1">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <span className="text-xs font-semibold text-gray-500 w-9 text-right">
          {Math.round(progress)}%
        </span>
      </div>
    );
  };

  const renderActionButton = (order) => {
    const nextStatus = getNextStatus(order.status);

    if (!nextStatus) {
      return (
        <div className="flex items-center gap-2 text-purple-600 text-sm font-semibold whitespace-nowrap">
          <Gift size={17} />
          Completed
        </div>
      );
    }

    const isUpdating = updatingId === order._id;

    return (
      <button
        onClick={() => handleStatusUpdate(order, nextStatus)}
        disabled={isUpdating}
        className="
          inline-flex items-center justify-center gap-2
          px-4 py-2
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          disabled:bg-blue-300
          text-white
          text-sm
          font-semibold
          transition-all
          whitespace-nowrap
        "
      >
        {isUpdating ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <Send size={16} />
            Mark as {STATUS_LABELS[nextStatus]}
          </>
        )}
      </button>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f9fc] px-3 sm:px-5 lg:px-8 py-4 sm:py-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#151a2d]">
            Orders
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Track orders and notify customers when their order is ready
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="
            self-start md:self-auto
            inline-flex items-center gap-2
            px-4 py-2.5
            rounded-xl
            bg-white
            border border-gray-200
            shadow-sm
            text-gray-700
            font-medium
            hover:bg-gray-50
            transition
          "
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {[
          {
            key: "all",
            label: "All Orders",
            value: stats.all,
          },
          {
            key: "cutting",
            label: "Cutting",
            value: stats.cutting,
          },
          {
            key: "stitch",
            label: "Stitch",
            value: stats.stitch,
          },
          {
            key: "ready",
            label: "Ready",
            value: stats.ready,
          },
          {
            key: "received",
            label: "Received",
            value: stats.received,
          },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveFilter(item.key)}
            className={`
              rounded-2xl
              px-4 py-4
              text-left
              border
              transition-all
              ${
                activeFilter === item.key
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              }
            `}
          >
            <div className="text-2xl font-bold">{item.value}</div>

            <div
              className={`text-sm mt-1 ${
                activeFilter === item.key
                  ? "text-blue-100"
                  : "text-gray-500"
              }`}
            >
              {item.label}
            </div>
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 mb-5 shadow-sm">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search customer, phone, email or customer ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              h-12
              pl-11
              pr-4
              rounded-xl
              bg-gray-50
              border border-gray-200
              outline-none
              focus:ring-2
              focus:ring-blue-500/20
              focus:border-blue-500
              text-sm
            "
          />
        </div>
      </div>

      {/* DESKTOP ORDER TABLE / ROWS */}
      <div className="hidden lg:block">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* TABLE HEADER */}
          <div
            className="
              grid
              grid-cols-[2fr_1.2fr_1fr_1fr_1.4fr_1.5fr_1.6fr]
              gap-4
              items-center
              px-5
              py-4
              bg-gray-50
              border-b
              border-gray-200
              text-xs
              font-bold
              text-gray-500
              uppercase
              tracking-wide
            "
          >
            <div>Customer</div>
            <div>Contact</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Progress</div>
            <div>Actions</div>
            <div>WhatsApp</div>
          </div>

          {/* ROWS */}
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              <RefreshCw
                size={25}
                className="animate-spin mx-auto mb-3"
              />
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <PackageCheck
                size={40}
                className="mx-auto text-gray-300 mb-3"
              />

              <h3 className="font-semibold text-gray-700">
                No orders found
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const customer = order.customerId || {};

              return (
                <div
                  key={order._id}
                  className="
                    grid
                    grid-cols-[2fr_1.2fr_1fr_1fr_1.4fr_1.6fr_1.6fr]
                    gap-4
                    items-center
                    px-5
                    py-4
                    border-b
                    border-gray-100
                    last:border-b-0
                    hover:bg-blue-50/30
                    transition
                  "
                >
                  {/* CUSTOMER */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="
                        w-11 h-11
                        rounded-xl
                        bg-gradient-to-br
                        from-blue-500
                        to-indigo-500
                        text-white
                        flex items-center justify-center
                        font-bold
                        flex-shrink-0
                      "
                    >
                      {getInitial(customer.name)}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-gray-800 truncate">
                        {customer.name || "Unknown Customer"}
                      </div>

                      <div className="text-xs text-gray-400 mt-0.5 truncate">
                        {customer.customerId || order._id?.slice(-8)}
                      </div>
                    </div>
                  </div>

                  {/* CONTACT */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700 truncate">
                      <Phone
                        size={14}
                        className="text-blue-500 flex-shrink-0"
                      />

                      <span className="truncate">
                        {customer.phone || "-"}
                      </span>
                    </div>

                    {customer.email && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 truncate">
                        <Mail
                          size={13}
                          className="flex-shrink-0"
                        />

                        <span className="truncate">
                          {customer.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* AMOUNT */}
                  <div>
                    <div className="flex items-center gap-1 font-bold text-gray-800">
                      <IndianRupee size={15} />
                      {Number(
                        customer.price || order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {formatDate(order.updatedAt)}
                    </div>
                  </div>

                  {/* STATUS */}
                  <div>
                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        px-3
                        py-1.5
                        rounded-full
                        border
                        text-xs
                        font-semibold
                        ${STATUS_COLORS[order.status]}
                      `}
                    >
                      {renderStatusIcon(order.status)}
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  {/* PROGRESS */}
                  <div>{renderProgress(order.status)}</div>

                  {/* ACTION */}
                  <div>{renderActionButton(order)}</div>

                  {/* WHATSAPP */}
                  <div className="flex items-center gap-2">
                    {order.status === "ready" ||
                    order.status === "received" ? (
                      <>
                        <button
                          onClick={() => handleWhatsApp(order)}
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            px-3
                            py-2
                            rounded-xl
                            bg-green-500
                            hover:bg-green-600
                            text-white
                            text-xs
                            font-semibold
                            transition
                            whitespace-nowrap
                          "
                        >
                          <MessageCircle size={15} />
                          Send Again
                        </button>

                        <button
                          onClick={() =>
                            handleCopyWhatsApp(order)
                          }
                          title="Copy WhatsApp link"
                          className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-xl
                            bg-gray-100
                            hover:bg-gray-200
                            text-gray-600
                            transition
                          "
                        >
                          {copiedId === order._id ? (
                            <Check
                              size={16}
                              className="text-green-600"
                            />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Available when ready
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* TABLET / MOBILE */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            <RefreshCw
              size={25}
              className="animate-spin mx-auto mb-3 text-blue-500"
            />
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            <PackageCheck
              size={40}
              className="mx-auto text-gray-300 mb-3"
            />

            <h3 className="font-semibold text-gray-700">
              No orders found
            </h3>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const customer = order.customerId || {};

            return (
              <div
                key={order._id}
                className="
                  bg-white
                  border border-gray-200
                  rounded-2xl
                  p-4
                  shadow-sm
                "
              >
                {/* TOP */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="
                        w-11 h-11
                        rounded-xl
                        bg-gradient-to-br
                        from-blue-500
                        to-indigo-500
                        text-white
                        flex items-center justify-center
                        font-bold
                        flex-shrink-0
                      "
                    >
                      {getInitial(customer.name)}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">
                        {customer.name || "Unknown Customer"}
                      </h3>

                      <p className="text-xs text-gray-400 truncate">
                        {customer.customerId ||
                          order._id?.slice(-8)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`
                      inline-flex items-center gap-1
                      px-2.5 py-1
                      rounded-full
                      border
                      text-xs
                      font-semibold
                      whitespace-nowrap
                      ${STATUS_COLORS[order.status]}
                    `}
                  >
                    {renderStatusIcon(order.status)}
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">
                      Phone
                    </p>

                    <p className="text-sm font-semibold text-gray-700 mt-1 truncate">
                      {customer.phone || "-"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">
                      Amount
                    </p>

                    <p className="text-sm font-bold text-gray-800 mt-1">
                      ₹
                      {Number(
                        customer.price ||
                          order.totalAmount ||
                          0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500">
                      Order Progress
                    </span>

                    <span className="text-xs font-bold text-blue-600">
                      {Math.round(getProgress(order.status))}%
                    </span>
                  </div>

                  {renderProgress(order.status)}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <div className="flex-1">
                    {renderActionButton(order)}
                  </div>

                  {(order.status === "ready" ||
                    order.status === "received") && (
                    <>
                      <button
                        onClick={() => handleWhatsApp(order)}
                        className="
                          flex-1
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          px-4
                          py-2
                          rounded-xl
                          bg-green-500
                          hover:bg-green-600
                          text-white
                          text-sm
                          font-semibold
                        "
                      >
                        <MessageCircle size={17} />
                        WhatsApp
                      </button>

                      <button
                        onClick={() =>
                          handleCopyWhatsApp(order)
                        }
                        className="
                          w-full
                          sm:w-11
                          h-10
                          rounded-xl
                          bg-gray-100
                          hover:bg-gray-200
                          flex
                          items-center
                          justify-center
                          text-gray-600
                        "
                      >
                        {copiedId === order._id ? (
                          <Check
                            size={17}
                            className="text-green-600"
                          />
                        ) : (
                          <Copy size={17} />
                        )}
                      </button>
                    </>
                  )}
                </div>

                <div className="text-xs text-gray-400 mt-3">
                  Updated: {formatDate(order.updatedAt)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;