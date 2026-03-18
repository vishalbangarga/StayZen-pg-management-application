import React, { useState, useEffect } from 'react';
import { CreditCard, Download, CheckCircle2, Clock } from 'lucide-react';
import { paymentService } from '../../services/api';

const RentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handlePayment = async (amount, month) => {
    try {
      // 1. Create order on backend
      const { data: order } = await paymentService.createOrder({ amount, receipt: `receipt_${month}` });

      const options = {
        key: 'rzp_test_placeholder', // Should be in env
        amount: order.amount,
        currency: order.currency,
        name: 'PG Manager',
        description: `Rent for ${month}`,
        order_id: order.id,
        handler: async function (response) {
          // 2. Verify payment on backend
          await paymentService.verifyPayment({
            ...response,
            amount,
            rent_month: month
          });
          alert('Payment Successful!');
          window.location.reload();
        },
        prefill: {
          name: 'Tenant Name',
          email: 'tenant@example.com',
        },
        theme: { color: '#1E3A8A' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment initiation failed.');
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await paymentService.getHistory();
        // Map backend data to frontend format if needed
        const formattedPayments = data.map(p => ({
          id: p.id,
          month: p.month || 'Other',
          date: new Date(p.created_at || p.payment_date).toLocaleDateString(),
          amount: p.amount,
          status: p.status || p.payment_status || 'Paid'
        }));
        setPayments(formattedPayments);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Payment History...</div>;

  return (
    <div className="animate-soft">
      <div style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Rent & Payments</h1>
        <p className="text-muted">Track your rent history and due payments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
        <section>
          <div className="glass" style={{ borderRadius: '32px', overflow: 'hidden', background: 'var(--bg-card)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Month</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Amount</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '850', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '1.25rem 2rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i === payments.length - 1 ? 'none' : '1px solid var(--border)' }}>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>{p.month}</td>
                    <td style={{ padding: '1.25rem 2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.date}</td>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: '800' }}>₹{p.amount}</td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: '700', fontSize: '0.85rem' }}>
                         <CheckCircle2 size={16} /> {p.status}
                       </div>
                    </td>
                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                       <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
                         <Download size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside>
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px', background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--error)', marginBottom: '1.5rem' }}>
              <Clock size={20} />
              <span style={{ fontWeight: '850', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Upcoming Due</span>
            </div>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>₹8,000</h2>
            <p className="text-muted text-sm mb-8">Due date: Nov 05, 2025</p>
            
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', borderRadius: '16px', padding: '16px', fontWeight: '750', fontSize: '1rem' }}
              onClick={() => handlePayment(8000, 'November 2025')}
            >
              Pay Rent Now
            </button>
            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              A late fee of ₹200 applies after the 10th of every month.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RentManagement;
