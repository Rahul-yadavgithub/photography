import StoreCategory from '../models/storeCategory.model.js';
import StoreProduct from '../models/storeProduct.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// --- CATEGORY CONTROLLERS ---

export const getCategoriesAdmin = catchAsync(async (req, res, next) => {
    const categories = await StoreCategory.find().sort('displayOrder createdAt').lean();
    res.status(200).json({ success: true, data: categories });
});

export const createCategory = catchAsync(async (req, res, next) => {
    const category = new StoreCategory(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
});

export const updateCategory = catchAsync(async (req, res, next) => {
    const category = await StoreCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return next(new AppError('Category not found', 404));
    res.status(200).json({ success: true, data: category });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
    const category = await StoreCategory.findByIdAndDelete(req.params.id);
    if (!category) return next(new AppError('Category not found', 404));
    // Note: In a real app, we might want to check if products belong to this category before deleting.
    res.status(200).json({ success: true, message: 'Category deleted' });
});

// --- PRODUCT CONTROLLERS ---

export const getProductsAdmin = catchAsync(async (req, res, next) => {
    const products = await StoreProduct.find().populate('category', 'name slug').sort('-createdAt').lean();
    res.status(200).json({ success: true, data: products });
});

export const createProduct = catchAsync(async (req, res, next) => {
    const product = new StoreProduct(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
});

export const updateProduct = catchAsync(async (req, res, next) => {
    const product = await StoreProduct.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return next(new AppError('Product not found', 404));
    res.status(200).json({ success: true, data: product });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
    const product = await StoreProduct.findByIdAndDelete(req.params.id);
    if (!product) return next(new AppError('Product not found', 404));
    res.status(200).json({ success: true, message: 'Product deleted' });
});

// --- PUBLIC APIs ---

export const getPublicCategories = catchAsync(async (req, res, next) => {
    // Get active categories
    const categories = await StoreCategory.find({ isActive: true }).sort('displayOrder createdAt').lean();
    
    // Fix N+1 Query Problem: Aggregate product counts in a single query
    const categoryCounts = await StoreProduct.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Map counts to categories
    const countMap = categoryCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const categoriesWithCounts = categories.map(cat => ({
      ...cat,
      productCount: countMap[cat._id] || 0
    }));

    res.status(200).json({ success: true, data: categoriesWithCounts });
});

export const getPublicProducts = catchAsync(async (req, res, next) => {
    const { category } = req.query;
    let query = { isActive: true };
    
    if (category) {
       const cat = await StoreCategory.findOne({ slug: category }).lean();
       if (cat) query.category = cat._id;
    }

    const products = await StoreProduct.find(query)
      .populate('category', 'name slug')
      .sort('-isFeatured displayOrder -createdAt')
      .lean();
      
    res.status(200).json({ success: true, data: products });
});

export const getProductBySlug = catchAsync(async (req, res, next) => {
    const product = await StoreProduct.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .lean();
      
    if (!product) return next(new AppError('Product not found', 404));
    res.status(200).json({ success: true, data: product });
});
