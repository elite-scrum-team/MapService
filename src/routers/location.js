const express = require('express');

const LocationController = require('../controllers/LocationController');

const router = express.Router();

router.post('/', async (req, res) => {
    const instanceOrError = await LocationController.create(req.body.location);
    console.log('Location Instance: ' + instanceOrError);
    return res.send(instanceOrError);
});

router.get('/', async (req, res) => {
    const instances = await LocationController.retrieve(req.query);
    return res.status(200).send(instances);
});

router.get('/:id', async (req, res) => {
    const instance = await LocationController.retrieveOne(req.params.id);
    return res.status(instance ? 200 : 404).send(instance);
});

router.get('/close/:lat/:lng', async (req, res) => {
    const instances = await LocationController.retrieve(
        req.query,
        req.params,
        10000000
    );
    console.log(instances);
    await res.send('Nice!');
});

module.exports = router;
