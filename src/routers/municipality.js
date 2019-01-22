const express = require('express');

const MunicipalityController = require('../controllers/MunicipalityController');

const router = express.Router();

router.get('/', async (req, res) => {
    const instances = await MunicipalityController.retrieve(req.query);
    return res.status(200).send(instances);
});

router.get('/:id', async (req, res) => {
    const instance = await MunicipalityController.retrieveOne();
    return res.status(instance ? 200 : 404).send(instance);
});

module.exports = router;
