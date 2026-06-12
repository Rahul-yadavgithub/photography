import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Tag, IndianRupee, Loader2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoreInquiryModal = ({ isOpen, onClose, product }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      
      const payload = {
        inquiryType: 'product',
        userId: user.id,
        customerName: user.fullName || 'Store Customer',
        mobileNumber: user.primaryPhoneNumber?.phoneNumber || 'Not Provided',
        enquiryType: product.category?.name || 'Store Product',
        productData: {
          productId: product._id || product.slug,
          productName: product.name,
          productImage: product.coverImage || (product.galleryImages && product.galleryImages[0]),
          productCategory: product.category?.name || 'Uncategorized',
          basePrice: product.basePrice,
          salePrice: product.salePrice,
          quantity: quantity
        },
        specialInstructions,
        notes: additionalNotes,
      };

      const response = await fetch(`${backendUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          navigate('/dashboard'); // redirect to customer dashboard
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to submit inquiry');
      }

    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isSubmitting ? onClose : undefined}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {success ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h2>
              <p className="text-gray-500 mb-6 text-sm max-w-sm mx-auto">
                We have received your product inquiry. We will contact you soon to proceed with your order.
              </p>
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Product Order Inquiry</h2>
                  <p className="text-sm text-gray-500">Submit a request to purchase this item</p>
                </div>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto">
                <form onSubmit={handleSubmit} id="inquiryForm" className="space-y-8">
                  
                  {/* Product Summary Context */}
                  <div className="bg-gray-50 rounded-xl p-4 flex gap-4 border border-gray-100">
                    <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0">
                      <img 
                        src={product.coverImage || (product.galleryImages && product.galleryImages[0])} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#ea580c] uppercase tracking-wider mb-1">
                        <Tag className="w-3 h-3" /> {product.category?.name || 'Product'}
                      </div>
                      <h3 className="text-gray-900 font-bold truncate mb-1">{product.name}</h3>
                      <div className="flex items-center gap-1 text-gray-700 font-medium">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {product.salePrice || product.basePrice}
                      </div>
                    </div>
                  </div>

                  {/* Customer Information (Read Only) */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</label>
                        <span className="text-sm font-medium text-gray-900">{user?.fullName || 'Not provided'}</span>
                      </div>
                      <div className="bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
                        <span className="text-sm font-medium text-gray-900">{user?.primaryEmailAddress?.emailAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Required Input */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Quantity <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="w-full sm:w-32 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Special Instructions</label>
                        <p className="text-xs text-gray-500 mb-2">Any specific requirements for size, color, or materials?</p>
                        <textarea
                          rows={2}
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          placeholder="e.g. I want the cover to be matte finish..."
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Additional Notes</label>
                        <textarea
                          rows={2}
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          placeholder="Any other details we should know..."
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="inquiryForm"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-gray-900 text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#ea580c] transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting
                    </>
                  ) : (
                    'Submit Inquiry'
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StoreInquiryModal;
