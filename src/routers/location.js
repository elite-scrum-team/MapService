/**
 * Location routers
 * @module routers/location
 * @requires express
 */

const express = require('express');

const LocationController = require('../controllers/LocationController');

/**
 * Express route for locations
 * @namespace locationRouter
 */
const router = express.Router();

/**
 * Route for getting all locations
 * @function
 * @name GET-CloseLocations
 * @param {string} path - "/close/:lat/:lng"
 * @param {callback} route - The route
 */
router.get('/close/:lat/:lng', async (req, res) => {
    const instances = await LocationController.retrieveWithDistance(
        req.query,
        req.params,
        2000
    );
    if (instances) await res.send(instances);
    else await res.status(500).send({ error: 'Error' });
});

/**
 * Route for creating a location
 * @function
 * @param {string} path - "/"
 * @name POST-CreateLocation
 */
router.post('/', async (req, res) => {
    const instanceOrError = await LocationController.create(req.body.location);
    console.log('Location Instance: ' + instanceOrError);
    return res.send(instanceOrError);
});

/**
 * Route for getting locations with wanted filter
 * @function
 * @param {string} path - "/""
 * @name GET-Locations
 */
router.get('/', async (req, res) => {
    const instances = await LocationController.retrieve(req.query);
    return res.status(200).send(instances);
});

/**
 * Route for getting a location based on id
 * @function
 * @param {string} path - "/:id"
 * @name GET-Location
 */
router.get('/:id', async (req, res) => {
    const instance = await LocationController.retrieveOne(req.params.id);
    return res.status(instance ? 200 : 404).send(instance);
});

/**
 * Route for getting meta-data about a location
 * @name GET-LocationInfo
 */
router.get('/info/:lat/:lng', async (req, res) => {
    const instance = await LocationController.getLocationInfo(req.params);
    if (instance) await res.send(instance);
    else await res.status(500).send({ error: 'Could not get info' });
});

module.exports = router;
