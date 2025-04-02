import express from 'express';
import {
    createCategorie,
    deleteCategorie,
    getCategorieById,
    getCategories,
    getCategoriesAveragePrice,
    getCategoriesAvgPriceOver100,
    getCategoriesOutOfStock,
    getCategorieStats,
    getTopCategories,
    updateCategorie
} from '../controllers/categorieController.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', createCategorie);
router.get('/:id', getCategorieById);
router.put('/:id', updateCategorie);
router.delete('/:id', deleteCategorie);
router.get('/:id/stats', getCategorieStats);
router.get('/stats/top-categories', getTopCategories);
router.get('/stats/categories-out-of-stock', getCategoriesOutOfStock);
router.get('/stats/categories-avg-price-over-100', getCategoriesAvgPriceOver100);
router.get('/stats/average-price', getCategoriesAveragePrice);

export default router;
