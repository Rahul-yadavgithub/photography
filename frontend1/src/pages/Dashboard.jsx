import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Package, 
  Video, 
  Image as ImageIcon, 
  Clock, 
  Star, 
  ArrowRight,
  Plus,
  AlertCircle,
  TrendingUp,
  Camera,
  Film,
  CalendarDays,
  LayoutTemplate
} from 'lucide-react';

// --- MOCK DATA ---
const KPI_DATA = [
  { title: 'Total Inquiries', value: '142', trend: '+12 This Week', status: 'up', icon: Users, color: 'blue' },
  { title: 'Active Packages', value: '18', trend: '2 Drafts', status: 'neutral', icon: Package, color: 'emerald' },
  { title: 'Wedding Films', value: '34', trend: '+3 This Month', status: 'up', icon: Video, color: 'purple' },
  { title: 'Shoot Inspirations', value: '256', trend: '+45 This Week', status: 'up', icon: ImageIcon, color: 'amber' },
  { title: 'Pending Requests', value: '12', trend: 'Requires Action', status: 'warning', icon: Clock, color: 'red' },
  { title: 'Testimonials', value: '48', trend: '4.9 Avg Rating', status: 'up', icon: Star, color: 'zinc' },
];

const INQUIRY_CATEGORIES = [
  { name: 'Wedding Photography', count: 45, pending: 5, urgent: 2 },
  { name: 'Pre-Wedding Shoot', count: 32, pending: 3, urgent: 1 },
  { name: 'Wedding Films', count: 28, pending: 4, urgent: 0 },
  { name: 'Couple Shoot', count: 15, pending: 0, urgent: 0 },
];

const UPCOMING_EVENTS = [
  { customer: 'Rahul & Priya', service: 'Wedding Photography', date: '2027-01-15', daysLeft: 5, urgent: true },
  { customer: 'Aman & Simran', service: 'Pre-Wedding Shoot', date: '2027-01-20', daysLeft: 10, urgent: false },
  { customer: 'Vikram & Aisha', service: 'Wedding Films', date: '2027-02-05', daysLeft: 26, urgent: false },
];

const TOP_PACKAGES = [
  { name: 'Gold Wedding Package', inquiries: 28, trend: 'Best Seller' },
  { name: 'Platinum Wedding Package', inquiries: 15, trend: 'Trending' },
  { name: 'Premium Pre-Wedding', inquiries: 12, trend: 'Stable' },
];

const RECENT_ACTIVITY = [
  { action: 'New Inquiry Received', details: 'Gold Wedding Package', time: '2 Hours Ago', color: 'bg-blue-500' },
  { action: 'Wedding Film Published', details: 'Royal Jaipur Wedding', time: 'Yesterday', color: 'bg-emerald-500' },
  { action: 'Package Updated', details: 'Platinum Wedding Package', time: 'Today', color: 'bg-purple-500' },
];

const QUICK_ACTIONS = [
  { name: 'Create Package', icon: Package, path: '/packages' },
  { name: 'Upload Film', icon: Video, path: '/films' },
  { name: 'Pose Collection', icon: Camera, path: '/shoot' },
  { name: 'View Inquiries', icon: Users, path: '/bookings' },
  { name: 'Edit Website', icon: LayoutTemplate, path: '/content' },
];

// --- COMPONENTS ---

