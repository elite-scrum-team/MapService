const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const GeoCodingAPI = require('../services/GeoCodingAPI');
const helpers = require('../utils/helpers');

module.exports = {
    async create(location) {
        const locationInstance = {
            coordinate: {
                type: 'Point',
                coordinates: [location.lat, location.lng],
            },
        };

        try {
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

    async retrieve(filter) {
        // Initialize query
        const query = {};
        if (filter.id__in && filter.id__in instanceof Array) {
            query.where = {
                id: {
                    [Op.in]: filter.id__in,
                },
            };
        }
        if (filter.municipality) {
            query.where = {
                ...query.where,
                municipalityId: {
                    [Op.like]: filter.municipality,
                },
            };
        }

        try {
            query.include = [{ all: true }];
            const res = await db.location.findAll(query);
            return res;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

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
