const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const productManager = new ProductManager('src/data/products.json');

// Ruta para la vista principal (home)
router.get('/', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('home', { products });
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', { products });
});

module.exports = router;
