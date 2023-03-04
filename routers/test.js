const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const testController = require('../controllers/testController');

router.post('/api/ihru/test', auth, testController.save);

module.exports = router;