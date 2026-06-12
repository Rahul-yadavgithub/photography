import Booking from '../models/booking.model.js';
import Package from '../models/package.model.js';
import Film from '../models/film.model.js';
import Pose from '../models/pose.model.js';
import Review from '../models/review.model.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // Parallel execution for all stats
    const [
      totalInquiries,
      recentInquiries,
      pendingRequests,
      activePackages,
      draftPackages,
      weddingFilms,
      recentFilms,
      shootInspirations,
      recentInspirations,
      reviews,
      upcomingBookings,
      recentBookings,
      inquiryAggregation,
      packageAggregation
    ] = await Promise.all([
      // 1. Total Inquiries
      Booking.countDocuments(),
      // 2. Recent Inquiries (last 7 days)
      Booking.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      // 3. Pending Requests
      Booking.countDocuments({ 
        $or: [
          { status: 'Pending' }, 
          { bookingStatus: 'pending_approval' },
          { bookingStatus: 'draft' }
        ]
      }),
      // 4. Active Packages
      Package.countDocuments({ status: 'published' }),
      // 5. Draft Packages
      Package.countDocuments({ status: 'draft' }),
      // 6. Wedding Films
      Film.countDocuments({ status: 'published' }),
      // 7. Recent Films (last 30 days)
      Film.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(today.getDate() - 30)) } }),
      // 8. Shoot Inspirations
      Pose.countDocuments({ status: 'published' }),
      // 9. Recent Inspirations
      Pose.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      // 10. Reviews
      Review.find({ status: 'approved' }),
      // 11. Upcoming Events
      Booking.find({ eventDate: { $gte: today } })
        .sort({ eventDate: 1 })
        .limit(5)
        .select('customerName enquiryType eventDate bookingStatus'),
      // 12. Recent Activity (latest bookings)
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('customerName packageName createdAt bookingStatus'),
      // 13. Inquiry Overview Aggregation
      Booking.aggregate([
        {
          $group: {
            _id: "$enquiryType",
            count: { $sum: 1 },
            urgent: {
              $sum: {
                $cond: [
                  { 
                    $and: [
                      { $gte: ["$eventDate", today] },
                      { $lte: ["$eventDate", sevenDaysFromNow] }
                    ]
                  }, 1, 0
                ]
              }
            },
            pending: {
              $sum: {
                $cond: [
                  { 
                    $in: ["$status", ["Pending", "draft", "pending_approval"]] 
                  }, 1, 0
                ]
              }
            }
          }
        },
        { $sort: { count: -1 } }
      ]),
      // 14. Top Packages Aggregation
      Booking.aggregate([
        { $match: { packageName: { $exists: true, $ne: null, $ne: "" } } },
        {
          $group: {
            _id: "$packageName",
            inquiries: { $sum: 1 }
          }
        },
        { $sort: { inquiries: -1 } },
        { $limit: 4 }
      ])
    ]);

    // Calculate Average Rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "0.0";

    // Format Upcoming Events
    const formattedUpcomingEvents = upcomingBookings.map(b => {
      const eDate = new Date(b.eventDate);
      const diffTime = Math.abs(eDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        customer: b.customerName,
        service: b.enquiryType,
        date: b.eventDate,
        daysLeft: diffDays,
        urgent: diffDays <= 7
      };
    });

    // Format Recent Activity
    const formattedRecentActivity = recentBookings.map(b => {
      const bDate = new Date(b.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - bDate);
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      let timeStr = '';
      if (diffHours < 24) {
        timeStr = diffHours === 0 ? 'Just now' : `${diffHours} Hours Ago`;
      } else if (diffDays === 1) {
        timeStr = 'Yesterday';
      } else {
        timeStr = `${diffDays} Days Ago`;
      }

      return {
        action: 'New Inquiry Received',
        details: b.packageName || b.customerName,
        time: timeStr,
        color: 'bg-blue-500'
      };
    });

    // Format Inquiry Categories
    const formattedInquiryCategories = inquiryAggregation.map(item => ({
      name: item._id || 'General',
      count: item.count,
      urgent: item.urgent,
      pending: item.pending
    }));

    // Format Top Packages
    const formattedTopPackages = packageAggregation.map((pkg, idx) => ({
      name: pkg._id,
      inquiries: pkg.inquiries,
      trend: idx === 0 ? 'Best Seller' : 'Trending'
    }));

    res.json({
      success: true,
      kpis: {
        totalInquiries,
        recentInquiries,
        activePackages,
        draftPackages,
        weddingFilms,
        recentFilms,
        shootInspirations,
        recentInspirations,
        pendingRequests,
        testimonials: reviews.length,
        avgRating
      },
      inquiryCategories: formattedInquiryCategories,
      upcomingEvents: formattedUpcomingEvents,
      topPackages: formattedTopPackages,
      recentActivity: formattedRecentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
