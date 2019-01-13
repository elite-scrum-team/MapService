const express = require('express');

const LocationController = require('../controllers/LocationController');
LocationController;
const router = express.Router();

router.get('/:id', async (req, res) => {
    const instance = await LocationController.retrieveOne(req.params.id);
    return res.status(instance ? 200 : 404).send(instance);
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const instanceOrError = await LocationController.create(req.body.location);
    return res.send(instanceOrError);
});

module.exports = router;
