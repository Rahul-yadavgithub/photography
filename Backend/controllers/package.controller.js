import Package from '../models/package.model.js';

// Get all packages
export const getPackages = async (req, res) => {
    try {
        const packages = await Package.find().sort({ isFeatured: -1, order: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: packages });
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ success: false, message: 'Server error fetching packages', error: error.message });
    }
};

// Get single package by ID or Slug
export const getPackage = async (req, res) => {
    try {
        const { id } = req.params;
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
        const pkg = await Package.findOne(query);

        if (!pkg) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }
        res.status(200).json({ success: true, data: pkg });
    } catch (error) {
        console.error('Error fetching package:', error);
        res.status(500).json({ success: false, message: 'Server error fetching package', error: error.message });
    }
};

// Create a new package
export const createPackage = async (req, res) => {
    try {
        // Simple slug generation if not provided
        if (!req.body.slug && req.body.name) {
            req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        const newPackage = await Package.create(req.body);
        res.status(201).json({ success: true, data: newPackage });
    } catch (error) {
        console.error('Error creating package:', error);
        res.status(400).json({ success: false, message: 'Failed to create package', error: error.message });
    }
};

// Update an existing package
export const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };

        const updatedPackage = await Package.findOneAndUpdate(
            query,
            req.body,
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }

        res.status(200).json({ success: true, data: updatedPackage });
    } catch (error) {
        console.error('Error updating package:', error);
        res.status(400).json({ success: false, message: 'Failed to update package', error: error.message });
    }
};

// Delete a package
export const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
        
        const deletedPackage = await Package.findOneAndDelete(query);
        
        if (!deletedPackage) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }
        
        res.status(200).json({ success: true, message: 'Package deleted successfully' });
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({ success: false, message: 'Failed to delete package', error: error.message });
    }
};
