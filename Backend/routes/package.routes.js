import express from 'express';
import { getPackages, getPackage, createPackage, updatePackage, deletePackage } from '../controllers/package.controller.js';

const router = express.Router();

router.route('/')
    .get(getPackages)
    .post(createPackage);

router.route('/:id')
    .get(getPackage)
    .put(updatePackage)
    .delete(deletePackage);

export default router;
