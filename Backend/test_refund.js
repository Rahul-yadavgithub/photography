import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function run() {
  try {
    const refund = await razorpay.payments.refund('pay_T1BU5a2IZkQ5kB', {
      amount: 200, // 2 INR
      notes: { reason: 'Test refund' }
    });
    console.log("Success:", refund);
  } catch (error) {
    console.error("Error:", JSON.stringify(error, null, 2));
  }
}
run();
