import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PLANS = [
  {
    id: 'Option A',
    percentage: 40,
    title: 'Premium Plan',
    benefits: [
      'Priority Booking',
      'Free Cinematic Reel',
      'Premium Editing',
      'Faster Delivery'
    ]
  },
  {
    id: 'Option B',
    percentage: 20,
    title: 'Standard Plan',
    benefits: [
      'Standard Editing',
      'Regular Delivery',
      'Basic Support'
    ]
  },
  {
    id: 'Option C',
    percentage: 0,
    title: 'Basic Plan',
    benefits: [
      'Basic Booking',
      'No Complimentary Features'
    ]
  }
];

const Step4AdvancePlan = ({ data, updateData, onNext }) => {
  const handleSelect = (plan) => {
    updateData({ 
      advancePlan: plan.id, 
      advancePercentage: plan.percentage,
      selectedBenefits: plan.benefits 
    });
    setTimeout(onNext, 400); // Visual feedback delay
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full pt-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-sans font-light tracking-tight text-gray-900 mb-2">Advance Booking Plan</h2>
        <p className="text-gray-500 text-sm">Select a payment plan to secure your date.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 overflow-y-auto pb-8 px-1">
        {PLANS.map((plan, idx) => {
          const isSelected = data.advancePlan === plan.id;
          return (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSelect(plan)}
              className={`
                relative flex flex-col text-left p-6 sm:p-8 rounded-3xl border transition-all duration-300
                ${isSelected 
                  ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-[1.02]' 
                  : 'bg-white border-gray-100 text-gray-800 hover:border-gray-300 hover:shadow-lg'
                }
              `}
            >
              {plan.percentage === 40 && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full ${isSelected ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
                  Recommended
                </div>
              )}
              
              <div className="mb-6">
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                  {plan.title}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-light tracking-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {plan.percentage}%
                  </span>
                  <span className={`text-sm font-medium ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                    Advance
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {plan.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-0.5 ${isSelected ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <Check className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-gray-900'}`} />
                    </div>
                    <span className={`text-sm leading-tight ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default Step4AdvancePlan;
