import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, CheckCircle2 } from 'lucide-react';
import FeatureModal, { FEATURE_ICONS } from './FeatureModal';

const FeaturesManager = ({ features, setFeatures }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);

  const openAddModal = () => {
    setEditingFeature(null);
    setIsModalOpen(true);
  };

  const openEditModal = (feature) => {
    setEditingFeature(feature);
    setIsModalOpen(true);
  };

  const handleSave = (featureData) => {
    if (editingFeature) {
      setFeatures(features.map(f => f.id === editingFeature.id ? { ...f, ...featureData } : f));
    } else {
      setFeatures([...features, { ...featureData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const moveFeature = (index, direction) => {
    const newFeatures = [...features];
    if (direction === 'up' && index > 0) {
      [newFeatures[index - 1], newFeatures[index]] = [newFeatures[index], newFeatures[index - 1]];
    } else if (direction === 'down' && index < newFeatures.length - 1) {
      [newFeatures[index + 1], newFeatures[index]] = [newFeatures[index], newFeatures[index + 1]];
    }
    setFeatures(newFeatures);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-zinc-100">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Included Features</h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Manage the services included in this package.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="shrink-0 px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>

      <div className="space-y-3">
        {features.length === 0 ? (
          <div className="py-12 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl">
            <p className="text-zinc-500 font-medium">No features added yet. Click "Add Feature" to get started.</p>
          </div>
        ) : (
          features.map((feature, index) => {
            const IconComponent = FEATURE_ICONS[feature.iconKey]?.icon || CheckCircle2;
            return (
              <div key={feature.id} className={`group flex items-center gap-4 p-4 bg-white border ${feature.status === 'Active' ? 'border-zinc-200' : 'border-zinc-200 opacity-60'} rounded-2xl hover:border-zinc-300 transition-all shadow-sm hover:shadow-md`}>
                
                {/* Reorder Controls */}
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveFeature(index, 'up')} disabled={index === 0} className="p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-400 rounded transition-colors"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => moveFeature(index, 'down')} disabled={index === features.length - 1} className="p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-400 rounded transition-colors"><ArrowDown className="w-4 h-4" /></button>
                </div>

                {/* Icon */}
                <div className="shrink-0 w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-700">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-zinc-900 truncate">{feature.title}</h4>
                    {feature.status === 'Inactive' && <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-500 rounded-md">Hidden</span>}
                  </div>
                  <p className="text-sm text-zinc-500 truncate">{feature.description}</p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(feature)} className="px-3 py-1.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg shadow-sm transition-all">Edit</button>
                  <button onClick={() => handleDelete(feature.id)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <FeatureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        editingFeature={editingFeature}
      />
    </div>
  );
};

export default FeaturesManager;