const KPICard = ({ data }) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    zinc: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  };

  const trendStyles = {
    up: 'text-emerald-600 bg-emerald-50',
    warning: 'text-red-600 bg-red-50',
    neutral: 'text-zinc-500 bg-zinc-100'
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-zinc-500">{data.title}</span>
        <div className={`p-2 rounded-xl border ${colorStyles[data.color]}`}>
          <data.icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <span className="text-3xl font-black text-zinc-900 tracking-tight">{data.value}</span>
        <div className="mt-2 flex items-center gap-1.5">
          {data.status === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${trendStyles[data.status]}`}>
            {data.trend}
          </span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Calculate profile completion
  const profileComplete = [user?.firstName, user?.lastName, user?.imageUrl].filter(Boolean).length;
  const completionPercent = Math.round((profileComplete / 3) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Welcome back, {user?.firstName || 'Studio Owner'}</h1>
        <p className="text-sm text-zinc-500 font-medium mt-1">Here is the current status of your photography business.</p>
      </div>

      {/* Row 1: Profile & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Completion */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-bold text-zinc-900">Studio Profile Completion</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{completionPercent}%</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out relative" 
                style={{ width: `${completionPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-xs text-zinc-500 font-medium mt-3">Missing: WhatsApp Number, Business Hours, Service Areas.</p>
          </div>
          <Link to="/settings" className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm whitespace-nowrap text-sm">
            Complete Profile
          </Link>
        </div>

        {/* Alerts */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 text-red-100">
            <AlertCircle className="w-24 h-24 opacity-50" />
          </div>
          <div className="relative z-10">
            <h3 className="text-red-800 font-black flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5" /> Action Required
            </h3>
            <ul className="text-sm text-red-700 font-medium space-y-1">
              <li>• 3 Urgent Inquiries pending</li>
              <li>• 4 Bookings awaiting approval</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Row 2: 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {KPI_DATA.map((kpi, idx) => (
          <KPICard key={idx} data={kpi} />
        ))}
      </div>

      {/* Row 3: Inquiry Breakdown & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Inquiry Overview */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900">Inquiry Overview</h3>
            <Link to="/bookings" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-6">
            {INQUIRY_CATEGORIES.map((cat, idx) => {
              const total = INQUIRY_CATEGORIES.reduce((acc, curr) => acc + curr.count, 0);
              const percent = Math.round((cat.count / total) * 100);
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-zinc-700">{cat.name}</span>
                    <div className="flex items-center gap-3">
                      {cat.urgent > 0 && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md">{cat.urgent} Urgent</span>}
                      {cat.pending > 0 && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">{cat.pending} Pending</span>}
                      <span className="text-sm font-black text-zinc-900">{cat.count}</span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden flex">
                    <div className="bg-zinc-900 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-zinc-400" /> Upcoming Events
          </h3>
          <div className="space-y-4">
            {UPCOMING_EVENTS.map((event, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${event.urgent ? 'bg-red-50 border-red-200' : 'bg-zinc-50 border-zinc-100'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className={`font-bold text-sm ${event.urgent ? 'text-red-900' : 'text-zinc-900'}`}>{event.customer}</h4>
                    <p className={`text-xs font-medium ${event.urgent ? 'text-red-700' : 'text-zinc-500'}`}>{event.service}</p>
                  </div>
                  <span className={`text-xl font-black ${event.urgent ? 'text-red-700' : 'text-zinc-900'}`}>
                    {event.daysLeft} <span className="text-[10px] uppercase tracking-wider block font-bold text-right opacity-70">Days Left</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 4: Content Analytics (Packages, Films, Inspiration) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Packages */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">Top Packages</h3>
          <div className="space-y-4">
            {TOP_PACKAGES.map((pkg, idx) => (
              <div key={idx} className="flex flex-col gap-1 pb-4 border-b border-zinc-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900">{pkg.name}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{pkg.trend}</span>
                </div>
                <span className="text-xs font-medium text-zinc-500">{pkg.inquiries} Inquiries</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wedding Films */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">Wedding Films</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-xl bg-zinc-100 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=200" alt="Film" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Film className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Most Viewed</span>
                <h4 className="font-bold text-sm text-zinc-900 mt-1 line-clamp-1">Royal Jaipur Wedding</h4>
                <span className="text-xs font-bold text-blue-600">4,200 Views</span>
              </div>
            </div>
          </div>
          <Link to="/films" className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 text-sm font-bold rounded-xl transition-colors text-center border border-zinc-200">
            Manage Films
          </Link>
        </div>

        {/* Shoot Inspiration */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">Shoot Inspiration</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Total Poses</span>
                <span className="text-xl font-black text-zinc-900">142</span>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Reels</span>
                <span className="text-xl font-black text-zinc-900">48</span>
              </div>
            </div>
          </div>
          <Link to="/shoot" className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 text-sm font-bold rounded-xl transition-colors text-center border border-zinc-200">
            Add Inspiration
          </Link>
        </div>

      </div>

      {/* Row 5: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-400" /> Recent Activity
          </h3>
          <div className="space-y-6 pl-2">
            {RECENT_ACTIVITY.map((activity, idx) => (
              <div key={idx} className="relative pl-6">
                {idx !== RECENT_ACTIVITY.length - 1 && (
                  <div className="absolute left-[3px] top-4 bottom-[-24px] w-0.5 bg-zinc-100"></div>
                )}
                <div className={`absolute left-[-2px] top-1.5 w-3 h-3 rounded-full ${activity.color} ring-4 ring-white`}></div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-medium text-zinc-600">{activity.details}</span>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs font-medium text-zinc-400">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            {QUICK_ACTIONS.map((action, idx) => (
              <button 
                key={idx}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 p-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-colors group text-left"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform text-zinc-700">
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-zinc-900 group-hover:text-blue-600 transition-colors">{action.name}</span>
                <ArrowRight className="w-4 h-4 ml-auto text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
