const db = require('../models');
const Sequelize = require('sequelize');

const GeoCodingAPI = require('../services/GeoCodingAPI');

/**
 * Helper-functions
 * @module
 */
module.exports = {
    /**
     * Based on a location object, gets the meta data from Google Gecoding API
     * , and creates a municipality-entity in the db if it does not already exists.
     * @function
     * @param {Object} location - Location object containing lat and lng
     * @returns An object containing the meta data, like municipality, city and route.
     */
    async locateFindOrCreate(location) {
        const result = await GeoCodingAPI.geodata.retrieve(location);

        // Get municipality data from location data
        const locationData =
            (await GeoCodingAPI.convert.toLocationData(result)) || {};
        const municipalityName = locationData.municipality;

        // Find existing municipality with that name
        const municipality = await db.municipality.findOne({
            where: {
                name: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('name')),
                    'LIKE',
                    '%' + municipalityName + '%'
                ),
            },
        });

        // If the municipality does not exist, add it
        if (!municipality && municipalityName) {
            console.log(municipalityName + ' does not exist, adds it to db');
            const model = await db.municipality.create({
                name: municipalityName,
            });
            if (model)
                //Checking if model exists
                locationData.municipalityId = model.id;
        } else if (municipality) {
            // If it exists, use its id in the location instance
            console.log(
                municipalityName + ' already exists, appends it to instance'
            );
            locationData.municipalityId = municipality.id;
        }

        return locationData;
    },
};
