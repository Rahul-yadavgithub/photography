// Generating dates for urgency calculation
const today = new Date();
const addDays = (days) => {
  const date = new Date(today);
  date.setDate(today.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const mockInquiries = [
  // Wedding Photography (Urgent)
  {
    id: 'INQ-001',
    customerName: 'Rahul Sharma',
    phone: '+91 9876543210',
    email: 'rahul.sharma@example.com',
    eventDate: addDays(2), // Urgent
    inquiryDate: addDays(-5),
    status: 'Pending',
    category: 'Wedding Photography',
    package: {
      name: 'Gold Wedding Package',
      price: '₹1,50,000',
      addons: ['Drone Coverage', 'Premium Album']
    },
    notes: 'Looking for candid photography mostly. Traditional events are minimal.',
    preferredContact: 'WhatsApp',
    timeline: [
      { id: 1, action: 'Inquiry Submitted', date: addDays(-5), type: 'system' }
    ]
  },
  {
    id: 'INQ-002',
    customerName: 'Priya Patel',
    phone: '+91 8765432109',
    email: 'priya.p@example.com',
    eventDate: addDays(8), // Upcoming
    inquiryDate: addDays(-2),
    status: 'Contacted',
    category: 'Wedding Photography',
    package: {
      name: 'Platinum Wedding Package',
      price: '₹2,50,000',
      addons: ['Pre-Wedding Shoot Included']
    },
    notes: 'Need 2 cinematographers.',
    preferredContact: 'Phone Call',
    timeline: [
      { id: 1, action: 'Inquiry Submitted', date: addDays(-2), type: 'system' },
      { id: 2, action: 'Admin sent package details via Email', date: addDays(-1), type: 'admin' }
    ]
  },
  
  // Pre-Wedding Shoot
  {
    id: 'INQ-003',
    customerName: 'Ankit Gupta',
    phone: '+91 7654321098',
    email: 'ankit.g@example.com',
    eventDate: addDays(15), // Normal
    inquiryDate: addDays(-1),
    status: 'Approved',
    category: 'Pre-Wedding Shoot',
    package: {
      name: 'Destination Pre-Wedding',
      price: '₹80,000',
      addons: ['Outfits provided']
    },
    notes: 'Planning to shoot in Udaipur.',
    preferredContact: 'Email',
    timeline: [
      { id: 1, action: 'Inquiry Submitted', date: addDays(-1), type: 'system' },
      { id: 2, action: 'Booking Confirmed', date: addDays(0), type: 'admin' }
    ]
  },
  {
    id: 'INQ-004',
    customerName: 'Neha Singh',
    phone: '+91 6543210987',
    email: 'neha.s@example.com',
    eventDate: addDays(1), // Urgent
    inquiryDate: addDays(-10),
    status: 'Pending',
    category: 'Pre-Wedding Shoot',
    package: {
      name: 'Local Pre-Wedding',
      price: '₹30,000',
      addons: []
    },
    notes: 'Very urgent, need someone for tomorrow.',
    preferredContact: 'Phone Call',
    timeline: [
      { id: 1, action: 'Inquiry Submitted', date: addDays(-10), type: 'system' }
    ]
  },

  // Wedding Films
  {
    id: 'INQ-005',
    customerName: 'Vikram & Aisha',
    phone: '+91 9988776655',
    email: 'v.a.wedding@example.com',
    eventDate: addDays(45), // Normal
    inquiryDate: addDays(-3),
    status: 'Pending',
    category: 'Wedding Films',
    package: {
      name: 'Cinematic Story Film',
      price: '₹1,00,000',
      addons: ['Same Day Edit', 'Drone Reel']
    },
    notes: 'Loved your reels on Instagram, want similar style.',
    preferredContact: 'WhatsApp',
    timeline: [
      { id: 1, action: 'Inquiry Submitted via Instagram link', date: addDays(-3), type: 'system' }
    ]
  },

  // Couple Shoot
  {
    id: 'INQ-006',
    customerName: 'Rohan Desai',
    phone: '+91 8877665544',
    email: 'rohan.d@example.com',
    eventDate: addDays(5), // Upcoming
    inquiryDate: addDays(-1),
    status: 'Completed',
    category: 'Couple Shoot',
    package: {
      name: 'Studio Couple Portraits',
      price: '₹15,000',
      addons: []
    },
    notes: 'Completed successfully.',
    preferredContact: 'Email',
    timeline: [
      { id: 1, action: 'Inquiry Submitted', date: addDays(-20), type: 'system' },
      { id: 2, action: 'Shoot Completed', date: addDays(-1), type: 'admin' }
    ]
  }
];

// Helper to calculate days remaining
export const getDaysRemaining = (eventDate) => {
  const event = new Date(eventDate);
  const now = new Date(today);
  const diffTime = event - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper to determine urgency
export const getUrgency = (eventDate) => {
  const days = getDaysRemaining(eventDate);
  if (days < 0) return { label: 'Passed', color: 'bg-zinc-100 text-zinc-600', dot: 'bg-zinc-400' };
  if (days <= 3) return { label: 'Urgent', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
  if (days <= 10) return { label: 'Upcoming', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
  return { label: 'Normal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
};

// Helper to get Status Color
export const getStatusColor = (status) => {
  switch(status) {
    case 'Pending': return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    case 'Contacted': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
    case 'Completed': return 'bg-purple-50 text-purple-700 border-purple-200';
    default: return 'bg-zinc-100 text-zinc-800 border-zinc-200';
  }
};
