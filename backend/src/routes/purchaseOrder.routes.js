const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const c = require('../controllers/purchaseOrder.controller');

router.use(auth);
router.get('/',      c.list);
router.post('/',     c.create);
router.put('/:id',   c.update);

module.exports = router;