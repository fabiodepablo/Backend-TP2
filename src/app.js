const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const productRoutes = require('./routes/products');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', engine({
  extname: '.handlebars',
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

// Ruta para la API de productos
app.use('/api/products', productRoutes(io));

// Ruta de error para URL inválidas
app.use((req, res) => {
  res.status(404).json({ code: '1-11', msg: 'Invalid URL.' });
});

// Iniciar el servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
