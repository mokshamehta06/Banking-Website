const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);

// Global 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`,
        status: 'failed'
    });
});

module.exports = app;