import Portfolio from '../models/portfolio.model.js';

// Helper to get or create the singleton Portfolio document
const getPortfolioDoc = async () => {
  let portfolio = await Portfolio.findOne();
  if (!portfolio) {
    portfolio = await Portfolio.create({});
  }
  return portfolio;
};

// --- PUBLIC APIs ---

export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await getPortfolioDoc();
    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getPortfolioGallery = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio || !portfolio.collections) {
      return res.status(200).json({ success: true, data: [] });
    }
    
    // Extract all images from active collections
    const activeCollections = portfolio.collections.filter(c => c.isActive);
    // Sort collections by displayOrder
    activeCollections.sort((a, b) => a.displayOrder - b.displayOrder);
    
    let allImages = [];
    activeCollections.forEach(c => {
      if (c.images && c.images.length > 0) {
        allImages = [...allImages, ...c.images];
      }
    });

    res.status(200).json({ success: true, data: allImages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// --- ADMIN APIs ---

export const getPortfolioAdmin = async (req, res) => {
  try {
    const portfolio = await getPortfolioDoc();
    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateHeroSection = async (req, res) => {
  try {
    const portfolio = await getPortfolioDoc();
    portfolio.heroSection = { ...portfolio.heroSection.toObject(), ...req.body };
    await portfolio.save();
    res.status(200).json({ success: true, data: portfolio.heroSection });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateDescriptionSection = async (req, res) => {
  try {
    const portfolio = await getPortfolioDoc();
    portfolio.descriptionSection = { ...portfolio.descriptionSection.toObject(), ...req.body };
    await portfolio.save();
    res.status(200).json({ success: true, data: portfolio.descriptionSection });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const addAchievement = async (req, res) => {
  try {
    const portfolio = await getPortfolioDoc();
    portfolio.achievements.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, data: portfolio.achievements[portfolio.achievements.length - 1] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await getPortfolioDoc();
    const achievement = portfolio.achievements.id(id);
    if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });
    
    achievement.set(req.body);
    await portfolio.save();
    res.status(200).json({ success: true, data: achievement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await getPortfolioDoc();
    portfolio.achievements.pull(id);
    await portfolio.save();
    res.status(200).json({ success: true, message: 'Achievement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const addCollection = async (req, res) => {
  try {
    const portfolio = await getPortfolioDoc();
    portfolio.collections.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, data: portfolio.collections[portfolio.collections.length - 1] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await getPortfolioDoc();
    const collection = portfolio.collections.id(id);
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
    
    collection.set(req.body);
    await portfolio.save();
    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await getPortfolioDoc();
    portfolio.collections.pull(id);
    await portfolio.save();
    res.status(200).json({ success: true, message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
