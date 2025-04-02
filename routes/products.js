import express from 'express';
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    getProductsOutOfStock,
    getProductStatsByCategory,
    updateProduct,
    validateProduct
} from '../controllers/produitController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', validateProduct, createProduct);
router.get('/out-of-stock', getProductsOutOfStock);
router.get('/stats/count-by-category', getProductStatsByCategory);
router.get('/:id', getProductById);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
