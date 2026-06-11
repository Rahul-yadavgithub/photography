import Reel from '../models/reel.model.js';

// GET all reels
export const getReels = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
        }
        if (req.query.status) {
            filter.status = req.query.status;
        }
        const reels = await Reel.find(filter).sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: reels });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET single reel
export const getReel = async (req, res) => {
    try {
        const reel = await Reel.findById(req.params.id);
        if (!reel) {
            return res.status(404).json({ success: false, message: 'Reel not found' });
        }
        res.status(200).json({ success: true, data: reel });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// CREATE reel
export const createReel = async (req, res) => {
    try {
        const reel = await Reel.create(req.body);
        res.status(201).json({ success: true, data: reel });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// UPDATE reel
export const updateReel = async (req, res) => {
    try {
        const reel = await Reel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!reel) {
            return res.status(404).json({ success: false, message: 'Reel not found' });
        }
        res.status(200).json({ success: true, data: reel });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE reel
export const deleteReel = async (req, res) => {
    try {
        const reel = await Reel.findByIdAndDelete(req.params.id);
        if (!reel) {
            return res.status(404).json({ success: false, message: 'Reel not found' });
        }
        res.status(200).json({ success: true, message: 'Reel deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
