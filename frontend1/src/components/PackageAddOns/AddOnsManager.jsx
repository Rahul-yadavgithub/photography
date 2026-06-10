import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, PackagePlus } from 'lucide-react';
import AddOnModal, { ADDON_ICONS } from './AddOnModal';

const AddOnsManager = ({ addOns, setAddOns }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState(null);

  const openAddModal = () => {
    setEditingAddOn(null);
    setIsModalOpen(true);
  };

  const openEditModal = (addOn) => {
    setEditingAddOn(addOn);
    setIsModalOpen(true);
  };

  const handleSave = (addOnData) => {
    if (editingAddOn) {
      setAddOns(addOns.map(a => a.id === editingAddOn.id ? { ...a, ...addOnData } : a));
    } else {
      setAddOns([...addOns, { ...addOnData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setAddOns(addOns.filter(a => a.id !== id));
  };

  const moveAddOn = (index, direction) => {
    const newAddOns = [...addOns];
    if (direction === 'up' && index > 0) {
      [newAddOns[index - 1], newAddOns[index]] = [newAddOns[index], newAddOns[index - 1]];
    } else if (direction === 'down' && index < newAddOns.length - 1) {
      [newAddOns[index + 1], newAddOns[index]] = [newAddOns[index], newAddOns[index + 1]];
    }
    setAddOns(newAddOns);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-zinc-100">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Optional Add-Ons</h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Manage paid upgrades customers can select.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="shrink-0 px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Add-On
        </button>
      </div>

      <div className="space-y-3">
        {addOns.length === 0 ? (
          <div className="py-12 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl">
            <p className="text-zinc-500 font-medium">No add-ons created yet. Click "Add Add-On" to get started.</p>
          </div>
        ) : (
          addOns.map((addOn, index) => {
            const IconComponent = ADDON_ICONS[addOn.iconKey]?.icon || PackagePlus;
            return (
              <div key={addOn.id} className={`group flex items-center gap-4 p-4 bg-white border ${addOn.status === 'Active' ? 'border-zinc-200' : 'border-zinc-200 opacity-60'} rounded-2xl hover:border-zinc-300 transition-all shadow-sm hover:shadow-md`}>
                
                {/* Reorder Controls */}
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveAddOn(index, 'up')} disabled={index === 0} className="p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-400 rounded transition-colors"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => moveAddOn(index, 'down')} disabled={index === addOns.length - 1} className="p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-400 rounded transition-colors"><ArrowDown className="w-4 h-4" /></button>
                </div>

                {/* Icon */}
                <div className="shrink-0 w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-zinc-900 truncate">{addOn.name}</h4>
                    {addOn.status === 'Inactive' && <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-500 rounded-md">Inactive</span>}
                  </div>
                  <p className="text-sm text-zinc-500 truncate">{addOn.description}</p>
                </div>

                {/* Price & Actions */}
                <div className="shrink-0 flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-sm font-bold text-emerald-600 block">₹{addOn.price}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(addOn)} className="px-3 py-1.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg shadow-sm transition-all">Edit</button>
                    <button onClick={() => handleDelete(addOn.id)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddOnModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        editingAddOn={editingAddOn}
      />
    </div>
  );
};

export default AddOnsManager;
