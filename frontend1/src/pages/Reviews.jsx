import { useState, useEffect } from 'react';
import { useReviewsApi } from '../api/reviews';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle2, XCircle, Clock, User, Star, Trash2, Sparkles } from 'lucide-react';

const Reviews = () => {
  const { getReviews, approveReview, rejectReview, deleteReview } = useReviewsApi();
  const { showSuccess, showError } = useNotification();

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews();
      setReviews(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveReview(id);
      showSuccess("Review approved successfully");
      fetchReviews();
    } catch (error) {
      showError("Failed to approve review");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectReview(id);
      showSuccess("Review rejected successfully");
      fetchReviews();
    } catch (error) {
      showError("Failed to reject review");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this rejected review?")) return;
    try {
      await deleteReview(id);
      showSuccess("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      showError("Failed to delete review");
    }
  };

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      {/* Header and Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#ea580c]" />
            Testimonials
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Manage client reviews and testimonials.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">Reviews Moderation</h2>
          <div className="flex bg-zinc-100 p-1 rounded-lg border border-zinc-200 w-fit">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${filter === f ? 'bg-white shadow-sm text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div>
            Loading reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 px-4 text-center border-dashed border-2 bg-zinc-50/50">
            <h3 className="text-base font-semibold text-zinc-900 mb-1">No reviews found</h3>
            <p className="text-sm text-zinc-500 max-w-sm">There are no reviews matching the "{filter}" filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReviews.map((review) => (
              <div key={review._id} className="card p-5 flex flex-col h-full bg-white border border-zinc-200 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">{review.customerName}</h4>
                      <p className="text-xs text-zinc-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {review.status === 'pending' && <span className="badge badge-warning bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-xs flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>}
                  {review.status === 'approved' && <span className="badge badge-success bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Approved</span>}
                  {review.status === 'rejected' && <span className="badge badge-danger bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-xs flex items-center gap-1"><XCircle className="w-3 h-3"/> Rejected</span>}
                </div>
                
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'}`} />
                  ))}
                </div>
                
                <p className="text-sm text-zinc-700 italic flex-1 mb-6 line-clamp-4">"{review.review}"</p>
                
                {review.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-zinc-100">
                    <button onClick={() => handleReject(review._id)} className="px-4 py-2 border border-zinc-200 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors">
                      Reject
                    </button>
                    <button onClick={() => handleApprove(review._id)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors">
                      Approve
                    </button>
                  </div>
                )}

                {review.status === 'rejected' && (
                  <div className="flex mt-auto pt-4 border-t border-zinc-100">
                    <button onClick={() => handleDelete(review._id)} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-rose-200 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Delete Permanently
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
