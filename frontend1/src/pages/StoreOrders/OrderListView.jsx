import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, Phone, Mail, Calendar, Clock, Check, X, PhoneCall, MoreVertical, CreditCard, Package } from 'lucide-react';
import { getUrgency, getStatusColor, getDaysRemaining } from './utils';

const OrderListView = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [allInquiries, setAllInquiries] = useState([]);

  const categoryName = decodeURIComponent(categoryId);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/bookings`);
        const result = await response.json();
        if (result.success) {
          const products = result.data.filter(b => b.inquiryType === 'product');
          setAllInquiries(products);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  const getDisplayStatus = (inq) => {
    return inq.bookingStatus || inq.status || 'Pending';
  };

  const formatStatusDisplay = (status) => {
    if (!status) return 'Pending';
    return status.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
  };

  // Filter inquiries based on category, search, and status
  const inquiries = useMemo(() => {
    return allInquiries.filter(inq => {
      const cat = inq.productData?.productName || inq.enquiryType || inq.category || 'Other';
      if (cat !== categoryName) return false;
      
      const currentStatus = getDisplayStatus(inq).toLowerCase();
      if (statusFilter !== 'All' && currentStatus !== statusFilter.toLowerCase()) return false;
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          inq.customerName.toLowerCase().includes(term) ||
          (inq.email && inq.email.toLowerCase().includes(term)) ||
          inq.mobileNumber.includes(term) ||
          (inq.advancePlan && inq.advancePlan.toLowerCase().includes(term)) ||
          (inq.bookingReference && inq.bookingReference.toLowerCase().includes(term))
        );
      }
      return true;
    }).sort((a, b) => {
      // Sort by urgency (days remaining) ascending
      return getDaysRemaining(a.eventDate) - getDaysRemaining(b.eventDate);
    });
  }, [allInquiries, categoryName, searchTerm, statusFilter]);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateString));
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-500">
      
      {/* Top Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/store-orders')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 font-bold text-sm mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{categoryName} Orders</h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">Manage and track all product orders for this item.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search by name, email, package..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm"
              />
            </div>
            <div className="relative flex-shrink-0">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-sm shadow-sm appearance-none font-bold text-zinc-700 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending_Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Pending">Legacy: Pending</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inquiries.map((inquiry) => {
          const urgency = getUrgency(inquiry.eventDate);
          const currentStatus = getDisplayStatus(inquiry);
          const statusColor = getStatusColor(currentStatus);
          const paymentStatusColor = getStatusColor(inquiry.paymentStatus);
          const daysRemaining = getDaysRemaining(inquiry.eventDate);

          return (
            <div key={inquiry._id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
              
              {/* Header: Package Name and Badges */}
              <div className="flex items-start justify-between mb-4">
                <div className="pr-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 block">
                    {inquiry.inquiryType === 'product' ? 'Product' : 'Selected Plan'}
                  </span>
                  <Link to={`/store-orders/order/${inquiry._id}`} className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {inquiry.inquiryType === 'product' ? inquiry.productData?.productName : (inquiry.packageName || inquiry.advancePlan || 'Custom Plan')}
                  </Link>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${statusColor}`}>
                    {formatStatusDisplay(currentStatus)}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-zinc-50 rounded-xl p-4 mb-4 border border-zinc-100 flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold">
                    {inquiry.customerName?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{inquiry.customerName}</h4>
                    <p className="text-xs text-zinc-500">Ref: {inquiry.bookingReference}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{inquiry.mobileNumber}</span>
                  </div>
                  {inquiry.email && (
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="truncate">{inquiry.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="flex items-center justify-between py-3 border-t border-zinc-100 mb-0">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-zinc-400" />
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Paid</span>
                    <span className="font-bold text-zinc-900">₹{(inquiry.amountPaid || 0).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Payment</span>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${paymentStatusColor} uppercase tracking-widest`}>
                    {formatStatusDisplay(inquiry.paymentStatus || 'not_required')}
                  </div>
                </div>
              </div>

              {/* Conditional Event / Product Details */}
              <div className="flex items-center justify-between py-3 border-t border-b border-zinc-100 mb-4">
                {inquiry.inquiryType === 'product' ? (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-zinc-400" />
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Quantity</span>
                        <span className="font-bold text-zinc-900">{inquiry.productData?.quantity || 1} units</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Order Type</span>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold border bg-blue-50 text-blue-700 border-blue-200">
                        Product
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Event Date</span>
                        <span className="font-bold text-zinc-900">{formatDate(inquiry.eventDate)}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Urgency</span>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold border ${urgency.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`}></span>
                        {daysRemaining < 0 ? 'Passed' : `${daysRemaining} Days Left`}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-auto">
                <button 
                  onClick={() => navigate(`/store-orders/order/${inquiry._id}`)}
                  className="flex-1 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  View Details
                </button>
                <a href={`tel:${inquiry.mobileNumber}`} className="p-2.5 bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors shadow-sm">
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>

            </div>
          );
        })}
        
        {inquiries.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 bg-zinc-50 rounded-3xl border border-dashed border-zinc-300">
            <Search className="w-12 h-12 mb-4 text-zinc-300" />
            <h3 className="text-lg font-bold text-zinc-900">No Inquiries Found</h3>
            <p className="text-sm text-center max-w-sm mt-2">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default OrderListView;
