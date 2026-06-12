import React, { useState, useEffect } from 'react';
import { Plus, Tag, AlertTriangle } from 'lucide-react';
import OfferCard from './OfferCard';
import OfferCreationModal from './OfferCreationModal';
import { getOffers, createOffer, updateOffer, deleteOffer, toggleOfferStatus } from '../../api/offers';

const OffersDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const data = await getOffers();
      setOffers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer) => {
    console.log('Edit offer', offer);
    // Future enhancement: Open modal with offer data
  };

  const handleToggleStatus = async (id) => {
    try {
      const updated = await toggleOfferStatus(id);
      setOffers(offers.map(o => o._id === id ? updated : o));
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteOffer(deleteConfirmId);
      setOffers(offers.filter(o => o._id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveOffer = async (newOfferData) => {
    try {
      const created = await createOffer(newOfferData);
      setOffers([created, ...offers]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save offer');
    }
  };

  const activeCount = offers.filter(o => o.status === 'Active').length;

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

      {/* Analytics Overview - Cleaned up per request */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-50">
            <Tag className="w-6 h-6 text-[#ea580c]" />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Active Offers</div>
            <div className="text-3xl font-black text-zinc-900 leading-none">{activeCount}</div>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center flex flex-col items-center">
          <Tag className="w-12 h-12 text-zinc-300 mb-4" />
          <h3 className="text-lg font-bold text-zinc-900 mb-1">No Offers Found</h3>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">You haven't created any promotional offers yet. Create your first offer to boost bookings.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all"
          >
            Create First Offer
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {offers.map(offer => (
            <OfferCard 
              key={offer._id} 
              offer={offer} 
              onEdit={handleEdit} 
              onToggleStatus={handleToggleStatus}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <OfferCreationModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveOffer} 
        />
      )}

      {/* Premium Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setDeleteConfirmId(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            
            {/* Warning Icon Container */}
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5 border border-red-100">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Delete this Offer?</h3>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              Are you completely sure you want to permanently delete this offer? This action cannot be undone and will immediately remove it from all connected packages.
            </p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-3.5 bg-zinc-100 text-zinc-700 font-bold text-sm rounded-xl hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-3.5 bg-red-500 text-white font-bold text-sm rounded-xl hover:bg-red-600 shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersDashboard;
