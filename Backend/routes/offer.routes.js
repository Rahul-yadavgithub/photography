import express from 'express';
import { 
  createOffer, 
  getOffers, 
  getActiveOffers, 
  getOfferById, 
  updateOffer, 
  deleteOffer, 
  toggleOfferStatus 
} from '../controllers/offer.controller.js';

const router = express.Router();

router.post('/', createOffer);
router.get('/', getOffers);
router.get('/active', getActiveOffers);
router.get('/:id', getOfferById);
router.put('/:id', updateOffer);
router.delete('/:id', deleteOffer);
router.patch('/:id/toggle-status', toggleOfferStatus);

export default router;
