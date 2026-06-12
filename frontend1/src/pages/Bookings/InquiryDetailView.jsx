import { useApi } from '../../hooks/useApi';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Phone, Mail, Calendar, MessageSquare, Package, CheckCircle2, XCircle, Clock, Check, MoreHorizontal, PhoneCall, Copy, CreditCard, AlertCircle } from 'lucide-react';
import { getUrgency, getStatusColor, getDaysRemaining } from './utils';

const InquiryDetailView = () => {
  const { fetchWithAuth } = useApi();
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  
  const [inquiry, setInquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [inquiryId]);

  const fetchBooking = async () => {
    try {
      setIsLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const fetchResult = await fetchWithAuth('/api/bookings/${inquiryId}');
        const response = { ok: true, json: async () => fetchResult };
      const result = await response.json();
      if (result.success) {
        const data = result.data;
        data.timeline = data.timeline || [{ id: 1, action: 'Inquiry Submitted', date: data.createdAt, type: 'system' }];
        setInquiry(data);
      }
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const fetchResult = await fetchWithAuth('/api/bookings/${inquiry._id}/approve', {
        method: 'PUT'
      });
        const response = { ok: true, json: async () => fetchResult };
      const result = await response.json();
      
      if (result.success) {
        setIsApproveModalOpen(false);
        navigate(`/bookings/category/${encodeURIComponent(categoryName)}`);
      } else {
        alert(result.message || "Failed to approve booking");
      }
    } catch (error) {
      console.error("Failed to approve:", error);
      alert("Failed to approve booking");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setIsProcessing(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const fetchResult = await fetchWithAuth('/api/bookings/${inquiry._id}/reject', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason })
      });
        const response = { ok: true, json: async () => fetchResult };
      const result = await response.json();
      
      if (result.success) {
        setIsRejectModalOpen(false);
        setRejectionReason('');
        navigate(`/bookings/category/${encodeURIComponent(categoryName)}`);
      } else {
        alert(result.message || "Failed to reject booking");
      }
    } catch (error) {
      console.error("Failed to reject:", error);
      alert("Failed to reject booking");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const fetchResult = await fetchWithAuth('/api/bookings/${inquiry._id}', {
        method: 'DELETE'
      });
        const response = { ok: true, json: async () => fetchResult };
      const result = await response.json();
      
      if (result.success) {
        setIsDeleteModalOpen(false);
        navigate(`/bookings/category/${encodeURIComponent(categoryName)}`);
      } else {
        alert(result.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete booking");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLegacyStatusChange = async (newStatus) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const fetchResult = await fetchWithAuth('/api/bookings/${inquiry._id}/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
        const response = { ok: true, json: async () => fetchResult };
      const result = await response.json();
      
      if (result.success) {
        fetchBooking();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <h2 className="text-xl font-bold text-zinc-500 animate-pulse">Loading Details...</h2>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <h2 className="text-2xl font-bold text-zinc-900">Inquiry Not Found</h2>
        <button onClick={() => navigate('/bookings')} className="mt-4 px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors">
          Return to Bookings
        </button>
      </div>
    );
  }

  const urgency = getUrgency(inquiry.eventDate);
  const currentStatus = inquiry.bookingStatus || inquiry.status;
  const statusColor = getStatusColor(currentStatus);
  const paymentStatusColor = getStatusColor(inquiry.paymentStatus);
  const daysRemaining = getDaysRemaining(inquiry.eventDate);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
  };

  const categoryName = inquiry.enquiryType || 'Other';

  return (
    <div className="animate-in slide-in-from-right-4 duration-500 relative">

      {/* Approve Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Approve Booking?</h3>
            <p className="text-zinc-500 mb-8 leading-relaxed">
              Are you sure you want to approve this booking? The client will be notified and the dates will be marked as confirmed.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsApproveModalOpen(false)}
                className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-colors disabled:opacity-50"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                onClick={handleApprove}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Yes, Approve Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Reject Booking</h3>
            <p className="text-sm text-zinc-500 mb-4">
              {inquiry.paymentStatus === 'paid' 
                ? "This booking is paid. Rejecting it will automatically trigger a full refund via Razorpay." 
                : "Please provide a reason for rejecting this booking."}
            </p>
            <textarea 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Dates unavailable, Team booked out..."
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-sm mb-4 h-24 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 font-bold text-sm rounded-xl hover:bg-zinc-50 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-red-600 mb-2">Delete Permanently?</h3>
            <p className="text-sm text-zinc-500 mb-6">
              This action cannot be undone. All associated records will be removed.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 font-bold text-sm rounded-xl hover:bg-zinc-50 transition-colors"
                disabled={isProcessing}
              >
                No
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Yes, Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate(`/bookings/category/${encodeURIComponent(categoryName)}`)}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 font-bold text-sm mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to {categoryName} Inquiries
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{inquiry.bookingReference}</h1>
            <span className={`inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${statusColor}`}>
              {currentStatus?.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-sm text-zinc-500 font-medium mt-1">Submitted on {formatDate(inquiry.createdAt)} via {categoryName}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {(currentStatus === 'pending_approval' || currentStatus === 'draft' || currentStatus === 'Pending') && (
            <>
              <button 
                onClick={() => setIsApproveModalOpen(true)}
                className="px-4 py-2 bg-zinc-900 text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-2"
                disabled={isProcessing}
              >
                <CheckCircle2 className="w-4 h-4" /> Approve
              </button>
            </>
          )}

          {currentStatus === 'Approved' && (
             <button 
               onClick={() => handleLegacyStatusChange('Completed')}
               className="px-5 py-2.5 bg-purple-50 text-purple-700 font-bold rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors shadow-sm flex items-center gap-2"
             >
               <Check className="w-4 h-4" /> Mark Completed
             </button>
          )}

          {currentStatus !== 'rejected' && currentStatus !== 'cancelled' && currentStatus !== 'Completed' && (
            <button 
              onClick={() => setIsRejectModalOpen(true)}
              className="px-4 py-2 bg-white border border-zinc-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors shadow-sm"
            >
              Reject
            </button>
          )}

          {currentStatus === 'rejected' && (
            <>
              {!inquiry.canDelete ? (
                <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 font-bold text-sm rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Refund Required Before Deletion
                </div>
              ) : (
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                >
                  Delete Permanently
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Customer & Package Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Urgency Banner (Only for Services) */}
          {inquiry.inquiryType !== 'product' && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${urgency.color}`}>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <div>
                  <span className="font-bold block">Event Date: {formatDate(inquiry.eventDate)}</span>
                  <span className="text-sm opacity-90">Urgency Level: {urgency.label}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black">{daysRemaining < 0 ? '0' : daysRemaining}</span>
                <span className="block text-xs font-bold uppercase tracking-wider opacity-80">Days Left</span>
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-zinc-400" /> Payment Information
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Total Value</p>
                <p className="text-xl font-bold text-zinc-900">₹{(inquiry.totalAmount || 0).toLocaleString()}</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Amount Paid</p>
                <p className="text-xl font-bold text-zinc-900">₹{(inquiry.amountPaid || 0).toLocaleString()}</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Payment Status</p>
                <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${paymentStatusColor}`}>
                  {(inquiry.paymentStatus || 'Not Required').replace(/_/g, ' ')}
                </span>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Refund Status</p>
                <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getStatusColor(inquiry.refundStatus)}`}>
                  {(inquiry.refundStatus || 'Not Required').replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {(inquiry.paymentId || inquiry.refundId) && (
              <div className="mt-4 pt-4 border-t border-zinc-100 flex gap-6">
                {inquiry.paymentId && (
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Payment ID (Razorpay)</span>
                    <span className="text-sm text-zinc-600 font-mono">{inquiry.paymentId}</span>
                  </div>
                )}
                {inquiry.refundId && (
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Refund ID (Razorpay)</span>
                    <span className="text-sm text-zinc-600 font-mono">{inquiry.refundId}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Customer Information Panel */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-zinc-400" /> Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Full Name</label>
                <span className="font-bold text-zinc-900">{inquiry.customerName}</span>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Enquiry Type</label>
                <span className="font-bold text-zinc-900">{inquiry.enquiryType}</span>
              </div>
              <div className="col-span-full md:col-span-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Phone Number</label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900">{inquiry.mobileNumber}</span>
                  <a href={`tel:${inquiry.mobileNumber}`} className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md transition-colors">
                    <PhoneCall className="w-3 h-3" /> Call
                  </a>
                </div>
              </div>
              
              {inquiry.requirements && Object.keys(inquiry.requirements).length > 0 && (
                <div className="col-span-full pt-4 border-t border-zinc-100">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Shoot Requirements
                  </label>
                  <div className="text-sm text-zinc-600 bg-zinc-50 p-4 rounded-xl border border-zinc-100 grid grid-cols-2 gap-y-2 gap-x-4">
                    {Object.entries(inquiry.requirements).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">{key}</span>
                        <span className="font-medium text-zinc-900 capitalize">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Package / Product Details Panel */}
          {inquiry.inquiryType === 'product' ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-zinc-400" /> Product Order Information
              </h2>

              <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-5">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-white border border-zinc-200 px-2 py-0.5 rounded-md mb-2 inline-block">
                      {inquiry.productData?.productCategory || 'Store'}
                    </span>
                    <h3 className="text-xl font-bold text-zinc-900">{inquiry.productData?.productName || 'Product'}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Quantity</span>
                    <span className="text-xl font-black text-blue-600">{inquiry.productData?.quantity || 1} units</span>
                  </div>
                </div>

                {inquiry.specialInstructions && (
                  <div className="mb-4">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Special Instructions</label>
                    <p className="text-sm text-zinc-700 bg-white p-3 rounded-lg border border-zinc-200">{inquiry.specialInstructions}</p>
                  </div>
                )}
                
                {inquiry.notes && (
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Additional Notes</label>
                    <p className="text-sm text-zinc-700 bg-white p-3 rounded-lg border border-zinc-200">{inquiry.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-zinc-400" /> Booking Plan Information
              </h2>

              <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-5">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-white border border-zinc-200 px-2 py-0.5 rounded-md mb-2 inline-block">
                      {categoryName}
                    </span>
                    <h3 className="text-xl font-bold text-zinc-900">{inquiry.packageName || inquiry.advancePlan || 'Custom Plan'}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Advance Required</span>
                    <span className="text-xl font-black text-emerald-600">{inquiry.advancePercentage || 0}%</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Selected Benefits</label>
                  {inquiry.selectedBenefits && inquiry.selectedBenefits.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {inquiry.selectedBenefits.map((addon, idx) => (
                        <span key={idx} className="bg-white border border-zinc-200 text-zinc-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> {addon}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">No special benefits selected.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-400" /> Activity Timeline
            </h2>

            <div className="space-y-6">
              {inquiry.timeline.map((event, index) => (
                <div key={event.id || index} className="relative pl-6">
                  {/* Timeline Line */}
                  {index !== inquiry.timeline.length - 1 && (
                    <div className="absolute left-[9px] top-6 bottom-[-24px] w-0.5 bg-zinc-100"></div>
                  )}
                  
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${
                    event.type === 'system' ? 'bg-blue-500' : 'bg-zinc-900'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-zinc-900">{event.action}</p>
                    <p className="text-xs text-zinc-500 mt-1">{formatDate(event.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InquiryDetailView;
