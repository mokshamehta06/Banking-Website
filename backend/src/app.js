const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);

app.use('/api/accounts', accountRouter);
// Global 404 handler


module.exports = app;