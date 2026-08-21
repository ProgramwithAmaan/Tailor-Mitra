const express = require("express");
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const User = require("../models/User");

const router = express.Router();

/*
===========================================================
TWILIO
===========================================================
*/

let twilioClient = null;

try {
  const twilio = require("twilio");

  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN
  ) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    console.log("✅ Twilio WhatsApp client initialized");
  } else {
    console.log(
      "⚠️ Twilio credentials not found. WhatsApp disabled."
    );
  }
} catch (error) {
  console.log(
    "⚠️ Twilio package not installed. Run: npm install twilio"
  );
}

/*
===========================================================
FORMAT PHONE NUMBER
===========================================================
*/

function formatWhatsAppNumber(phone) {
  if (!phone) return null;

  let cleaned = String(phone)
    .replace(/[^\d+]/g, "")
    .replace(/^whatsapp:/i, "");

  // India number
  if (cleaned.length === 10 && !cleaned.startsWith("+")) {
    cleaned = "+91" + cleaned;
  }

  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }

  return `whatsapp:${cleaned}`;
}

/*
===========================================================
GENERATE UPI LINK
===========================================================
*/

function generateUPILink({
  upiId,
  shopName,
  amount,
  orderId,
}) {
  if (!upiId) return null;

  const params = new URLSearchParams({
    pa: upiId,
    pn: shopName || "Tailor",
    am: Number(amount || 0).toFixed(2),
    cu: "INR",
    tn: `Payment for order ${orderId}`,
  });

  return `upi://pay?${params.toString()}`;
}

/*
===========================================================
GENERATE QR CODE URL
===========================================================
*/

function generateQRCodeURL(upiLink) {
  if (!upiLink) return null;

  return (
    "https://api.qrserver.com/v1/create-qr-code/" +
    `?size=500x500&data=${encodeURIComponent(upiLink)}`
  );
}

/*
===========================================================
SEND WHATSAPP MESSAGE
===========================================================
*/

