import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Phone, Mail, Calendar, MessageSquare, Package, CheckCircle2, XCircle, Clock, Check, MoreHorizontal, PhoneCall, Copy } from 'lucide-react';
import { getUrgency, getStatusColor, getDaysRemaining } from './utils';

const InquiryDetailView = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  
  const [inquiry, setInquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/bookings/${inquiryId}`);
        const result = await response.json();
        if (result.success) {
          // ensure timeline exists
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
    fetchBooking();
  }, [inquiryId]);

  const handleStatusChange = async (newStatus) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/bookings/${inquiry._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await response.json();
      
      if (result.success) {
        const newTimelineEvent = {
          id: Date.now(),
          action: `Status changed to ${newStatus}`,
          date: new Date().toISOString(),
          type: 'admin'
        };
        
        setInquiry({
          ...inquiry,
          status: newStatus,
          timeline: [...inquiry.timeline, newTimelineEvent]
        });
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
  const statusColor = getStatusColor(inquiry.status);
  const daysRemaining = getDaysRemaining(inquiry.eventDate);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
  };

  const categoryName = inquiry.enquiryType || 'Other';

  return (
    <div className="animate-in slide-in-from-right-4 duration-500">
      
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
              {inquiry.status}
            </span>
          </div>
          <p className="text-sm text-zinc-500 font-medium mt-1">Submitted on {formatDate(inquiry.createdAt)} via {categoryName}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {inquiry.status === 'Pending' && (
            <button 
              onClick={() => handleStatusChange('Contacted')}
              className="px-5 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm"
            >
              Mark Contacted
            </button>
          )}
          {inquiry.status !== 'Confirmed' && inquiry.status !== 'Completed' && (
            <button 
              onClick={() => handleStatusChange('Confirmed')}
              className="px-5 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm
            </button>
          )}
          {inquiry.status === 'Confirmed' && (
             <button 
               onClick={() => handleStatusChange('Completed')}
               className="px-5 py-2.5 bg-purple-50 text-purple-700 font-bold rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors shadow-sm flex items-center gap-2"
             >
               <Check className="w-4 h-4" /> Mark Completed
             </button>
          )}
          <button className="p-2.5 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors shadow-sm text-zinc-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Customer & Package Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Urgency Banner */}
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

          {/* Package Details Panel */}
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
                  <h3 className="text-xl font-bold text-zinc-900">{inquiry.advancePlan || 'Custom Plan'}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Advance Requires</span>
                  <span className="text-xl font-black text-emerald-600">{inquiry.advancePercentage}%</span>
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

        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-400" /> Activity Timeline
            </h2>

            <div className="space-y-6">
              {inquiry.timeline.map((event, index) => (
                <div key={event.id} className="relative pl-6">
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

            {/* Manual Timeline Entry */}
            <div className="mt-8 pt-6 border-t border-zinc-100">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Add Internal Note</label>
              <textarea 
                rows="3" 
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-zinc-900 text-sm resize-none mb-3" 
                placeholder="Type a note about this inquiry..."
              ></textarea>
              <button className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-bold rounded-xl transition-colors">
                Save Note
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InquiryDetailView;
