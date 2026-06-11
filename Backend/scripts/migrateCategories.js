import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import Package from '../models/package.model.js';
import Category from '../models/category.model.js';

const migrateCategories = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const packages = await Package.find();
        console.log(`Found ${packages.length} packages.`);

        const categoriesMap = new Map();

        // Extract unique categories
        for (const pkg of packages) {
            if (pkg.category && !categoriesMap.has(pkg.category)) {
                categoriesMap.set(pkg.category, pkg.category);
            }
        }

        console.log(`Found ${categoriesMap.size} unique categories.`);

        let createdCount = 0;

        for (const [key, categoryName] of categoriesMap) {
            const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            
            // Check if already exists
            const existing = await Category.findOne({ slug });
            if (!existing) {
                await Category.create({
                    categoryName,
                    slug,
                    heroHeading: `Premium ${categoryName}`,
                    shortDescription: `Explore our exclusive ${categoryName} packages designed just for you.`,
                    fullDescription: `Discover our carefully curated ${categoryName} services. We offer a range of premium packages to ensure your special moments are captured perfectly.`,
                    status: 'Published'
                });
                console.log(`Created category: ${categoryName}`);
                createdCount++;
            } else {
                console.log(`Category already exists: ${categoryName}`);
            }
        }

        console.log(`Migration complete. Created ${createdCount} categories.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateCategories();
