const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const { metrics } = require('../controllers/dashboard.controller');

router.use(auth);
router.get('/metrics', metrics);

module.exports = router;