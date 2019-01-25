/**
 * Location routers
 * @module routers/municipality
 * @requires express
 */

const express = require('express');

const MunicipalityController = require('../controllers/MunicipalityController');

/**
 * Express route for locations
 * @namespace municipalityRouter
 */
const router = express.Router();

/**
 * Route for getting all municipalities
 * @function
 * @name GET-Municipalities
 * @param {string} path - "/"
 * @param {callback} middleware - The middleware with the main logic
 */
router.get('/', async (req, res) => {
    const instances = await MunicipalityController.retrieve(req.query);
    return res.status(200).send(instances);
});

/**
 * Route for getting a municipality by id
 * @function
 * @name GET-MunicipalitiesById
 * @param {string} path - "/:id", contains a id paramater
 * @param {callback} route - An async route for getting all the parameters
 */
router.get('/:id', async (req, res) => {
    const instance = await MunicipalityController.retrieveOne();
    return res.status(instance ? 200 : 404).send(instance);
});

module.exports = router;
