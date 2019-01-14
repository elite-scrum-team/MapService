const express = require('express');

const LocationController = require('../controllers/LocationController');

const router = express.Router();

router.get('/:id', async (req, res) => {
    const instance = await LocationController.retrieveOne(req.params.id);
    return res.status(instance ? 200 : 404).send(instance);
});

router.post('/', async (req, res) => {
    const instanceOrError = await LocationController.create(req.body.location);
    console.log('Location Instance: ' + instanceOrError);
    return res.send(instanceOrError);
});

module.exports = router;
