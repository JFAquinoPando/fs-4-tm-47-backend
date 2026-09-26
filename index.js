const express = require('express');
const cors = require('cors');
const personajeRoutes = require('./src/routes/personajeRoutes');
require('./src/config/database'); // Inicializa la conexión y tablas

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/personajes', personajeRoutes);
app.use('/personajes', personajeRoutes);

// Ruta de estado
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Personajes de Attack on Titan',
    endpoints: {
      getAll: 'GET /api/personajes',
      getById: 'GET /api/personajes/:id',
      create: 'POST /api/personajes',
      update: 'PUT /api/personajes/:id',
      delete: 'DELETE /api/personajes/:id'
    }
  });
});

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor solo si no estamos en entorno de pruebas
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
