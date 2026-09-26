const express = require('express');
const router = express.Router();
const personajeController = require('../controllers/personajeController');

// Rutas CRUD para Personajes
router.get('/', personajeController.getAll);
router.get('/:id', personajeController.getById);
router.post('/', personajeController.create);
router.put('/:id', personajeController.update);
router.delete('/:id', personajeController.delete);

module.exports = router;
