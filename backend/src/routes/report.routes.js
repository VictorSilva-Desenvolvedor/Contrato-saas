const router = require('express').Router();
const auth   = require('../middlewares/auth.middleware');
const c      = require('../controllers/report.controller');

router.use(auth);
router.get('/contracts',  c.contractsReport);
router.get('/obras',      c.obrasReport);
router.get('/signatures', c.signaturesReport);

module.exports = router;