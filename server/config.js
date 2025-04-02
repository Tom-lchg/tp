import cors from 'cors';
import express from 'express';
import categoriesRouter from '../routes/categories.js';
import productsRouter from '../routes/products.js';

const setupServer = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Configure routes
    app.use('/api/products', productsRouter);
    app.use('/api/categories', categoriesRouter);

    return app;
};

export default setupServer;
