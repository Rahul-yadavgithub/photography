import express from 'express';
import {
    getFilmCategories,
    getFilmCategory,
    createFilmCategory,
    updateFilmCategory,
    deleteFilmCategory
} from '../controllers/filmCategory.controller.js';

const router = express.Router();

router.route('/')
    .get(getFilmCategories)
    .post(createFilmCategory);

router.route('/:id')
    .get(getFilmCategory)
    .put(updateFilmCategory)
    .delete(deleteFilmCategory);

export default router;
