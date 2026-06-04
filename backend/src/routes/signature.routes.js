const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const c = require('../controllers/signature.controller');

router.use(auth);
router.post('/',      c.send);
router.get('/',       c.list);
router.patch('/:token/sign', c.sign);

module.exports = router;