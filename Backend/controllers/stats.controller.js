import Booking from '../models/booking.model.js';

export const getJourneyStats = async (req, res) => {
  try {
    // We treat 'approved', 'Confirmed', 'Completed' as confirmed statuses
    const confirmedStatuses = ['approved', 'Confirmed', 'Completed'];

    // 1. Weddings Covered: Base 100 + Confirmed Service Bookings
    const confirmedWeddingsCount = await Booking.countDocuments({
      inquiryType: 'service',
      $or: [
        { bookingStatus: { $in: confirmedStatuses } },
        { status: { $in: confirmedStatuses } }
      ]
    });
    
    // 2. Happy Clients: Base 1000 + Bookings with Advance Paid or Fully Paid
    const happyClientsCount = await Booking.countDocuments({
      paymentStatus: { $in: ['paid', 'partially_refunded'] }
    });

    // 3. Photos Delivered: Base 5000 + Sum of Album Page Sizes from Store Orders
    const storeOrders = await Booking.find({
      inquiryType: 'product',
      paymentStatus: { $in: ['paid'] }
    });
    
    let additionalPhotos = 0;
    for (const order of storeOrders) {
      if (order.productData && order.productData.items) {
        for (const item of order.productData.items) {
          if (item.options) {
             for (const [key, value] of Object.entries(item.options)) {
                if (key.toLowerCase().includes('page') || key.toLowerCase().includes('size')) {
                   const num = parseInt(value.toString().replace(/\\D/g, ''), 10);
                   if (!isNaN(num)) additionalPhotos += num * item.qty;
                }
             }
          }
        }
      }
    }

    // 4. Wedding Films Produced: Base 50 + count of confirmed bookings with "Film"
    const filmsProducedCount = await Booking.countDocuments({
      inquiryType: 'service',
      $or: [
        { bookingStatus: { $in: confirmedStatuses } },
        { status: { $in: confirmedStatuses } }
      ],
      $or: [
        { enquiryType: { $regex: /film/i } },
        { packageName: { $regex: /film/i } },
        { 'selectedPackageSnapshot.category': { $regex: /film/i } },
        { 'productData.name': { $regex: /film/i } }
      ]
    });

    res.json({
      success: true,
      weddingsCovered: 100 + confirmedWeddingsCount,
      happyClients: 1000 + happyClientsCount,
      photosDelivered: 5000 + additionalPhotos,
      filmsProduced: 50 + filmsProducedCount
    });

  } catch (error) {
    console.error('Error fetching journey stats:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate journey stats' });
  }
};
