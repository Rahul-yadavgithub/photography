export const getDaysRemaining = (eventDate) => {
  if (!eventDate) return 0;
  const today = new Date();
  const event = new Date(eventDate);
  const diffTime = event - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getUrgency = (eventDate) => {
  const days = getDaysRemaining(eventDate);
  if (days < 0) return { label: 'Passed', color: 'bg-zinc-100 text-zinc-600 border-zinc-200', dot: 'bg-zinc-400' };
  if (days <= 3) return { label: 'High', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500 animate-pulse' };
  if (days <= 7) return { label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
  return { label: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
};

export const getStatusColor = (status) => {
  if (!status) return 'bg-zinc-50 text-zinc-700 border-zinc-200';
  switch (status.toLowerCase()) {
    case 'pending_approval':
    case 'pending': 
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'contacted': 
    case 'draft':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'confirmed': 
    case 'approved': 
    case 'paid':
    case 'processed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'completed': 
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'cancelled':
    case 'rejected': 
    case 'failed':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'not_required':
    case 'refunded':
      return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    default: return 'bg-zinc-50 text-zinc-700 border-zinc-200';
  }
};
