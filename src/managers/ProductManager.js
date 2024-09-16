const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor(filePath) {
    this.filePath = path.resolve(__dirname, filePath);
  }

  async getAllProducts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async addProduct(product) {
    const products = await this.getAllProducts();
    const newProduct = { id: products.length + 1, ...product };
    products.push(newProduct);
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async deleteProduct(id) {
    let products = await this.getAllProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return true;
    }
    return false;
  }
}

module.exports = ProductManager;
