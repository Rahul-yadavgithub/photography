import Category from '../models/category.model.js';
import { generateCategoryContentService } from '../services/ai.service.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: 'Server error fetching categories', error: error.message });
    }
};

export const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
        const category = await Category.findOne(query);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ success: false, message: 'Server error fetching category', error: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        if (!req.body.slug && req.body.categoryName) {
            req.body.slug = req.body.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        const newCategory = await Category.create(req.body);
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        console.error('Error creating category:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'A category with this name or slug already exists.' });
        }
        res.status(400).json({ success: false, message: 'Failed to create category', error: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };

        const updatedCategory = await Category.findOneAndUpdate(
            query,
            req.body,
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'A category with this name or slug already exists.' });
        }
        res.status(400).json({ success: false, message: 'Failed to update category', error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
        
        const deletedCategory = await Category.findOneAndDelete(query);
        
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, message: 'Failed to delete category', error: error.message });
    }
};

// AI Generation Endpoint
export const generateCategoryContent = async (req, res) => {
    try {
        const { categoryName } = req.body;

        if (!categoryName) {
            return res.status(400).json({ success: false, message: 'categoryName is required' });
        }

        const parsedContent = await generateCategoryContentService(categoryName);
        res.status(200).json({ success: true, data: parsedContent });

    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ success: false, message: 'Server error generating content', error: error.message });
    }
};
