const express = require('express');

const auth = require('../middleware/is-auth');
const authController = require('../controllers/auth');

const router = express.Router();

//API
router.get('/', auth, authController.get);

module.exports = router;
