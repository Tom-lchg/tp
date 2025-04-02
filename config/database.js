import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('tp', 'root', 'root', {
    host: 'localhost',
    port: 8889, // Port MAMP par défaut
    dialect: 'mysql',
});

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection à la base de données établie avec succès.');
    } catch (error) {
        console.error('Détails de l\'erreur:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        throw new Error('Impossible de se connecter à la base de données: ' + error.message);
    }
};

export const initDB = async () => {
    try {
        await testConnection();
        await sequelize.sync({ force: true });
        console.log('Database synchronized');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export default sequelize;
