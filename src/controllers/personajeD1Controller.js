const PersonajeD1 = require('../models/PersonajeD1');

const personajeD1Controller = {
  // GET /api/personajes
  async getAll(c) {
    try {
      const personajes = await PersonajeD1.findAll(c.env.DB);
      return c.json(personajes, 200);
    } catch (error) {
      console.error('Error en getAll D1:', error);
      return c.json({ error: 'Error al obtener personajes desde D1' }, 500);
    }
  },

  // GET /api/personajes/:id
  async getById(c) {
    try {
      const id = c.req.param('id');
      const personaje = await PersonajeD1.findById(c.env.DB, id);

      if (!personaje) {
        return c.json({ error: `Personaje con id ${id} no encontrado` }, 404);
      }

      return c.json(personaje, 200);
    } catch (error) {
      console.error('Error en getById D1:', error);
      return c.json({ error: 'Error al buscar el personaje en D1' }, 500);
    }
  },

  // POST /api/personajes
  async create(c) {
    try {
      const body = await c.req.json();
      const { nombre } = body;

      if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
        return c.json({ error: 'El campo "nombre" es obligatorio' }, 400);
      }

      const nuevo = await PersonajeD1.create(c.env.DB, body);
      return c.json(nuevo, 201);
    } catch (error) {
      console.error('Error en create D1:', error);
      return c.json({ error: 'Error al crear el personaje en D1' }, 500);
    }
  },

  // PUT /api/personajes/:id
  async update(c) {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const actualizado = await PersonajeD1.update(c.env.DB, id, body);

      if (!actualizado) {
        return c.json({ error: `Personaje con id ${id} no encontrado` }, 404);
      }

      return c.json(actualizado, 200);
    } catch (error) {
      console.error('Error en update D1:', error);
      return c.json({ error: 'Error al actualizar el personaje en D1' }, 500);
    }
  },

  // DELETE /api/personajes/:id
  async delete(c) {
    try {
      const id = c.req.param('id');
      const eliminado = await PersonajeD1.delete(c.env.DB, id);

      if (!eliminado) {
        return c.json({ error: `Personaje con id ${id} no encontrado` }, 404);
      }

      return c.json({ mensaje: `Personaje con id ${id} eliminado con éxito` }, 200);
    } catch (error) {
      console.error('Error en delete D1:', error);
      return c.json({ error: 'Error al eliminar el personaje en D1' }, 500);
    }
  }
};

module.exports = personajeD1Controller;
