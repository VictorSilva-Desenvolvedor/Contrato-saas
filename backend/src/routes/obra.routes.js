const router = require('express').Router();
const auth   = require('../middlewares/auth.middleware');
const c      = require('../controllers/obra.controller');
const m      = require('../controllers/manutencao.controller');

router.use(auth);
router.get('/',                         c.list);
router.post('/',                        c.create);
router.get('/:id',                      c.getOne);
router.put('/:id',                      c.update);
router.patch('/:id/steps/:stepId',      c.updateStep);
router.post('/:id/custos',              c.addCusto);
router.post('/:id/vistorias',           c.addVistoria);

// Manutenções
router.get('/:obraId/manutencoes',      m.list);
router.post('/:obraId/manutencoes',     m.create);
router.delete('/:obraId/manutencoes/:id', m.remove);

module.exports = router;