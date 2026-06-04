const router = require('express').Router();
const auth   = require('../middlewares/auth.middleware');
const { upload, saveUpload, listByEntity } = require('../controllers/upload.controller');

router.use(auth);
router.post('/', upload.single('file'), saveUpload);
router.get('/:entity/:entityId', listByEntity);

module.exports = router;