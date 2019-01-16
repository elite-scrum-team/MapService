const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const GeoCodingAPI = require('../services/GeoCodingAPI');

module.exports = {
    async create(location) {
        const locationInstance = {
            coordinate: {
                type: 'Point',
                coordinates: [location.lat, location.lng],
            },
        };

        try {
            const r = await GeoCodingAPI.geodata.retrieve(location);
            const result = await r.json();

            // Get municipality name from location
            const locationData =
                (await GeoCodingAPI.convert.toLocationData(result)) || {};
            const municipalityName = locationData.municipality;

            console.log('Kommune: ', municipalityName);

            // Append city and route to locationInstance
            locationInstance.city = locationData.city;
            locationInstance.street = locationData.route;

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
                console.log(
                    municipalityName + ' does not exist, adds it to db'
                );
                const model = await db.municipality.create({
                    name: municipalityName,
                });
                if (model)
                    // dette er for å sjekke om modellen eksisterer. trenger denne til testingen
                    locationInstance.municipalityId = model.id;
            } else {
                // If it exists, use its id in the location instance
                console.log(
                    municipalityName + ' already exists, appends it to instance'
                );
                locationInstance.municipalityId = municipality.id;
            }

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

        try {
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
};

// FUTURE SQL queries

/*
Check if a point in locations are within a given circle (buffer) with radius 3
SELECT * FROM locations as l WHERE ST_WITHIN(l.coordinate, ST_Buffer(ST_GeomFromText('POINT(63.428275 10.393464)'), 3));

Calculates the distance of given points
SELECT ST_Distance_Sphere(locations.coordinate, ST_GeomFromText('POINT(63.428275 10.393464)')) from locations; */
