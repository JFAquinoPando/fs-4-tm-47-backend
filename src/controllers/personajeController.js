const Personaje = require('../models/Personaje');

const personajeController = {
  // GET /api/personajes
  async getAll(req, res) {
    try {
      const personajes = await Personaje.findAll();
      return res.status(200).json(personajes);
    } catch (error) {
      console.error('Error en getAll:', error);
      return res.status(500).json({ error: 'Error interno del servidor al obtener personajes' });
    }
  },

  // GET /api/personajes/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const personaje = await Personaje.findById(id);

      if (!personaje) {
        return res.status(404).json({ error: `Personaje con id ${id} no encontrado` });
      }

      return res.status(200).json(personaje);
    } catch (error) {
      console.error('Error en getById:', error);
      return res.status(500).json({ error: 'Error interno del servidor al buscar el personaje' });
    }
  },

  // POST /api/personajes
  async create(req, res) {
    try {
      const { nombre } = req.body;

      if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
        return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
      }

      const nuevoPersonaje = await Personaje.create(req.body);
      return res.status(201).json(nuevoPersonaje);
    } catch (error) {
      console.error('Error en create:', error);
      return res.status(500).json({ error: 'Error interno del servidor al crear el personaje' });
    }
  },

  // PUT /api/personajes/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const actualizado = await Personaje.update(id, req.body);

      if (!actualizado) {
        return res.status(404).json({ error: `Personaje con id ${id} no encontrado` });
      }

      return res.status(200).json(actualizado);
    } catch (error) {
      console.error('Error en update:', error);
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el personaje' });
    }
  },

  // DELETE /api/personajes/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await Personaje.delete(id);

      if (!eliminado) {
        return res.status(404).json({ error: `Personaje con id ${id} no encontrado` });
      }

      return res.status(200).json({ mensaje: `Personaje con id ${id} eliminado con éxito` });
    } catch (error) {
      console.error('Error en delete:', error);
      return res.status(500).json({ error: 'Error interno del servidor al eliminar el personaje' });
    }
  }
};

module.exports = personajeController;