async function sendWhatsAppMessage({
  phone,
  body,
  mediaUrl = null,
}) {
  try {
    if (!twilioClient) {
      return {
        success: false,
        error:
          "Twilio is not configured. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.",
      };
    }

    const to = formatWhatsAppNumber(phone);

    if (!to) {
      return {
        success: false,
        error: "Customer phone number is missing.",
      };
    }

    const from =
      process.env.TWILIO_WHATSAPP_NUMBER ||
      "whatsapp:+14155238886";

    const messageData = {
      from,
      to,
      body,
    };

    /*
    Attach QR image
    */
    if (mediaUrl) {
      messageData.mediaUrl = [mediaUrl];
    }

    const message = await twilioClient.messages.create(
      messageData
    );

    console.log("======================================");
    console.log("✅ WhatsApp sent successfully");
    console.log("To:", to);
    console.log("SID:", message.sid);
    console.log("======================================");

    return {
      success: true,
      sid: message.sid,
    };
  } catch (error) {
    console.error(
      "❌ WhatsApp error:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
}

/*
===========================================================
ORDER READY WHATSAPP
===========================================================
*/

async function sendOrderReadyWhatsApp({
  customerName,
  customerPhone,
  orderId,
  amount,
  upiId,
  shopName,
}) {
  try {
    if (!customerPhone) {
      return {
        success: false,
        error: "Customer phone number is missing.",
      };
    }

    /*
    Create UPI payment link
    */
    const upiLink = generateUPILink({
      upiId,
      shopName,
      amount,
      orderId,
    });

    /*
    Create QR code
    */
    const qrCodeUrl = generateQRCodeURL(upiLink);

    /*
    Create WhatsApp message
    */
    let message = `Hello ${
      customerName || "Customer"
    } 👋

🎉 *Your Order Is Ready!*

📦 *Order ID:* ${orderId}

Your stitched order is ready for collection.

🏪 *Shop:* ${
      shopName || "Tailor Shop"
    }

💰 *Amount Due:* ₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}

`;

    /*
    Add UPI ID
    */
    if (upiId) {
      message += `💳 *UPI ID:* ${upiId}

`;
    }

    /*
    Add payment link
    */
    if (upiLink) {
      message += `📲 *UPI Payment Link:*
${upiLink}

`;
    }

    message += `📍 Please visit the shop to collect your order.

The QR code for payment is attached above.

Thank you for choosing us! ❤️`;

    /*
    Send message + QR
    */
    const result = await sendWhatsAppMessage({
      phone: customerPhone,
      body: message,
      mediaUrl: qrCodeUrl,
    });

    return {
      ...result,
      qrCodeUrl,
      upiLink,
    };
  } catch (error) {
    console.error(
      "❌ Order ready WhatsApp error:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
}

/*
===========================================================
THANK YOU WHATSAPP
===========================================================
*/

async function sendThankYouWhatsApp({
  customerName,
  customerPhone,
  orderId,
  shopName,
}) {
  try {
    const message = `Hello ${
      customerName || "Customer"
    } 👋

✅ *Order Collected Successfully*

📦 *Order ID:* ${orderId}

Thank you for collecting your order from ${
      shopName || "our tailor shop"
    }. ❤️

We really appreciate your business.

Hope to see you again! 😊`;

    return await sendWhatsAppMessage({
      phone: customerPhone,
      body: message,
    });
  } catch (error) {
    console.error(
      "❌ Thank-you WhatsApp error:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
}

/*
===========================================================
GET ALL ORDERS
===========================================================
*/

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    })
      .populate("customerId")
      .sort({ updatedAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/*
===========================================================
UPDATE ORDER STATUS
===========================================================
*/

router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    /*
    Validate status
    */
    const allowedStatuses = [
      "cutting",
      "stitch",
      "ready",
      "received",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    /*
    Find only the logged-in tailor's order
    */
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("customerId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /*
    Prevent duplicate Ready notification
    */
    const oldStatus = order.status;

    /*
    Update status
    */
    order.status = status;

    /*
    Update dates
    */
    const now = new Date();

    if (status === "cutting") {
      order.cuttingDate = now;
    }

    if (status === "stitch") {
      order.stitchDate = now;
    }

    if (status === "ready") {
      order.readyDate = now;
    }

    if (status === "received") {
      order.receivedDate = now;
    }

    await order.save();

    /*
    ==========================================
    WHATSAPP VARIABLES
    ==========================================
    */

    let whatsappSent = false;
    let whatsappError = null;

    const customer = order.customerId;

    const customerPhone = customer?.phone || null;

    const customerName =
      customer?.name || "Customer";

    const orderId =
      customer?.customerId ||
      order._id.toString().slice(-8);

    const amount =
      customer?.price || 0;

    /*
    ==========================================
    GET LOGGED-IN TAILOR
    ==========================================
    */

    const tailor = await User.findById(req.user.id);

    const shopName =
      tailor?.shopDetails?.shopName ||
      tailor?.profile?.name ||
      "Tailor Shop";

    const upiId =
      tailor?.shopDetails?.upiId || "";

    /*
    ==========================================
    READY
    ==========================================
    */

    if (
      status === "ready" &&
      oldStatus !== "ready"
    ) {
      console.log(
        "======================================"
      );

      console.log(
        "📱 Order marked READY"
      );

      console.log(
        "Customer:",
        customerName
      );

      console.log(
        "Phone:",
        customerPhone
      );

      console.log(
        "Order:",
        orderId
      );

      console.log(
        "Amount:",
        amount
      );

      console.log(
        "UPI:",
        upiId || "Not configured"
      );

      console.log(
        "Shop:",
        shopName
      );

      console.log(
        "======================================"
      );

      if (!customerPhone) {
        whatsappError =
          "Customer has no phone number.";
      } else {
        const result =
          await sendOrderReadyWhatsApp({
            customerName,
            customerPhone,
            orderId,
            amount,
            upiId,
            shopName,
          });

        whatsappSent =
          result.success;

        whatsappError =
          result.success
            ? null
            : result.error;
      }
    }

    /*
    ==========================================
    RECEIVED
    ==========================================
    */

    if (
      status === "received" &&
      oldStatus !== "received"
    ) {
      console.log(
        "📱 Order marked RECEIVED"
      );

      if (!customerPhone) {
        whatsappError =
          "Customer has no phone number.";
      } else {
        const result =
          await sendThankYouWhatsApp({
            customerName,
            customerPhone,
            orderId,
            shopName,
          });

        whatsappSent =
          result.success;

        whatsappError =
          result.success
            ? null
            : result.error;
      }
    }

    /*
    ==========================================
    GET UPDATED ORDER
    ==========================================
    */

    const updatedOrder =
      await Order.findOne({
        _id: order._id,
        userId: req.user.id,
      }).populate("customerId");

    /*
    ==========================================
    RESPONSE
    ==========================================
    */

    res.json({
      success: true,

      order: updatedOrder,

      whatsappSent,

      whatsappError,

      customerPhone,

      shopName,

      upiId: upiId || null,

      message: `Order status updated to ${status}`,
    });
  } catch (err) {
    console.error(
      "❌ Error updating order:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Server error: " + err.message,
    });
  }
});

/*
===========================================================
GET DASHBOARD STATS
===========================================================
*/

router.get(
  "/dashboard/stats",
  auth,
  async (req, res) => {
    try {
      const orders = await Order.find({
        userId: req.user.id,
      });

      const customers =
        await Customer.find({
          userId: req.user.id,
        });

      const totalOrders =
        orders.length;

      const pendingOrders =
        orders.filter(
          (order) =>
            order.status !== "received"
        ).length;

      const totalCustomers =
        customers.length;

      const totalPayment =
        customers.reduce(
          (sum, customer) =>
            sum + (customer.price || 0),
          0
        );

      res.json({
        success: true,

        totalOrders,

        pendingOrders,

        totalCustomers,

        totalPayment,
      });
    } catch (err) {
      console.error(
        "Dashboard stats error:",
        err
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;