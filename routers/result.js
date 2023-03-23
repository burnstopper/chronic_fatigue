const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const resultController = require('../controllers/resultController');

router.get('/api/ihru', auth, resultController.findConcreteById);
router.get('/api/ihru/results/resp', auth, resultController.findAllByRespId);
router.get('/api/ihru/results', auth, resultController.findByTimestamp);

module.exports = router;