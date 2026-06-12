import Film from '../models/film.model.js';
import Reel from '../models/reel.model.js';
import FilmCategory from '../models/filmCategory.model.js';

// @desc    Get aggregated dashboard data for Film Platform
// @route   GET /api/films-dashboard
// @access  Private/Admin
export const getDashboardData = async (req, res) => {
  try {
    const [signatureFilmsCount, reelsAndShortsCount, categoriesCount] = await Promise.all([
      Film.countDocuments(),
      Reel.countDocuments(),
      FilmCategory.countDocuments()
    ]);

    // Fetch latest 5 from both
    const [latestFilms, latestReels] = await Promise.all([
      Film.find().sort({ createdAt: -1 }).limit(5).lean(),
      Reel.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    // Format them identically for the frontend
    const formattedFilms = latestFilms.map(film => ({
      _id: film._id,
      title: film.title,
      type: 'Signature Film',
      thumbnail: film.thumbnail,
      createdAt: film.createdAt,
      status: film.status || 'Published'
    }));

    const formattedReels = latestReels.map(reel => ({
      _id: reel._id,
      title: reel.title,
      type: 'Reel',
      thumbnail: reel.thumbnail,
      createdAt: reel.createdAt,
      status: reel.status || 'Published'
    }));

    // Merge, sort newest first, and take top 5
    const recentUploads = [...formattedFilms, ...formattedReels]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          signatureFilms: signatureFilmsCount,
          reelsAndShorts: reelsAndShortsCount,
          categories: categoriesCount
        },
        recentUploads
      }
    });

  } catch (error) {
    console.error('Error fetching film dashboard data:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching dashboard data' });
  }
};
