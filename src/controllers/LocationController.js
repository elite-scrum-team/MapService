const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    async create(location) {
        const locationInstance = {
            coordinate: {
                type: 'Point',
                coordinates: [location.lat, location.lng],
            },
        };

        try {
            const res = await db.location.create(locationInstance);
            return res.dataValues;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    async retrieve(filter) {
        const id__in = filter.id__in;

        // Initialize query
        const query = {};
        if (filter.id__in) {
            query.where = {
                id: {
                    [Op.in]: filter.id__in,
                },
            };
        }

        try {
            const res = await db.location.findAll(query);
            return res.dataValues;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    async retrieveOne(locationId) {
        try {
            const location = await db.location.findByPk(locationId);
            return location;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
};

// FUTURE SQL queries

/* 
Check if a point in locations are within a given circle (buffer) with radius 3
SELECT * FROM locations as l WHERE ST_WITHIN(l.coordinate, ST_Buffer(ST_GeomFromText('POINT(63.428275 10.393464)'), 3));

Calculates the distance of given points
SELECT ST_Distance_Sphere(locations.coordinate, ST_GeomFromText('POINT(63.428275 10.393464)')) from locations; */
