import express from 'express';
import { getCars, getCarById, compareCars, getBrands } from '../controllers/carController.js';

const router = express.Router();

// Get all cars or filter by brand
router.get('/cars', getCars);

// Get car brands
router.get('/brands', getBrands);

// Get car by ID
router.get('/cars/:id', getCarById);

// Compare two cars
router.get('/compare', compareCars);

export const carRoutes = router;
