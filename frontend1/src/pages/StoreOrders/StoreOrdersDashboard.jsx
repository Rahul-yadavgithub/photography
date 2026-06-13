import { useApi } from '../../hooks/useApi';
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, CheckCircle2, AlertCircle, Camera, CheckSquare, CalendarDays } from 'lucide-react';
import { getDaysRemaining } from './utils';
import Loader from '../../components/shared/Loader';

const StoreOrdersDashboard = () => {
  const { fetchWithAuth } = useApi();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const fetchResult = await fetchWithAuth('/api/bookings');
        const response = { ok: true, json: async () => fetchResult };
        const result = await response.json();
        if (result.success) {
          const productOrders = result.data.filter(b => b.inquiryType === 'product');
          setInquiries(productOrders);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Calculate top-level stats
  const stats = useMemo(() => {
    const total = inquiries.length;
    const pending = inquiries.filter(i => i.status === 'Pending').length;
    const approved = inquiries.filter(i => i.status === 'Confirmed' || i.status === 'Approved').length;
    const completed = inquiries.filter(i => i.status === 'Completed').length;
    const urgent = inquiries.filter(i => getDaysRemaining(i.eventDate) <= 3 && getDaysRemaining(i.eventDate) >= 0 && i.status !== 'Completed' && i.status !== 'Cancelled').length;

    return { total, pending, approved, completed, urgent };
  }, [inquiries]);

  // Group inquiries by Category (Dynamic Categorization)
  const products = useMemo(() => {
    const grouped = {};
    
    inquiries.forEach(inq => {
      // In the backend, the category is called enquiryType.
      // But let's map it or just use productData.productName or category name.
      const categoryName = inq.productData?.productName || inq.enquiryType || inq.category || 'Other';
      if (!grouped[categoryName]) {
        grouped[categoryName] = {
          name: categoryName,
          total: 0,
          pending: 0,
          urgent: 0,
          lastInquiryDate: new Date(0) // Initialize with earliest possible date
        };
      }
      
      grouped[categoryName].total += 1;
      
      if (inq.status === 'Pending') grouped[categoryName].pending += 1;
      
      const daysRemaining = getDaysRemaining(inq.eventDate);
      if (daysRemaining <= 3 && daysRemaining >= 0 && inq.status !== 'Completed' && inq.status !== 'Cancelled') {
        grouped[categoryName].urgent += 1;
      }

      const inqDate = new Date(inq.createdAt || inq.inquiryDate || new Date());
      if (inqDate > grouped[categoryName].lastInquiryDate) {
        grouped[categoryName].lastInquiryDate = inqDate;
      }
    });

    // Convert to array and filter out empty categories implicitly done by the grouping logic
    return Object.values(grouped).sort((a, b) => b.total - a.total);
  }, [inquiries]);

  // Format Date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  if (isLoading) {
    return <Loader fullScreen={true} text="Loading store orders..." />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Store Orders</h1>
        <p className="text-sm text-zinc-500 font-medium mt-1">Manage all your customer orders across all store products.</p>
      </div>

      {/* Dashboard Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Total Inquiries</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-black text-zinc-900">{stats.total}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Pending</span>
            <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg"><Clock className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-black text-zinc-900">{stats.pending}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Approved</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-black text-zinc-900">{stats.approved}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Completed</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><CheckSquare className="w-5 h-5" /></div>
          </div>
          <span className="text-3xl font-black text-zinc-900">{stats.completed}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-red-50/50"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-red-700 uppercase tracking-wider">Urgent</span>
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
          </div>
          <span className="relative z-10 text-3xl font-black text-red-700">{stats.urgent}</span>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-end">
        <div>
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Products Overview</h2>
            <p className="text-sm text-zinc-500">Summary of orders grouped by product</p>
        </div>
      </div>

      {/* Dynamic Product Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((cat, index) => (
          <div 
            key={index}
            onClick={() => navigate(`/store-orders/category/${encodeURIComponent(cat.name)}`)}
            className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300 cursor-pointer group hover:-translate-y-1 flex flex-col h-full relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10 flex items-start justify-between mb-6">
              <div className="p-3 bg-zinc-900 text-white rounded-xl shadow-md">
                <Camera className="w-6 h-6" />
              </div>
              <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                {cat.total} Requests
              </span>
            </div>

            <div className="relative z-10 flex-grow">
              <h3 className="text-xl font-bold text-zinc-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">{cat.name}</h3>
              <p className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-2">
                <CalendarDays className="w-3.5 h-3.5" />
                Last inquiry: {formatDate(cat.lastInquiryDate)}
              </p>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-zinc-100 flex flex-col gap-3">
              <div className="flex gap-3">
                {cat.pending > 0 && (
                  <div className="flex-1 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-2 rounded-lg text-center border border-amber-100">
                    {cat.pending} Pending
                  </div>
                )}
                {cat.urgent > 0 && (
                  <div className="flex-1 bg-red-50 text-red-700 text-xs font-bold px-3 py-2 rounded-lg text-center border border-red-200 animate-pulse">
                    {cat.urgent} Urgent
                  </div>
                )}
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/store-orders/category/${encodeURIComponent(cat.name)}`);
                }}
                className="w-full mt-4 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold text-sm rounded-lg transition-colors"
              >
                View Orders
              </button>
            </div>
          </div>
        ))}
        
        {products.length === 0 && (
           <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 bg-zinc-50 rounded-3xl border border-dashed border-zinc-300">
             <CalendarDays className="w-12 h-12 mb-4 text-zinc-300" />
             <h3 className="text-lg font-bold text-zinc-900">No Inquiries Yet</h3>
             <p className="text-sm text-center max-w-sm mt-2">When customers submit forms from your website, they will automatically appear here grouped by category.</p>
           </div>
        )}
      </div>

    </div>
  );
};

export default StoreOrdersDashboard;
