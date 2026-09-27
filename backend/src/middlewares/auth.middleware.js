const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authMiddleware(req, res, next) {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided",
                status: "failed"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized: User not found",
                status: "failed"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized: Invalid or expired token",
            status: "failed"
        });
    }
}

module.exports = authMiddleware;
