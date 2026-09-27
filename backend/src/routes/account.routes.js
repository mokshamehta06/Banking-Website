const express = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const accountController = require('../controllers/account.controller');

const router = express.Router();

router.use(authMiddleware);

router.post("/", accountController.createAccountController);

module.exports = router;