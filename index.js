import express from "express";
import { sequelize, testConnection } from './config/database.js';
import categorieRoutes from './routes/categories.js';
import productsRoutes from './routes/products.js';
import setupServer from './server/config.js';

const router = express.Router();

const app = setupServer();
const PORT = 4000;

async function startServer() {
    try {
        await testConnection();
        await sequelize.sync({ force: false });

        router.use('/products', productsRoutes);
        router.use('/categories', categorieRoutes);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('Database synchronized');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

