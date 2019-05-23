const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const authConfig = require('../config/auth.json');

const router = express.Router();

generateToken = (params = {}) => {
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' });

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ user, token: generateToken({ id: user._id }) });
    } catch (err) {
        return res.status(400).send({ error: "Register failed. Please, try again." });
    }
});

router.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user)
            return res.status(400).send({ error: 'User not found' });

        if (!await bcrypt.compare(password, user.password))
            return res.status(401).send({ error: 'Invalid password' });

        user.password = undefined;

        return res.send({ user, token: generateToken({ id: user._id }) });
    } catch (err) {
        return res.status(500).send({ error: 'Something went wrong. Please try again.' })
    }
});

module.exports = app => app.use('/', router);