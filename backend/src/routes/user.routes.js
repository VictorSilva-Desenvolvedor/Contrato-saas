const router = require('express').Router();
const auth   = require('../middlewares/auth.middleware');
const c      = require('../controllers/user.controller');

router.use(auth);
router.get('/',           c.list);
router.post('/',          c.create);
router.put('/:id',        c.update);
router.delete('/:id',     c.remove);
router.get('/audit-logs', c.auditLogs);

module.exports = router;