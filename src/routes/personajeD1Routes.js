const { Hono } = require('hono');
const personajeD1Controller = require('../controllers/personajeD1Controller');

const router = new Hono();

router.get('/', personajeD1Controller.getAll);
router.get('/:id', personajeD1Controller.getById);
router.post('/', personajeD1Controller.create);
router.put('/:id', personajeD1Controller.update);
router.delete('/:id', personajeD1Controller.delete);

module.exports = router;
