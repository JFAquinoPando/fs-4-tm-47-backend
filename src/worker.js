const { Hono } = require('hono');
const { cors } = require('hono/cors');
const personajeD1Routes = require('./routes/personajeD1Routes');

const app = new Hono();

// Middleware CORS nativo de Hono
app.use('*', cors());

// Montaje de rutas
app.route('/api/personajes', personajeD1Routes);
app.route('/personajes', personajeD1Routes);

// Ruta raíz de información
app.get('/', (c) => {
  return c.json({
    mensaje: 'API de Personajes de Attack on Titan en Cloudflare Workers + D1 (SQLite)',
    endpoints: {
      getAll: 'GET /api/personajes',
      getById: 'GET /api/personajes/:id',
      create: 'POST /api/personajes',
      update: 'PUT /api/personajes/:id',
      delete: 'DELETE /api/personajes/:id'
    }
  });
});

// Manejo de 404
app.notFound((c) => {
  return c.json({ error: 'Ruta no encontrada' }, 404);
});

module.exports = {
  fetch: app.fetch
};
