const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.services");

async function authMiddleware(req, res, next) {
    const token = req.cookies?.token || (req.headers?.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: Token not provided",
            status: "failed"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized: User not found",
                status: "failed"
            });
        }

        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access token is invalid",
            status: "failed"
        });
    }
}

module.exports={
    authMiddleware
}