const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

let client = null;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

/**
 * Convert Indian phone numbers into WhatsApp format.
 *
 * Example:
 * 9876543210 -> whatsapp:+919876543210
 * +919876543210 -> whatsapp:+919876543210
 */
function formatWhatsAppNumber(phone) {
  if (!phone) return null;

  let number = String(phone).trim();

  number = number.replace(/\s+/g, "");
  number = number.replace(/-/g, "");

  if (number.startsWith("whatsapp:")) {
    return number;
  }

  if (number.startsWith("+")) {
    return `whatsapp:${number}`;
  }

  // India number
  if (number.length === 10) {
    return `whatsapp:+91${number}`;
  }

  return `whatsapp:+${number}`;
}

/**
 * Check whether Twilio WhatsApp is configured.
 */
function isConfigured() {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_FROM
  );
}

/**
 * Generate UPI payment URL.
 *
 * Example:
 * upi://pay?pa=ravi@upi&pn=Ravi%20Cloth%20Store&am=500&cu=INR
 */
function generateUPILink(upiId, amount, shopName = "Tailor Shop") {
  if (!upiId) return null;

  const encodedShopName = encodeURIComponent(shopName);

  return `upi://pay?pa=${encodeURIComponent(
    upiId
  )}&pn=${encodedShopName}&am=${Number(amount || 0).toFixed(
    2
  )}&cu=INR`;
}

/**
 * Generate QR URL.
 *
 * IMPORTANT:
 * This generates a QR image using an external QR service.
 * The resulting URL can be passed to Twilio as mediaUrl.
 */
function generateQRCodeURL(upiId, amount, shopName = "Tailor Shop") {
  if (!upiId) return null;

  const upiLink = generateUPILink(upiId, amount, shopName);

  return `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
    upiLink
  )}`;
}

/**
 * Send Order Ready WhatsApp message.
 *
 * Sends:
 * - Customer name
 * - Order ID
 * - Order ready message
 * - Amount
 * - UPI ID
 * - UPI payment link
 * - QR code image
 */
async function sendOrderReadyWhatsApp(
  customerName,
  customerPhone,
  orderId,
  amount,
  upiId,
  qrCodeUrl,
  shopName = "Tailor Shop"
) {
  try {
    if (!isConfigured()) {
      return {
        success: false,
        error:
          "Twilio WhatsApp is not configured. Check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_WHATSAPP_FROM.",
      };
    }

    if (!customerPhone) {
      return {
        success: false,
        error: "Customer phone number is missing.",
      };
    }

    const to = formatWhatsAppNumber(customerPhone);

    const upiLink = generateUPILink(
      upiId,
      amount,
      shopName
    );

    let message = `Hello ${customerName || "Customer"} 👋

Your order is ready! 🎉

📦 Order ID: ${orderId}

Please collect your order from ${shopName}.

💰 Payment Amount: ₹${Number(amount || 0).toFixed(2)}

💳 UPI ID:
${upiId || "Not available"}

🔗 UPI Payment Link:
${upiLink || "Not available"}

Please make the payment before/while collecting your order.

Thank you for choosing ${shopName} ❤️`;

    const messageOptions = {
      body: message,
      from: whatsappFrom,
      to,
    };

    // Add QR image if available
    if (qrCodeUrl) {
      messageOptions.mediaUrl = [qrCodeUrl];
    }

    const result = await client.messages.create(messageOptions);

    console.log("WhatsApp message sent:", result.sid);

    return {
      success: true,
      sid: result.sid,
    };
  } catch (error) {
    console.error("WhatsApp error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send Thank You message when customer receives order.
 */
async function sendThankYouWhatsApp(
  customerName,
  customerPhone,
  orderId,
  shopName = "Tailor Shop"
) {
  try {
    if (!isConfigured()) {
      return {
        success: false,
        error: "Twilio WhatsApp is not configured.",
      };
    }

    const to = formatWhatsAppNumber(customerPhone);

    const message = `Hello ${customerName || "Customer"} 👋

Thank you for visiting ${shopName}! ❤️

📦 Order ID: ${orderId}

Your order has been successfully received.

We hope you are happy with our service.

Thank you for choosing ${shopName}! 🙏`;

    const result = await client.messages.create({
      body: message,
      from: whatsappFrom,
      to,
    });

    return {
      success: true,
      sid: result.sid,
    };
  } catch (error) {
    console.error("WhatsApp error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  sendOrderReadyWhatsApp,
  sendThankYouWhatsApp,
  generateQRCodeURL,
  generateUPILink,
  formatWhatsAppNumber,
  isConfigured,
};