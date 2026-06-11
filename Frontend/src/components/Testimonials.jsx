import React, { useRef, useState, useEffect } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';

// Removed static REVIEWS array

function Testimonials() {
  const reviewsRef = useRef(null);
  const [isReviewsPaused, setIsReviewsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', location: '', description: '' });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/reviews');
        const data = await response.json();
        if (data.success) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    let animationId;
    const scroll = () => {
      if (reviewsRef.current && !isReviewsPaused) {
        reviewsRef.current.scrollLeft += 1;
        if (reviewsRef.current.scrollLeft >= reviewsRef.current.scrollWidth / 2) {
          reviewsRef.current.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isReviewsPaused]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.name,
          location: formData.location,
          rating,
          review: formData.description
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSubmitted(false);
          setFormData({ name: '', location: '', description: '' });
          setRating(0);
          setHoverRating(0);
        }, 3500);
      } else {
        alert(data.message || 'Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <section className="bg-gradient-to-b from-white to-[#f8fafc] py-28 border-t border-gray-100 relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <p className="text-[#ea580c] font-sans text-xs font-semibold tracking-widest uppercase mb-4">Testimonials</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-gray-900">What Our Couples Say</h2>
          </div>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block border border-[#ea580c] text-[#ea580c] hover:bg-[#ea580c] hover:text-white transition-colors px-6 py-3 uppercase tracking-widest text-xs font-medium rounded-sm"
            >
              Write a Review
            </button>
          </div>
        </div>

        <div className="relative mt-8 w-full overflow-hidden flex items-stretch py-4 hide-scrollbar">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none"></div>

          {reviews.length > 0 ? (
            <div
              className="flex w-full overflow-x-auto gap-6 md:gap-8 px-4 py-4 cursor-grab active:cursor-grabbing hide-scrollbar"
              ref={reviewsRef}
              onMouseEnter={() => setIsReviewsPaused(true)}
              onMouseLeave={() => setIsReviewsPaused(false)}
              onTouchStart={() => setIsReviewsPaused(true)}
              onTouchEnd={() => setIsReviewsPaused(false)}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[...reviews, ...reviews].map((review, index) => (
                <div key={`review-${index}`} className="bg-white p-8 lg:p-10 border border-gray-50 rounded-[20px] shadow-[0_4px_30px_-4px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-transform duration-300 flex-shrink-0 w-80 md:w-[420px] flex flex-col justify-between h-full">
                  <div>
                    <div className="flex gap-1.5 text-[#f59e0b] mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} className={`w-4 h-4 ${i < review.rating ? 'text-[#f59e0b]' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-gray-700 text-[17px] leading-relaxed italic mb-10 font-serif">"{review.review}"</p>
                  </div>
                  <div>
                    <p className="font-serif text-gray-900 text-[17px] font-semibold mb-1">{review.customerName}</p>
                    {review.location && <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">{review.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : !loading && (
            <div className="w-full text-center py-12">
              <p className="text-gray-500 font-serif text-lg italic">No approved reviews found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Faded Background */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => !isSubmitted && setIsModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transform transition-all">

            {!isSubmitted ? (
              <div className="p-8 sm:p-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-serif text-3xl text-gray-900 font-light tracking-tight">Share Your Experience</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Your Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] transition-all outline-none text-gray-800 placeholder-gray-400"
                        placeholder="John & Jane"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Location</label>
                      <input
                        required
                        type="text"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] transition-all outline-none text-gray-800 placeholder-gray-400"
                        placeholder="Udaipur, RJ"
                      />
                    </div>
                  </div>

                  {/* Premium Star Rating */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Overall Rating</label>
                    <div className="flex gap-2 items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="relative focus:outline-none transition-transform hover:scale-110 active:scale-95 p-1 group"
                        >
                          <FaStar
                            className={`w-9 h-9 transition-all duration-300 ${(hoverRating || rating) >= star
                                ? 'text-[#f59e0b] drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-110'
                                : 'text-gray-200 hover:text-gray-300'
                              }`}
                          />
                        </button>
                      ))}
                      <span className="ml-4 text-sm font-medium text-gray-400">
                        {rating === 0 ? "Select stars" : `${rating} out of 5`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Your Story</label>
                    <textarea
                      required
                      rows="4"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] transition-all outline-none resize-none text-gray-800 placeholder-gray-400"
                      placeholder="Tell us about your magical moments..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:shadow-[0_8px_25px_-5px_rgba(234,88,12,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            ) : (
              /* Success / Thank You State */
              <div className="p-16 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-gradient-to-tr from-[#ea580c] to-[#f59e0b] rounded-full flex items-center justify-center mb-8 shadow-[0_10px_40px_-10px_rgba(234,88,12,0.8)] transform transition-transform hover:scale-110">
                  <span className="text-5xl animate-bounce" style={{ animationDuration: '2s' }}>🙏</span>
                </div>
                <h3 className="font-serif text-4xl text-gray-900 mb-4 font-light">Thank You!</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-8 max-w-sm">
                  We are deeply grateful for your kind words. Your story helps us continue creating magical memories!
                </p>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ea580c] animate-[progress_3.5s_ease-in-out]"></div>
                </div>
                <style jsx>{`
                  @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Testimonials;
