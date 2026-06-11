import FilmCategory from '../models/filmCategory.model.js';

// Helper: generate slug from name
const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET all film categories
export const getFilmCategories = async (req, res) => {
    try {
        const categories = await FilmCategory.find().sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET single film category by slug or ID
export const getFilmCategory = async (req, res) => {
    try {
        const { id } = req.params;
        let category = await FilmCategory.findOne({ slug: id });
        if (!category) {
            category = await FilmCategory.findById(id);
        }
        if (!category) {
            return res.status(404).json({ success: false, message: 'Film category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// CREATE film category
export const createFilmCategory = async (req, res) => {
    try {
        const slug = generateSlug(req.body.name);
        const category = await FilmCategory.create({ ...req.body, slug });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// UPDATE film category
export const updateFilmCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.body.name) {
            req.body.slug = generateSlug(req.body.name);
        }
        const category = await FilmCategory.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Film category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE film category
export const deleteFilmCategory = async (req, res) => {
    try {
        const category = await FilmCategory.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Film category not found' });
        }
        res.status(200).json({ success: true, message: 'Film category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
