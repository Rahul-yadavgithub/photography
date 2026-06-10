import React, { useState } from 'react';
import { Plus, TrendingUp, Eye, MousePointerClick, Tag } from 'lucide-react';
import OfferCard from './OfferCard';
import OfferCreationModal from './OfferCreationModal';

const MOCK_OFFERS = [
  {
    id: 1,
    type: 'percentage',
    badgeText: '20% OFF',
    title: 'Early Bird Special',
    description: 'Book 6 months in advance for a discount.',
    endDate: '31 Dec 2027',
    status: 'Active',
    packagesAttached: 2,
    views: 1250,
    conversions: 45
  },
  {
    id: 2,
    type: 'product',
    badgeText: 'Free Album',
    title: 'Premium Album Included',
    description: 'Complimentary physical album with Gold package.',
    endDate: 'Never',
    status: 'Paused',
    packagesAttached: 1,
    views: 840,
    conversions: 12
  }
];

const OffersDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offers, setOffers] = useState(MOCK_OFFERS);

  const handleEdit = (offer) => {
    console.log('Edit offer', offer);
  };

  const handleToggleStatus = (id) => {
    setOffers(offers.map(o => o.id === id ? { ...o, status: o.status === 'Active' ? 'Paused' : 'Active' } : o));
  };

  const handleDelete = (id) => {
    setOffers(offers.filter(o => o.id !== id));
  };

  const handleSaveOffer = (newOfferData) => {
    // Mock save
    const newOffer = {
      id: Date.now(),
      type: newOfferData.type,
      badgeText: newOfferData.badgeText || 'NEW OFFER',
      title: newOfferData.title,
      description: newOfferData.description || 'Custom offer.',
      endDate: newOfferData.endDate || 'No end date',
      status: 'Active',
      packagesAttached: 0,
      views: 0,
      conversions: 0
    };
    setOffers([newOffer, ...offers]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-zinc-100 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Offers Dashboard</h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Manage and track your promotional campaigns.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Offer
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Offers', value: offers.filter(o => o.status === 'Active').length, icon: Tag, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Total Views', value: '2.1k', icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Total Clicks', value: '482', icon: MousePointerClick, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Avg Conversion', value: '4.8%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-sm font-semibold text-zinc-500">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {offers.map(offer => (
          <OfferCard 
            key={offer.id} 
            offer={offer} 
            onEdit={handleEdit} 
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <OfferCreationModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveOffer} 
        />
      )}
    </div>
  );
};

export default OffersDashboard;
