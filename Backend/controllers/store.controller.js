import StoreCategory from '../models/storeCategory.model.js';
import StoreProduct from '../models/storeProduct.model.js';

// --- CATEGORY CONTROLLERS ---

export const getCategoriesAdmin = async (req, res) => {
  try {
    const categories = await StoreCategory.find().sort('displayOrder createdAt');
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = new StoreCategory(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await StoreCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await StoreCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    // Note: In a real app, we might want to check if products belong to this category before deleting.
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- PRODUCT CONTROLLERS ---

export const getProductsAdmin = async (req, res) => {
  try {
    const products = await StoreProduct.find().populate('category', 'name slug').sort('-createdAt');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = new StoreProduct(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await StoreProduct.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await StoreProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- PUBLIC APIs ---

export const getPublicCategories = async (req, res) => {
  try {
    // Get active categories with product counts
    const categories = await StoreCategory.find({ isActive: true }).sort('displayOrder createdAt');
    
    // Optional: Aggregate product counts per category
    const categoriesWithCounts = await Promise.all(categories.map(async (cat) => {
        const count = await StoreProduct.countDocuments({ category: cat._id, isActive: true });
        return { ...cat.toObject(), productCount: count };
    }));

    res.status(200).json({ success: true, data: categoriesWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    
    if (category) {
       const cat = await StoreCategory.findOne({ slug: category });
       if (cat) query.category = cat._id;
    }

    const products = await StoreProduct.find(query)
      .populate('category', 'name slug')
      .sort('-isFeatured displayOrder -createdAt');
      
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await StoreProduct.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug');
      
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
