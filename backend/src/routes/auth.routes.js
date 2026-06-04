const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ ok: true, message: 'Auth route funcionando' });
});

module.exports = router;