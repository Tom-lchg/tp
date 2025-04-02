import sequelize from 'sequelize';
import Categorie from '../models/categorie.js';
import Product from '../models/produit.js';

// Middleware de validation
export const validateProduct = (req, res, next) => {
    const { prix, stock } = req.body;

    if (prix < 10 || prix > 500) {
        return res.status(400).json({
            message: 'Le prix doit être compris entre 10 et 500'
        });
    }

    if (stock < 0) {
        return res.status(400).json({
            message: 'Le stock ne peut pas être négatif'
        });
    }

    next();
};

export const getProducts = async (req, res) => {
    try {
        const produits = await Product.findAll();
        if (produits.length === 0) {
            return res.status(404).json({ message: "Aucun produit trouvé" });
        }
        res.status(200).json(produits);
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { nom, description, prix, stock, categorieId } = req.body;

        const categorie = await Categorie.findByPk(categorieId);
        if (!categorie) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        const nouveauProduit = await Product.create({
            nom,
            description,
            prix,
            stock,
            categorieId
        });
        res.status(201).json(nouveauProduit);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Un produit avec ce code EAN existe déjà" });
        }
        res.status(400).json({ message: "Erreur lors de la création du produit", error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const produit = await Product.findByPk(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(200).json(produit);
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { nom, description, prix, stock } = req.body;
        const produit = await Product.findByPk(req.params.id);

        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        await produit.update({ nom, description, prix, stock });
        res.status(200).json(produit);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Erreur de validation",
                errors: error.errors.map(e => e.message)
            });
        }
        res.status(400).json({ message: "Erreur lors de la mise à jour du produit", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const produit = await Product.findByPk(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        await produit.destroy();
        res.status(200).json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du produit", error: error.message });
    }
};

export const getProductsOutOfStock = async (req, res) => {
    try {
        const produits = await Product.findAll({
            where: { stock: 0 },
            include: [{ model: Categorie, attributes: ['nom'] }]
        });
        res.status(200).json(produits);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des produits en rupture", error: error.message });
    }
};

export const getProductStatsByCategory = async (req, res) => {
    try {
        const stats = await Product.findAll({
            attributes: [
                'categorieId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'nombreProduits']
            ],
            include: [{
                model: Categorie,
                attributes: ['nom']
            }],
            group: ['categorieId', 'Categorie.id', 'Categorie.nom']
        });
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du calcul des statistiques", error: error.message });
    }
}; 