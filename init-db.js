import { initDB } from './config/database.js';
import Categorie from './models/categorie.js';
import Produit from './models/produit.js';

// Création de quelques catégories et produits de test
const createTestData = async () => {
    try {
        // Création des catégories
        const categorieElectronique = await Categorie.create({
            nom: 'Électronique',
            description: 'Produits électroniques'
        });

        const categorieVetements = await Categorie.create({
            nom: 'Vêtements',
            description: 'Articles vestimentaires'
        });

        // Création des produits
        await Produit.create({
            nom: 'Smartphone XYZ',
            description: 'Un smartphone dernière génération',
            prix: 299.99,
            stock: 50,
            categorieId: categorieElectronique.id
        });

        await Produit.create({
            nom: 'T-shirt Basic',
            description: 'T-shirt en coton bio',
            prix: 19.99,
            stock: 100,
            categorieId: categorieVetements.id
        });

        console.log('Données de test créées avec succès');
    } catch (error) {
        console.error('Erreur lors de la création des données de test:', error);
    }
};

// Initialisation de la base de données
const initialize = async () => {
    try {
        await initDB();
        await createTestData();
        console.log('Initialisation terminée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
};

initialize();
