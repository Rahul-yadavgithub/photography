import React from 'react';
import { ShoppingBag, X, ChevronRight, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useIntent } from '../../context/IntentContext';

export default function CartDrawer() {
  const { items, removeFromCart, isDrawerOpen, setIsDrawerOpen, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { executeProtectedAction } = useIntent();

  const total = getCartTotal();

  return (
    <>
      {/* Floating Cart Button */}
      <button 
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-8 left-8 z-[90] bg-gray-900 text-white p-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-[#ea580c] hover:-translate-y-1 transition-all duration-300 group"
      >
        <ShoppingBag className="w-6 h-6" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#ea580c] group-hover:bg-gray-900 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white transition-colors">
            {items.length}
          </span>
        )}
      </button>

      {/* Cart Overlay */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDrawerOpen(false)}></div>

      {/* Cart Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[110] shadow-2xl flex flex-col transition-transform duration-500 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            <h2 className="text-xl font-serif text-gray-900">Your Cart</h2>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Your cart is empty.</p>
              <button onClick={() => setIsDrawerOpen(false)} className="mt-6 text-[#ea580c] font-bold text-xs uppercase tracking-widest hover:text-gray-900">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex space-x-4 bg-gray-50 p-4 rounded-xl relative group">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">{item.variant}</p>
                  {item.message && <p className="text-xs text-gray-400 italic mb-2">"{item.message}"</p>}
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-900">${item.price}</span>
                    <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded shadow-sm">Qty: {item.qty}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id, item.options)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">${total}</span>
            </div>
            <button 
              onClick={() => {
                setIsDrawerOpen(false);
                executeProtectedAction('NAVIGATE', { path: '/store/checkout' }, '/store/checkout');
              }} 
              className="w-full py-4 bg-gray-900 text-white rounded font-bold text-xs uppercase tracking-widest hover:bg-[#ea580c] transition-colors flex justify-center items-center"
            >
              Proceed to Payment <ChevronRight className="w-4 h-4 ml-2" />
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">Taxes and shipping calculated at checkout</p>
          </div>
        )}

      </div>
    </>
  );
}
