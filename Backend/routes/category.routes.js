import express from 'express';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    generateCategoryContent
} from '../controllers/category.controller.js';

const router = express.Router();

router.post('/generate', generateCategoryContent);

router.route('/')
    .get(getCategories)
    .post(createCategory);

router.route('/:id')
    .get(getCategory)
    .put(updateCategory)
    .delete(deleteCategory);

export default router;
