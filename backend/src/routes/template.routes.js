const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const c = require('../controllers/template.controller');

router.use(auth);
router.get('/',     c.list);
router.post('/',    c.create);
router.get('/:id',  c.getOne);
router.delete('/:id', c.remove);

module.exports = router;