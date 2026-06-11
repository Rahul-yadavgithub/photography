import Review from '../models/review.model.js';

// @desc    Create a new review (Customer)
// @route   POST /api/reviews
// @access  Public
export const createReview = async (req, res) => {
    try {
        const { customerName, location, rating, review } = req.body;

        if (!customerName || !rating || !review) {
            return res.status(400).json({
                success: false,
                message: 'Customer name, rating, and review are required'
            });
        }

        const newReview = await Review.create({
            customerName,
            location,
            rating,
            review,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: newReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }
};

// @desc    Get all approved reviews (Customer)
// @route   GET /api/reviews
// @access  Public
export const getApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private (Admin)
export const getAllReviewsAdmin = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });

        res.status(200).json(reviews); // Matching the expected array format for frontend api
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching all reviews',
            error: error.message
        });
    }
};

// @desc    Approve a review (Admin)
// @route   PATCH /api/admin/reviews/:id/approve
// @access  Private (Admin)
export const approveReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // The user ID should come from Clerk auth object if needed
        // Assuming req.auth.userId exists if requireClerkAuth is used
        // But the schema expects ObjectId. Let's omit approvedBy for now as Clerk user IDs are strings,
        // or just store the Clerk userId if we change the schema.
        
        review.status = 'approved';
        review.approvedAt = Date.now();
        // review.approvedBy = req.auth?.userId; 

        await review.save();

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving review',
            error: error.message
        });
    }
};

// @desc    Reject a review (Admin)
// @route   PATCH /api/admin/reviews/:id/reject
// @access  Private (Admin)
export const rejectReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.status = 'rejected';
        await review.save();

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting review',
            error: error.message
        });
    }
};

// @desc    Delete a review (Admin - only rejected)
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        if (review.status !== 'rejected') {
            return res.status(400).json({
                success: false,
                message: 'Only rejected reviews can be deleted'
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
};
