import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Initialize Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Initialize Twilio Client
let twilioClient = null;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } else {
    console.warn('Twilio credentials not found in environment variables. SMS will not be sent.');
  }
} catch (error) {
  console.error('Failed to initialize Twilio client:', error);
}

/**
 * Send an email notification to the admin
 */
const sendEmail = async (subject, text) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !process.env.EMAIL_USER) {
    console.warn('Admin email or Email user not configured. Skipping email notification.');
    return;
  }

  try {
    const mailOptions = {
      from: `"Sanjay Studio Notifications" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: subject,
      text: text,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent to ${adminEmail}`);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

/**
 * Send an SMS notification to the admin
 */
const sendSMS = async (message) => {
  const adminPhone = process.env.ADMIN_PHONE;
  if (!twilioClient || !adminPhone || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn('Twilio client, admin phone, or Twilio phone number not configured. Skipping SMS.');
    return;
  }

  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: adminPhone,
    });
    console.log(`SMS notification sent to ${adminPhone}`);
  } catch (error) {
    if (error.code === 21608) {
      console.warn(`Twilio Trial Limitation: Cannot send SMS to unverified number ${adminPhone}. Please verify this number in the Twilio console or upgrade your account.`);
    } else {
      console.error('Error sending SMS notification:', error.message || error);
    }
  }
};

/**
 * Unified wrapper to send both Email and SMS notifications for new bookings/orders
 * @param {Object} booking - The booking or order document from the database
 */
export const sendAdminNotification = async (booking) => {
  const isStoreOrder = booking.inquiryType === 'product' || booking.enquiryType === 'Store Order';
  const eventType = isStoreOrder ? 'Store Order' : 'Booking';
  const priceLabel = booking.totalAmount > 0 ? `Total: ₹${booking.totalAmount}` : 'Custom Quote Requested';

  // Construct a concise message for SMS
  const smsMessage = `New ${eventType}!\nName: ${booking.customerName}\nPhone: ${booking.mobileNumber}\nItem: ${booking.packageName || booking.enquiryType}\n${priceLabel}`;

  // Construct a more detailed message for Email
  let emailMessage = `A new ${eventType} has been placed.\n\n`;
  emailMessage += `Customer Details:\n`;
  emailMessage += `- Name: ${booking.customerName}\n`;
  emailMessage += `- Phone: ${booking.mobileNumber}\n\n`;
  emailMessage += `${eventType} Details:\n`;
  emailMessage += `- Type: ${booking.enquiryType}\n`;
  emailMessage += `- Package/Item: ${booking.packageName || 'Custom'}\n`;
  if (!isStoreOrder && booking.eventDate) {
    emailMessage += `- Date: ${new Date(booking.eventDate).toLocaleDateString()}\n`;
  }
  if (!isStoreOrder && booking.eventLocation) {
    emailMessage += `- Location: ${booking.eventLocation}\n`;
  }
  emailMessage += `- Amount: ${priceLabel}\n`;
  
  if (booking.advanceAmount > 0 && booking.paymentStatus === 'paid') {
    emailMessage += `- Paid Advance: ₹${booking.advanceAmount}\n`;
  }

  // Dispatch both concurrently without blocking the main thread
  // We use Promise.allSettled so if one fails, the other can still succeed
  Promise.allSettled([
    sendEmail(`New ${eventType}: ${booking.customerName}`, emailMessage),
    sendSMS(smsMessage)
  ]).catch(err => console.error("Unhandled error in sendAdminNotification:", err));
};

export default sendAdminNotification;
