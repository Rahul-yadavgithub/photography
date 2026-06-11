import React, { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Phone, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const CustomerDashboard = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/');
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/bookings/user/${user.id}`);
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

  if (!isLoaded || !isSignedIn) {
    return <div className="min-h-screen flex items-center justify-center pt-24"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div></div>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return <span className="flex items-center text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full"><CheckCircle className="w-3.5 h-3.5 mr-1" /> {status}</span>;
      case 'Cancelled':
        return <span className="flex items-center text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full"><XCircle className="w-3.5 h-3.5 mr-1" /> {status}</span>;
      default:
        return <span className="flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full"><Clock className="w-3.5 h-3.5 mr-1" /> {status}</span>;
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 m-auto mt-6 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-sans font-medium tracking-tight text-gray-900 mb-1">{user.fullName || 'Welcome'}</h1>
              <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
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
            onClick={() => setActiveTab('profile')}
            className={`pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative ${activeTab === 'profile' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Profile Details
            {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <div className="py-20 text-center text-gray-400"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-6">When you book a session or package, it will appear here.</p>
                <button onClick={() => navigate('/packages')} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-full text-sm hover:bg-gray-800 transition-colors">
                  Explore Packages
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ref: {booking.bookingReference}</span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.enquiryType}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> 
                        {format(new Date(booking.eventDate), 'EEEE, MMMM do, yyyy')}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 md:text-right min-w-[200px]">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Payment Plan</p>
                      <p className="text-gray-900 font-bold mb-0.5">{booking.advancePlan}</p>
                      <p className="text-gray-500 text-xs">{booking.advancePercentage}% Advance required</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center mb-2">
                  <User className="w-4 h-4 mr-2" /> Full Name
                </label>
                <p className="text-gray-900 font-medium text-lg">{user.fullName || 'Not provided'}</p>
              </div>
              <div className="h-px bg-gray-100 w-full"></div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center mb-2">
                  <Mail className="w-4 h-4 mr-2" /> Email Address
                </label>
                <p className="text-gray-900 font-medium text-lg">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
              <div className="h-px bg-gray-100 w-full"></div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center mb-2">
                  <Phone className="w-4 h-4 mr-2" /> Phone Number
                </label>
                <p className="text-gray-900 font-medium text-lg">{user.primaryPhoneNumber?.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-xs text-gray-400">To update your profile information, please contact support or manage via your provider.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerDashboard;
