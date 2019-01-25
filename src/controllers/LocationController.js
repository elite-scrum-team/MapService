const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const helpers = require('../utils/helpers');

/**
    Location Controller
    @module controllers/LocationController
*/
module.exports = {
    /** This method creates a location based on a latLng input.
        It first asks the Google GeoCoding API about the meta-data,
        like municipality, street and route. 
        Then it checks if the municipality found already exists in the DB,
        and creates it if it doesn't. Then it creates a location.
        @function
        @return A location object if successful.
    */
    async create(location) {
        const locationInstance = {
            coordinate: {
                type: 'Point',
                coordinates: [location.lat, location.lng],
            },
        };

        try {
            // Gets the location meta data
            const locationData =
                (await helpers.locateFindOrCreate(location)) || {};

            // Append city and route to locationInstance
            locationInstance.city = locationData.city;
            locationInstance.street = locationData.route;
            locationInstance.municipalityId = locationData.municipalityId;

            const res = await db.location.create(locationInstance);
            return res.dataValues;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    /**
     *  @function
     *  @param {Object} filter - Filters like locationIds and municipality
     *  @return array of locations, in form of objects
     */
    async retrieve(filter) {
        // Initialize query
        const query = {};
        // Location Ids filter
        if (filter.id__in && filter.id__in instanceof Array) {
            query.where = {
                id: {
                    [Op.in]: filter.id__in,
                },
            };
        }
        // Municipality filter
        if (filter.municipality) {
            query.where = {
                ...query.where,
                municipalityId: {
                    [Op.like]: filter.municipality,
                },
            };
        }

        try {
            // Get all the stuff
            query.include = [{ all: true }];
            const res = await db.location.findAll(query);
            return res;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    /**
     * @function
     * @param {string} locationId - The id of the location to retrieve
     */
    async retrieveOne(locationId) {
        try {
            const location = await db.location.findByPk(locationId);

            if (location) {
                await location.reload({ include: [{ all: true }] });
            }
            return location;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    /**
     * Retrieves all locations within a distance of a specific point
     * @function
     * @param {Object} filter - Object with filters to filter by
     * @param {Object} point - The location to calculate the distances from. Includes lat and lng values
     * @param {Number} dist  - The max distance to filter by
     */
    async retrieveWithDistance(filter, point, dist) {
        try {
            return await db.sequelize.query(
                'SELECT id, dist FROM (SELECT id, ST_Distance_Sphere(point(ST_Y(coordinate), ST_X(coordinate)), point(?, ?)) as dist FROM locations) AS locations_with_dist WHERE dist < ?  ORDER BY dist;',
                {
                    type: db.sequelize.QueryTypes.SELECT,
                    replacements: [Number(point.lng), Number(point.lat), dist],
                }
            );
        } catch (err) {
            console.error(err);
            return null;
        }
    },

    /**
     * Gets meta-data of a specific location, like municipality, street name and route.
     * @param {Object} param0 - Location object, contains lat and lng.
     * @returns An object of the meta data. Includes 'municipality', 'street', and 'route'.
     */
    async getLocationInfo({ lat, lng }) {
        try {
            // Get location data from Google GeoCoding API
            const location = { lat, lng };
            const locationData =
                (await helpers.locateFindOrCreate(location)) || {};

            return locationData;
        } catch (err) {
            console.error(err);
            return null;
        }
    },
};
