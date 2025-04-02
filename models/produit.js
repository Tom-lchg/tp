import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Categorie from './categorie.js';

const generateEAN = (categorieId) => {
    const prefix = String(categorieId).padStart(4, '0');
    const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return `${prefix}${random}`;
};

const Produit = sequelize.define('Produit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 10,
            max: 500
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    codeEAN: {
        type: DataTypes.STRING,
        unique: true
    }
});

// Définition des relations
Categorie.hasMany(Produit, {
    foreignKey: 'categorieId'
});
Produit.belongsTo(Categorie, {
    foreignKey: 'categorieId'
});

// Hook pour générer automatiquement le code EAN avant création
Produit.beforeCreate(async (produit) => {
    if (produit.categorieId) {
        produit.codeEAN = generateEAN(produit.categorieId);
    }
});

export default Produit;
