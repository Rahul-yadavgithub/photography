import React, { useEffect, useState } from 'react';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Phone, Mail, Clock, CheckCircle, XCircle, CreditCard, AlertCircle, Package, Archive, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumLoader from '../components/shared/PremiumLoader';
import useSEO from '../hooks/useSEO';

const CustomerDashboard = () => {
  useSEO();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState({ type: null, booking: null });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/bookings/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setBookings(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, booking) => {
    setActiveModal({ type, booking });
  };

  const closeModal = () => {
    if (!isProcessing) {
      setActiveModal({ type: null, booking: null });
    }
  };

  const handleConfirmAction = async () => {
    const { type, booking } = activeModal;
    if (!booking || !type) return;

    try {
      setIsProcessing(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const endpoint = `${backendUrl}/api/bookings/${booking._id}/${type}`;
      const token = await getToken();
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        fetchBookings(); // Refresh data
        closeModal();
      } else {
        alert(result.message || `Failed to ${type} booking.`);
      }
    } catch (error) {
      console.error(`${type} error:`, error);
      alert(`Network error. Could not ${type} booking.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to get normalized booking status badge
  const getBookingStatusBadge = (booking) => {
    const bStatus = booking.bookingStatus || booking.status?.toLowerCase();
    
    if (bStatus === 'approved' || bStatus === 'confirmed' || bStatus === 'completed') {
      return <span className="flex items-center text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Approved</span>;
    }
    if (bStatus === 'rejected') {
      return <span className="flex items-center text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full"><XCircle className="w-3.5 h-3.5 mr-1" /> Rejected</span>;
    }
    if (bStatus === 'cancelled') {
      return <span className="flex items-center text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full"><XCircle className="w-3.5 h-3.5 mr-1" /> Cancelled</span>;
    }
    if (bStatus === 'pending_approval' || bStatus === 'pending' || bStatus === 'contacted' || bStatus === 'draft') {
      return <span className="flex items-center text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full"><Clock className="w-3.5 h-3.5 mr-1" /> Pending Approval</span>;
    }
    
    return <span className="flex items-center text-xs font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-full">{bStatus}</span>;
  };

  const getRefundBadge = (rStatus) => {
    if (rStatus === 'processed') return <span className="text-purple-600 font-bold">Refund Completed</span>;
    if (rStatus === 'pending') return <span className="text-blue-600 font-bold">Refund Processing</span>;
    if (rStatus === 'failed') return <span className="text-red-600 font-bold">Refund Failed</span>;
    return null;
  };

  const getPaymentStatusBadge = (pStatus) => {
    if (pStatus === 'paid') return <span className="text-green-600 font-bold">Paid</span>;
    if (pStatus === 'failed') return <span className="text-red-600 font-bold">Failed</span>;
    if (pStatus === 'refunded' || pStatus === 'partially_refunded') return <span className="text-purple-600 font-bold">Refunded</span>;
    if (pStatus === 'pending') return <span className="text-amber-600 font-bold">Pending</span>;
    return <span className="text-gray-500 font-bold">Not Required</span>;
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 m-auto mt-6 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-sans font-medium tracking-tight text-gray-900 mb-1">{user?.fullName || 'Welcome'}</h1>
              <p className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut(() => navigate('/'))}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm tracking-wide rounded-full hover:bg-gray-50 hover:text-red-600 transition-colors shadow-sm"
          >
            Log Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative ${activeTab === 'bookings' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            My Bookings
            {activeTab === 'bookings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('purchases')}
            className={`pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative ${activeTab === 'purchases' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            My Purchases
            {activeTab === 'purchases' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative ${activeTab === 'profile' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Profile Details
            {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
          </button>
        </div>

        {/* Content */}
        {['bookings', 'purchases'].includes(activeTab) && (() => {
          const isPurchases = activeTab === 'purchases';
          const displayedItems = bookings.filter(b => 
            isPurchases ? b.inquiryType === 'product' : (b.inquiryType === 'service' || !b.inquiryType)
          );

          return (
          <div>
            {loading ? (
              <div className="py-20 flex justify-center items-center">
                <PremiumLoader text={`LOADING ${isPurchases ? 'PURCHASES' : 'BOOKINGS'}...`} />
              </div>
            ) : displayedItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No {isPurchases ? 'purchases' : 'bookings'} yet</h3>
                <p className="text-gray-500 mb-6">
                  {isPurchases ? 'When you inquire about store products, they will appear here.' : 'When you book a session or package, it will appear here.'}
                </p>
                <button onClick={() => navigate(isPurchases ? '/store' : '/packages')} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-full text-sm hover:bg-gray-800 transition-colors">
                  Explore {isPurchases ? 'Store' : 'Packages'}
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {displayedItems.map((booking) => {
                  const bStatus = booking.bookingStatus || booking.status?.toLowerCase();
                  const canCancel = ['draft', 'pending_approval', 'pending'].includes(bStatus);

                  return (
                    <div key={booking._id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                      {/* Top Header Row */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ref: {booking.bookingReference}</span>
                            {getBookingStatusBadge(booking)}
                          </div>
                          <h3 className="text-2xl font-serif text-gray-900 mb-1">
                            {booking.inquiryType === 'product' ? booking.productData?.productName : (booking.packageName || booking.enquiryType)}
                          </h3>
                          <p className="text-gray-500 text-sm flex items-center gap-2">
                            {booking.inquiryType === 'product' ? (
                              <>
                                <Package className="w-4 h-4" /> 
                                Qty: {booking.productData?.quantity || 1}
                              </>
                            ) : (
                              <>
                                <Calendar className="w-4 h-4" /> 
                                {booking.eventDate ? format(new Date(booking.eventDate), 'EEEE, MMMM do, yyyy') : 'No Date'}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Info Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Status Timeline */}
                        <div className="md:col-span-1">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Timeline</h4>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">Booking Created</p>
                                <p className="text-xs text-gray-500">{format(new Date(booking.createdAt), 'MMM do, yyyy')}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${booking.paymentStatus === 'paid' ? 'bg-gray-900' : 'bg-gray-200'}`}>
                                {booking.paymentStatus === 'paid' && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                              <div>
                                <p className={`text-sm font-bold ${booking.paymentStatus === 'paid' ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {booking.paymentStatus === 'paid' ? 'Payment Received' : 'Payment Not Required / Pending'}
                                </p>
                              </div>
                            </div>

                            {(bStatus === 'approved' || bStatus === 'rejected') && (
                              <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${bStatus === 'approved' ? 'bg-green-600' : 'bg-red-600'}`}>
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                  <p className={`text-sm font-bold ${bStatus === 'approved' ? 'text-green-700' : 'text-red-700'}`}>
                                    {bStatus === 'approved' ? 'Studio Approved' : 'Studio Rejected'}
                                  </p>
                                  {booking.rejectionReason && (
                                    <p className="text-xs text-gray-500 mt-1">Reason: {booking.rejectionReason}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {booking.refundStatus && booking.refundStatus !== 'not_required' && (
                              <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${booking.refundStatus === 'processed' ? 'bg-blue-600' : 'bg-amber-500'}`}>
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900">
                                    Refund {booking.refundStatus === 'processed' ? 'Processed' : 'Initiated'}
                                  </p>
                                  <p className="text-xs text-gray-500">Takes 5-7 business days.</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Financials */}
                        <div className="bg-gray-50 rounded-2xl p-5 md:col-span-2 flex flex-col justify-center">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Amount</p>
                              <p className="text-lg font-bold text-gray-900">₹{(booking.totalAmount || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Amount Paid</p>
                              <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                ₹{(booking.amountPaid || 0).toLocaleString()} 
                                <span className="text-xs font-normal border border-gray-200 bg-white px-2 py-0.5 rounded-full">
                                  {getPaymentStatusBadge(booking.paymentStatus)}
                                </span>
                              </p>
                            </div>
                            {booking.advanceAmount > 0 && booking.paymentStatus !== 'paid' && (
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Advance Required</p>
                                <p className="text-sm font-bold text-gray-700">₹{(booking.advanceAmount || 0).toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-end gap-4">
                        {booking.paymentStatus === 'paid' && bStatus !== 'rejected' && bStatus !== 'cancelled' && (
                          <button 
                            onClick={() => navigate('/contact')}
                            className="px-6 py-2.5 bg-gray-900 text-white font-bold text-xs tracking-wide uppercase rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                          >
                            Contact Support
                          </button>
                        )}
                        
                        {booking.refundStatus === 'pending' && (
                          <button 
                            disabled
                            className="px-6 py-2.5 bg-gray-100 text-gray-500 font-bold text-xs tracking-wide uppercase rounded-xl cursor-not-allowed border border-gray-200"
                          >
                            Refund In Progress
                          </button>
                        )}

                        {canCancel && booking.paymentStatus !== 'paid' && (
                          <button 
                            onClick={() => openModal('cancel', booking)}
                            className="px-6 py-2.5 bg-white border border-red-200 text-red-600 font-bold text-xs tracking-wide uppercase rounded-xl hover:bg-red-50 transition-colors shadow-sm"
                          >
                            Cancel Booking
                          </button>
                        )}

                        {(bStatus === 'rejected' || bStatus === 'cancelled') && booking.refundStatus !== 'pending' && (
                          <button 
                            onClick={() => openModal('archive', booking)}
                            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-xs tracking-wide uppercase rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                          >
                            <Archive className="w-4 h-4" /> Archive
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
          );
        })()}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center mb-2">
                  <User className="w-4 h-4 mr-2" /> Full Name
                </label>
                <p className="text-gray-900 font-medium text-lg">{user?.fullName || 'Not provided'}</p>
              </div>
              <div className="h-px bg-gray-100 w-full"></div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center mb-2">
                  <Mail className="w-4 h-4 mr-2" /> Email Address
                </label>
                <p className="text-gray-900 font-medium text-lg">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <div className="h-px bg-gray-100 w-full"></div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center mb-2">
                  <Phone className="w-4 h-4 mr-2" /> Phone Number
                </label>
                <p className="text-gray-900 font-medium text-lg">{user?.primaryPhoneNumber?.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-xs text-gray-400">To update your profile information, please manage via your provider.</p>
            </div>
          </div>
        )}

      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {activeModal.type && activeModal.booking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${activeModal.type === 'cancel' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                  {activeModal.type === 'cancel' ? <AlertTriangle className="w-6 h-6" /> : <Archive className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {activeModal.type === 'cancel' ? 'Cancel Booking' : 'Archive Booking'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ref: {activeModal.booking.bookingReference}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name</span>
                  <span className="text-sm font-bold text-gray-900">{activeModal.booking.packageName || activeModal.booking.enquiryType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Payment</span>
                  <span className="text-sm font-bold text-gray-900 capitalize">{activeModal.booking.paymentStatus.replace('_', ' ')}</span>
                </div>
              </div>

              {activeModal.type === 'cancel' && activeModal.booking.paymentStatus === 'paid' && (
                <p className="text-sm text-red-600 font-medium mb-6 bg-red-50 p-3 rounded-xl border border-red-100">
                  Cancelling this booking may initiate a refund according to the refund policy.
                </p>
              )}

              {activeModal.type === 'archive' && (
                <p className="text-sm text-gray-600 font-medium mb-6">
                  This will remove the booking from your dashboard view.
                </p>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={closeModal}
                  disabled={isProcessing}
                  className="px-5 py-2.5 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={isProcessing}
                  className={`px-5 py-2.5 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 ${activeModal.type === 'cancel' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                >
                  {isProcessing ? 'Processing...' : `Confirm ${activeModal.type === 'cancel' ? 'Cancellation' : 'Archive'}`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerDashboard;
