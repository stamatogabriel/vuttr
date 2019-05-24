const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const authConfig = require('../../config/auth.json');
const mailer = require('../../modules/mailer');

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
        return res.status(400).send({ error: 'Something went wrong. Please try again.' })
    }
});

router.post('/forgot_pass', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).send({ error: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date;
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: 'stamato7@gmail.com',
            template: "auth/forgot_pass",
            context: { token },
        }, (err) => {
            if (err)
                return res.status(400).send({ error: 'Cannot send forgot password email' });

            return res.send();
        })
    } catch (err) {
        res.status(400).send({ error: 'Something went wrong. Please try again.' });
    }
});

router.post('/reset_pass', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');
        if (!await User.findOne({ email }))
            return res.status(400).send({ error: 'User not found' });

        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid' });

        const now = new Date;

        if (now > user.passwordResetExpires)
            return res.status(400).send({error: 'Token expired. Please, generate a new one'});

        user.password = password;

        await user.save();

        res.status(200).send({success: 'Password reseted successfuly'});
    } catch (err) {
        res.status(400).send({ error: 'Something went wrong. Please try again.' });
    }
})

module.exports = app => app.use('/', router);