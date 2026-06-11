import express from 'express';
import {
  getPortfolioAdmin,
  updateHeroSection,
  updateDescriptionSection,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  addCollection,
  updateCollection,
  deleteCollection
} from '../controllers/portfolio.controller.js';

const router = express.Router();

router.get('/', getPortfolioAdmin);
router.put('/hero', updateHeroSection);
router.put('/description', updateDescriptionSection);

router.post('/achievement', addAchievement);
router.put('/achievement/:id', updateAchievement);
router.delete('/achievement/:id', deleteAchievement);

router.post('/collection', addCollection);
router.put('/collection/:id', updateCollection);
router.delete('/collection/:id', deleteCollection);

export default router;
