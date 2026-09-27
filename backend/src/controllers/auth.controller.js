const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.services');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
};

async function userRegisterController(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields (name, email, password) are required",
                status: "failed"
            });
        }

        const isExists = await userModel.findOne({ email });

        if (isExists) {
            return res.status(422).json({
                message: "User already exists with this email",
                status: "failed"
            });
        }

        const user = await userModel.create({
            email,
            password,
            name
        });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token, COOKIE_OPTIONS);

        // Send registration email
        try {
            await emailService.sendRegistrationEmail(user.email, user.name);
        } catch (emailErr) {
            console.error("Failed to send welcome email:", emailErr.message);
        }

        return res.status(201).json({
            message: "User registered successfully",
            status: "success",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: "failed"
        });
    }
}

async function userLoginController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                status: "failed"
            });
        }

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed"
            });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token, COOKIE_OPTIONS);

        return res.status(200).json({
            message: "Login successful",
            status: "success",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: "failed"
        });
    }
}

async function userLogoutController(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        return res.status(200).json({
            message: "Logged out successfully",
            status: "success"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: "failed"
        });
    }
}

async function getUserProfileController(req, res) {
    try {
        return res.status(200).json({
            status: "success",
            user: req.user
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: "failed"
        });
    }
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController,
    getUserProfileController
};