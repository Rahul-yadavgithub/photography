import Pose from '../models/pose.model.js';
import Category from '../models/category.model.js';
import { generatePosesService } from '../services/ai.service.js';

export const generatePoses = async (req, res) => {
    try {
        const { categoryId, count } = req.body;

        if (!categoryId) {
            return res.status(400).json({ success: false, message: 'categoryId is required' });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const numPoses = count ? parseInt(count) : 10;
        
        const parsedContent = await generatePosesService(category.categoryName, numPoses);
        
        res.status(200).json({ success: true, data: parsedContent.poses });
    } catch (error) {
        console.error('Error generating poses:', error);
        res.status(500).json({ success: false, message: 'Server error generating poses', error: error.message });
    }
};

export const createPose = async (req, res) => {
    try {
        const {
            categoryId, poseName, shortDescription, bestTime, bestLens,
            difficulty, shootingTips, coupleInstructions, photographerNotes,
            tags, imageUrl, imagePublicId, aiGenerated, status
        } = req.body;

        if (!categoryId || !poseName || !shortDescription || !bestLens || !difficulty) {
            return res.status(400).json({ success: false, message: 'Missing required pose fields' });
        }

        const newPose = new Pose({
            categoryId, poseName, shortDescription, bestTime, bestLens,
            difficulty, shootingTips, coupleInstructions, photographerNotes,
            tags, imageUrl, imagePublicId, aiGenerated, status,
            createdBy: req.user?._id // If auth middleware is attached
        });

        const savedPose = await newPose.save();
        res.status(201).json({ success: true, data: savedPose });
    } catch (error) {
        console.error('Error creating pose:', error);
        res.status(400).json({ success: false, message: 'Failed to create pose', error: error.message });
    }
};

export const updatePose = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPose = await Pose.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        
        if (!updatedPose) {
            return res.status(404).json({ success: false, message: 'Pose not found' });
        }
        res.status(200).json({ success: true, data: updatedPose });
    } catch (error) {
        console.error('Error updating pose:', error);
        res.status(400).json({ success: false, message: 'Failed to update pose', error: error.message });
    }
};

export const deletePose = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPose = await Pose.findByIdAndDelete(id);
        
        if (!deletedPose) {
            return res.status(404).json({ success: false, message: 'Pose not found' });
        }
        res.status(200).json({ success: true, message: 'Pose deleted successfully' });
    } catch (error) {
        console.error('Error deleting pose:', error);
        res.status(500).json({ success: false, message: 'Failed to delete pose', error: error.message });
    }
};

export const getPosesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const poses = await Pose.find({ categoryId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: poses });
    } catch (error) {
        console.error('Error fetching poses:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch poses', error: error.message });
    }
};

export const getAllPublishedPoses = async (req, res) => {
    try {
        const poses = await Pose.find({ status: 'published' })
            .populate('categoryId', 'categoryName')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: poses });
    } catch (error) {
        console.error('Error fetching public poses:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch poses', error: error.message });
    }
};

export const getPublishedPosesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const poses = await Pose.find({ categoryId, status: 'published' })
            .populate('categoryId', 'categoryName')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: poses });
    } catch (error) {
        console.error('Error fetching public category poses:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch category poses', error: error.message });
    }
};
