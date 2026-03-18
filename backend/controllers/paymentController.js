const { db } = require('../config/firebase');

const recordPayment = async (req, res) => {
  try {
    const { tenant_id, amount, payment_date, due_date, payment_status } = req.body;

    const paymentRef = await db.collection('payments').add({
      tenant_id,
      amount,
      payment_date: payment_date || new Date().toISOString(),
      due_date,
      payment_status: payment_status || 'paid',
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ id: paymentRef.id, message: 'Payment recorded successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPaymentsByTenant = async (req, res) => {
  try {
    const paymentsSnapshot = await db.collection('payments')
      .where('tenant_id', '==', req.params.tenant_id)
      .get();
    const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { recordPayment, getPaymentsByTenant };
