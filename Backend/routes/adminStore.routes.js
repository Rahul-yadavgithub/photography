import express from 'express';
import { 
    getCategoriesAdmin, createCategory, updateCategory, deleteCategory,
    getProductsAdmin, createProduct, updateProduct, deleteProduct 
} from '../controllers/store.controller.js';

const router = express.Router();

// Categories
router.get('/categories', getCategoriesAdmin);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Products
router.get('/products', getProductsAdmin);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
