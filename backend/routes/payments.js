const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { verifyToken } = require('../middleware/authMiddleware');
const { logActivity } = require('../middleware/activityLogger');
const { db } = require('../config/firebase');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});
// Get Payment History for logged-in tenant
router.get('/history', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.uid;
    const paymentsSnapshot = await db.collection('payments')
      .where('user_id', '==', user_id)
      .orderBy('created_at', 'desc')
      .get();
    
    const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(payments);
  } catch (error) {
    console.error('Fetch Payment History Error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

router.post('/order', verifyToken, async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify Payment Signature
router.post('/verify', verifyToken, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, rent_month } = req.body;
  const user_id = req.user.uid;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    try {
      // Record payment in Firestore
      const paymentRef = await db.collection('payments').add({
        user_id,
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        amount,
        month: rent_month,
        status: 'Success',
        created_at: new Date()
      });

      await logActivity(user_id, 'RENT_PAYMENT_SUCCESS', { payment_id: paymentRef.id, amount, month: rent_month });

      res.json({ message: 'Payment verified successfully', payment_id: paymentRef.id });
    } catch (error) {
       console.error('Payment Record Error:', error);
       res.status(500).json({ error: 'Payment verified but failed to record in DB' });
    }
  } else {
    res.status(400).json({ error: 'Invalid payment signature' });
  }
});

module.exports = router;
