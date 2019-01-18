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
            const result = await GeoCodingAPI.geodata.retrieve(location);

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
                    //Checking if model exists
                    locationInstance.municipalityId = model.id;
            } else if (municipality) {
                // If it exists, use its id in the location instance
                console.log(
                    municipalityName + ' already exists, appends it to instance'
                );
                locationInstance.municipalityId = municipality.id;
            }

            // Insert raw GeoData into the database
            /*  if(result) {
                await db.geodata.create({raw: result.results});
            } */

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
            return await sequelize.query(
                'SELECT id, dist FROM (SELECT id, ST_Distance_Sphere(coordinate, point(?, ?)) as dist FROM locations) AS locations_with_dist WHERE dist < ?;',
                {
                    type: db.sequelize.QueryTypes.SELECT,
                    replacements: [point.lat, point.lng, dist],
                }
            );
        } catch (err) {
            console.error(err);
            return null;
        }
    },
};
