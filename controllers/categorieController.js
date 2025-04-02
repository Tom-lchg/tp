import sequelize from 'sequelize';
import Categorie from '../models/categorie.js';
import Product from '../models/produit.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await Categorie.findAll();
        if (categories.length === 0) {
            return res.status(404).json({ message: "Aucune catégorie trouvée" });
        }
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};

export const createCategorie = async (req, res) => {
    try {
        const { nom, description } = req.body;
        const nouvelleCategorie = await Categorie.create({ nom, description });
        res.status(201).json(nouvelleCategorie);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création de la catégorie", error: error.message });
    }
};

export const getCategorieById = async (req, res) => {
    try {
        const categorie = await Categorie.findByPk(req.params.id);
        if (!categorie) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }
        res.status(200).json(categorie);
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};

export const updateCategorie = async (req, res) => {
    try {
        const { nom, description } = req.body;
        const categorie = await Categorie.findByPk(req.params.id);

        if (!categorie) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        await categorie.update({ nom, description });
        res.status(200).json(categorie);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la mise à jour de la catégorie", error: error.message });
    }
};

export const deleteCategorie = async (req, res) => {
    try {
        const categorie = await Categorie.findByPk(req.params.id, {
            include: [{ model: Product, attributes: ['id'] }]
        });

        if (!categorie) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        if (categorie.Produits && categorie.Produits.length > 0) {
            return res.status(400).json({ message: "Impossible de supprimer une catégorie contenant des produits" });
        }

        await categorie.destroy();
        res.status(200).json({ message: "Catégorie supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la catégorie", error: error.message });
    }
};

export const getCategorieStats = async (req, res) => {
    try {
        const categorie = await Categorie.findByPk(req.params.id, {
            attributes: [
                'id',
                'nom',
                [sequelize.fn('COUNT', sequelize.col('Produits.id')), 'nombreProduits'],
                [sequelize.fn('AVG', sequelize.col('Produits.prix')), 'moyennePrix'],
                [sequelize.fn('MIN', sequelize.col('Produits.prix')), 'prixMinimum'],
                [sequelize.fn('MAX', sequelize.col('Produits.prix')), 'prixMaximum']
            ],
            include: [{ model: Product, attributes: [] }]
        });

        if (!categorie) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        res.status(200).json(categorie);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques", error: error.message });
    }
};

export const getTopCategories = async (req, res) => {
    try {
        const categories = await Categorie.findAll({
            attributes: [
                'id',
                'nom',
                [sequelize.fn('COUNT', sequelize.col('Produits.id')), 'nombreProduits']
            ],
            include: [{ model: Product, attributes: [] }],
            group: ['Categorie.id', 'Categorie.nom'],
            order: [[sequelize.fn('COUNT', sequelize.col('Produits.id')), 'DESC']],
            limit: 5
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des top catégories", error: error.message });
    }
};

export const getCategoriesOutOfStock = async (req, res) => {
    try {
        const categories = await Categorie.findAll({
            attributes: [
                'id',
                'nom',
                [sequelize.fn('COUNT', sequelize.col('Produits.id')), 'produitsEnRupture']
            ],
            include: [{
                model: Product,
                where: { stock: 0 },
                attributes: []
            }],
            group: ['Categorie.id', 'Categorie.nom'],
            having: sequelize.literal('COUNT(Produits.id) > 0')
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des catégories en rupture", error: error.message });
    }
};

export const getCategoriesAvgPriceOver100 = async (req, res) => {
    try {
        const categories = await Categorie.findAll({
            attributes: [
                'id',
                'nom',
                [sequelize.fn('AVG', sequelize.col('Produits.prix')), 'moyennePrix']
            ],
            include: [{
                model: Product,
                attributes: []
            }],
            group: ['Categorie.id', 'Categorie.nom'],
            having: sequelize.literal('AVG(Produits.prix) > 100')
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des catégories avec prix moyen > 100", error: error.message });
    }
}; 