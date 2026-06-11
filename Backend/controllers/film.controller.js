import Film from '../models/film.model.js';

const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET all films
export const getFilms = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
        }
        if (req.query.status) {
            filter.status = req.query.status;
        }
        const films = await Film.find(filter).sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: films });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET single film by slug or ID
export const getFilm = async (req, res) => {
    try {
        const { id } = req.params;
        let film = await Film.findOne({ slug: id });
        if (!film) {
            film = await Film.findById(id);
        }
        if (!film) {
            return res.status(404).json({ success: false, message: 'Film not found' });
        }
        res.status(200).json({ success: true, data: film });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// CREATE film
export const createFilm = async (req, res) => {
    try {
        const slug = generateSlug(req.body.title);
        const film = await Film.create({ ...req.body, slug });
        res.status(201).json({ success: true, data: film });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// UPDATE film
export const updateFilm = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.body.title) {
            req.body.slug = generateSlug(req.body.title);
        }
        const film = await Film.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!film) {
            return res.status(404).json({ success: false, message: 'Film not found' });
        }
        res.status(200).json({ success: true, data: film });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE film
export const deleteFilm = async (req, res) => {
    try {
        const film = await Film.findByIdAndDelete(req.params.id);
        if (!film) {
            return res.status(404).json({ success: false, message: 'Film not found' });
        }
        res.status(200).json({ success: true, message: 'Film deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
