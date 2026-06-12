import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CreditCard, Loader2, AlertCircle } from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function StoreCheckoutPage() {
  const { items, getCartTotal, getCartAdvanceTotal, clearCart } = useCart();
  const { user, isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const [contactData, setContactData] = useState({
    mobile: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [paymentMode, setPaymentMode] = useState('advance'); // 'advance' or 'full'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const totalAmount = getCartTotal();
  const advanceAmount = getCartAdvanceTotal();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ea580c]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-32 pb-24 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <Link to="/store" className="text-[#ea580c] font-bold uppercase tracking-widest text-sm hover:text-gray-900">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!isSignedIn) {
      openSignIn({ redirectUrl: window.location.href });
      return;
    }

    if (!contactData.mobile || !contactData.address || !contactData.city || !contactData.postalCode) {
      setError('Please fill in all shipping details.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const isAdvancePayment = paymentMode === 'advance';
    const finalAdvanceAmount = isAdvancePayment ? advanceAmount : totalAmount;

    try {
      // Create Booking (Store Order)
      const response = await fetch(`${backendUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryType: 'product',
          userId: user.id,
          customerName: user.fullName || `${user.firstName} ${user.lastName}`,
          mobileNumber: contactData.mobile,
          enquiryType: 'Store Order', // Used for grouping in dashboard
          productData: { 
            items, 
            shipping: { 
              address: contactData.address, 
              city: contactData.city, 
              postalCode: contactData.postalCode 
            } 
          },
          eventDate: new Date(), // Put current date to satisfy any required fields
          isAdvancePayment: true, // Always true for store checkout to trigger Razorpay
          totalAmount,
          advanceAmount: finalAdvanceAmount
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create order.');
      }

      const order = result.order;
      if (!order) throw new Error('Payment gateway order creation failed.');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: order.amount,
        currency: order.currency,
        name: 'Guide Studio',
        description: `Store Order Payment`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${backendUrl}/api/bookings/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: result.data._id
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              navigate('/dashboard'); // or a specific success page
            } else {
              setError('Payment verification failed.');
              setIsSubmitting(false);
            }
          } catch (err) {
            setError('Payment verification failed.');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user?.primaryEmailAddress?.emailAddress || '',
          contact: contactData.mobile,
        },
        theme: { color: '#111827' },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            setError('Payment cancelled. Your order was not completed.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setIsSubmitting(false);
        setError(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans w-full pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/store" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 mb-8 uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-serif text-gray-900 mb-2">Secure Checkout</h1>
              <p className="text-gray-500">Please provide your shipping and contact details below.</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Mobile Number *</label>
                  <input 
                    type="tel" 
                    value={contactData.mobile} 
                    onChange={e => setContactData({...contactData, mobile: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none transition-all"
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Street Address *</label>
                  <input 
                    type="text" 
                    value={contactData.address} 
                    onChange={e => setContactData({...contactData, address: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none transition-all"
                    placeholder="House No, Street, Landmark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">City *</label>
                  <input 
                    type="text" 
                    value={contactData.city} 
                    onChange={e => setContactData({...contactData, city: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none transition-all"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Postal Code *</label>
                  <input 
                    type="text" 
                    value={contactData.postalCode} 
                    onChange={e => setContactData({...contactData, postalCode: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none transition-all"
                    placeholder="PIN Code"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-lg font-bold text-gray-900">Payment Selection</h2>
                <p className="text-gray-500 text-sm mt-1">Choose how you would like to proceed with your payment.</p>
              </div>
              
              <div className="space-y-4">
                {advanceAmount > 0 && advanceAmount < totalAmount && (
                  <div 
                    onClick={() => setPaymentMode('advance')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${paymentMode === 'advance' ? 'border-[#ea580c] bg-orange-50/50 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-300 bg-white hover:shadow-sm'}`}
                  >
                    <div className="absolute top-0 right-0 p-3">
                      <ShieldCheck className={`w-5 h-5 transition-colors ${paymentMode === 'advance' ? 'text-[#ea580c]' : 'text-gray-300'}`} />
                    </div>
                    <div className="flex items-start">
                      <div className="pr-8 flex-grow">
                        <div className="flex items-center gap-3">
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMode === 'advance' ? 'border-[#ea580c]' : 'border-gray-300'}`}>
                             {paymentMode === 'advance' && <div className="w-2.5 h-2.5 rounded-full bg-[#ea580c]"></div>}
                           </div>
                           <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                             Pay Advance Now
                           </h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 ml-8">
                          Secure your order instantly by paying the calculated advance amount.
                        </p>
                      </div>
                      <div className="text-right">
                         <span className="block text-xl font-black text-[#ea580c]">₹{advanceAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div 
                  onClick={() => setPaymentMode('full')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${paymentMode === 'full' || advanceAmount === 0 || advanceAmount === totalAmount ? 'border-[#ea580c] bg-orange-50/50 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-300 bg-white hover:shadow-sm'}`}
                >
                   <div className="absolute top-0 right-0 p-3">
                      <CreditCard className={`w-5 h-5 transition-colors ${paymentMode === 'full' || advanceAmount === 0 || advanceAmount === totalAmount ? 'text-[#ea580c]' : 'text-gray-300'}`} />
                   </div>
                   <div className="flex items-start">
                      <div className="pr-8 flex-grow">
                        <div className="flex items-center gap-3">
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMode === 'full' || advanceAmount === 0 || advanceAmount === totalAmount ? 'border-[#ea580c]' : 'border-gray-300'}`}>
                             {(paymentMode === 'full' || advanceAmount === 0 || advanceAmount === totalAmount) && <div className="w-2.5 h-2.5 rounded-full bg-[#ea580c]"></div>}
                           </div>
                           <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                             Pay Full Amount
                           </h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 ml-8">
                          Clear the entire balance now for a hassle-free experience.
                        </p>
                      </div>
                      <div className="text-right">
                         <span className="block text-xl font-black text-[#ea580c]">₹{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-32">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h3 className="font-serif text-xl text-gray-900">Order Summary</h3>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm">{items.length} Items</span>
              </div>
              
              <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500 font-medium">Qty: {item.qty}</span>
                        <span className="text-sm font-bold text-gray-900">₹{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Booking Amount</span>
                  <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                {paymentMode === 'advance' && advanceAmount > 0 && advanceAmount < totalAmount && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Required Advance</span>
                    <span className="font-medium text-gray-900">₹{advanceAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                )}
                {paymentMode === 'advance' && advanceAmount > 0 && advanceAmount < totalAmount && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Remaining Balance</span>
                    <span className="font-medium text-gray-900">₹{(totalAmount - advanceAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600 pt-1">
                  <span>Taxes & Shipping</span>
                  <span className="font-medium text-gray-900">Calculated later</span>
                </div>
                <div className="pt-3 border-t border-gray-200 mt-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total to Pay Now</span>
                    <span className="text-3xl font-black text-[#ea580c]">
                      ₹{(paymentMode === 'advance' && advanceAmount > 0 ? advanceAmount : totalAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white">
                <button 
                  onClick={handlePayment}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gray-900 text-white rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#ea580c] transition-colors shadow-lg flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard className="w-5 h-5 mr-2" /> Pay Now</>
                  )}
                </button>
                <div className="mt-4 flex items-center justify-center text-xs text-gray-500 gap-1">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> Secure encrypted payment
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
