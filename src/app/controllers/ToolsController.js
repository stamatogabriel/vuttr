const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Tool = require('../models/Tool');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
    const { link } = req.body;

    try {
        const data = await Tool.findOne({ link });

        if (data)
            return res.status(400).send({ error: 'Tool already exists' });

        const tool = await Tool.create(req.body);

        return res.send({ tool })

    } catch (err) {
        return res.status(400).send({ error: 'Something went wrong. Please try again.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const tools = await Tool.find();

        return res.send({ tools })
    } catch (err) {
        return res.status(400).send({ error: 'Something went wrong. Please try again.' });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { tag } = req.body;

        const tool = await Tool.find({ tags: tag })

        return res.send({ tool });
    } catch (err) {
        return res.status(400).send({ error: 'Something went wrong. Please try again.' });
    }
});

router.get('/search/:toolId', async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.toolId);

        return res.send({ tool });
    } catch (err) {
        return res.status(400).send({ error: 'Something went wrong. Please try again.' });
    }
});

router.put('/update/:toolId', async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.toolId);

    } catch (err) {
        return res.status(400).send({ error: 'Something went wrong. Please try again.' });
    }
});

router.delete('/destroy/:toolId', async (req, res) => {
    try {
        await Tool.findByIdAndDelete(req.params.toolId);

        return res.status(200).send({success: 'Tool deleted succesfully'});
    } catch (err) {
        return res.status(400).send({ error: 'Something went wrong. Please try again.' });
    }
});

module.exports = app => app.use('/tools', router);