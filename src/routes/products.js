const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager('../data/products.json');

module.exports = (io) => {
  const router = Router();

  // Obtener todos los productos
  router.get('/', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.json(products);
  });

  // Crear un nuevo producto
  router.post('/', async (req, res) => {
    const newProduct = req.body;
    const product = await productManager.addProduct(newProduct);
    io.emit('products', await productManager.getAllProducts()); // Emitir productos actualizados
    res.status(201).json(product);
  });

  // Eliminar un producto
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await productManager.deleteProduct(id);
    if (deleted) {
      io.emit('products', await productManager.getAllProducts()); // Emitir productos actualizados
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  });

  // Manejar eventos de WebSocket desde el cliente
  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Escuchar la creación de productos desde el cliente
    socket.on('newProduct', async (productData) => {
      await productManager.addProduct(productData);
      io.emit('products', await productManager.getAllProducts()); // Emitir productos actualizados
    });

    // Escuchar la eliminación de productos desde el cliente
    socket.on('deleteProduct', async (productId) => {
      await productManager.deleteProduct(productId);
      io.emit('products', await productManager.getAllProducts()); // Emitir productos actualizados
    });
  });

  return router;
};
