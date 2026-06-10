import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Step1TypeSelection from './OfferWizard/Step1TypeSelection';
import Step2Configuration from './OfferWizard/Step2Configuration';
import Step3DisplaySettings from './OfferWizard/Step3DisplaySettings';
import Step4Preview from './OfferWizard/Step4Preview';

const OfferCreationModal = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    badgeText: '',
    description: '',
    discountPercentage: '',
    flatDiscount: '',
    addonId: '',
    productId: '',
    startDate: '',
    endDate: '',
    displaySettings: {
      packageCard: true,
      packageDetails: true,
      homepageBanner: false,
      comparisonTable: false,
      checkoutSummary: true
    }
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h3 className="text-xl font-bold text-zinc-900">Create New Offer</h3>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1.5 w-12 rounded-full ${s <= step ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-grow">
          {step === 1 && <Step1TypeSelection formData={formData} setFormData={setFormData} onNext={nextStep} />}
          {step === 2 && <Step2Configuration formData={formData} setFormData={setFormData} />}
          {step === 3 && <Step3DisplaySettings formData={formData} setFormData={setFormData} />}
          {step === 4 && <Step4Preview formData={formData} />}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex justify-between items-center">
          <button 
            onClick={prevStep} 
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-zinc-600 hover:bg-zinc-200 bg-zinc-100'}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={nextStep}
              disabled={step === 1 && !formData.type}
              className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md"
            >
              <Check className="w-4 h-4" /> Publish Offer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCreationModal;
