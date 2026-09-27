const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/register", authController.userRegisterController);
router.post("/login", authController.userLoginController);
router.post("/logout", authController.userLogoutController);
router.get("/profile", authMiddleware, authController.getUserProfileController);

module.exports = router;