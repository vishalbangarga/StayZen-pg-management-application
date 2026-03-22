import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Wallet, Smartphone, Landmark, ArrowLeft } from 'lucide-react';
import { paymentService } from '../../services/api';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  const [loading, setLoading] = useState(false);

  // Default values if no booking context (e.g. direct nav)
  const amount = booking ? 5000 : 8000; // Mock amount for booking deposit or rent
  const pgName = booking ? booking.pg_name : 'PG Monthly Rent';

  const paymentMethods = [
    { id: 'gpay', name: 'Google Pay', icon: <Smartphone color="#4285F4" />, description: 'Pay via Google Pay UPI' },
    { id: 'phonepe', name: 'PhonePe', icon: <Smartphone color="#6739B7" />, description: 'Pay via PhonePe UPI' },
    { id: 'paytm', name: 'Paytm', icon: <Wallet color="#00BAF2" />, description: 'Pay via Paytm Wallet/UPI' },
    { id: 'amazon', name: 'Amazon Pay', icon: <Wallet color="#FF9900" />, description: 'Pay via Amazon Pay' },
    { id: 'upi', name: 'Other UPI', icon: <Landmark color="#1E3A8A" />, description: 'Use any other UPI ID' },
    { id: 'card', name: 'Card / Net Banking', icon: <CreditCard />, description: 'Debit/Credit cards' },
  ];

  const handleProcessPayment = async (method) => {
    setLoading(true);
    try {
      // In a real Razorpay integration, the backend creates an order
      // Then the frontend opens the Razorpay checkout.
      // Razorpay handles UPI/GPay/etc. within its own interface.
      
      const { data: order } = await paymentService.createOrder({ 
        amount, 
        receipt: `booking_${booking?.id || 'rent'}` 
      });

      const options = {
        key: 'rzp_test_placeholder', // Should be in env
        amount: order.amount,
        currency: order.currency,
        name: 'StayZen PG',
        description: `Payment for ${pgName}`,
        order_id: order.id,
        handler: async function (response) {
          await paymentService.verifyPayment({
            ...response,
            amount,
            rent_month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
          });
          alert('Payment Successful!');
          navigate('/tenant-dashboard');
        },
        prefill: {
          name: 'Tenant Name',
          email: 'tenant@example.com',
        },
        theme: { color: '#1E3A8A' },
        // Forcing specific method if possible via Razorpay (config dependent)
        config: {
            display: {
                blocks: {
                    upi: {
                        name: 'Pay with UPI',
                        instruments: [
                            { method: 'upi', vpa: 'test@upi' }
                        ]
                    }
                },
                sequence: ['block.upi', 'block.card'],
                preferences: { show_default_blocks: true }
            }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-soft">
       <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', marginBottom: '2rem', cursor: 'pointer' }}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Secure Checkout</h1>
        <p className="text-muted">Select your preferred payment method to complete the booking.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
        <section>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {paymentMethods.map((m) => (
              <div 
                key={m.id} 
                className="glass payment-method-card" 
                style={{ 
                    padding: '1.5rem 2rem', 
                    borderRadius: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '2px solid transparent'
                }}
                onClick={() => !loading && handleProcessPayment(m.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {m.icon}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '700', fontSize: '1.1rem' }}>{m.name}</h3>
                    <p className="text-muted text-xs">{m.description}</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-muted" />
              </div>
            ))}
          </div>
        </section>

        <aside>
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px', background: 'var(--bg-card)', position: 'sticky', top: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Summary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Property</span>
                <span style={{ fontWeight: '600' }}>{pgName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Type</span>
                <span style={{ fontWeight: '600' }}>{booking?.room_type || 'Room Rent'} sharing</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>Total Amount</span>
                <span style={{ fontWeight: '850', fontSize: '1.5rem', color: 'var(--primary)' }}>₹{amount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--success)', background: '#f0fdf4', padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} />
              <span>Payments are 100% secure and encrypted.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Add some styles for the hover effect
const ArrowRight = ({ size, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
    </svg>
);

export default PaymentPage;
