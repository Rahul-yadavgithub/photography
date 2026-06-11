import express from 'express';
import {
    getFilms,
    getFilm,
    createFilm,
    updateFilm,
    deleteFilm
} from '../controllers/film.controller.js';

const router = express.Router();

router.route('/')
    .get(getFilms)
    .post(createFilm);

router.route('/:id')
    .get(getFilm)
    .put(updateFilm)
    .delete(deleteFilm);

export default router;
