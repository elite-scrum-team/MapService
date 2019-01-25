const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * Municipality Controller
 * @module controllers/MunicipalityController
 */
module.exports = {
    /**
     * Retrieves all municipalities in the DB, one optionally retrieves one municipality by name.
     * @param {Object} query - A query object that optionally contains a name-filter.
     */
    async retrieve(query) {
        try {
            const where = {};

            // Add name filter
            if (query.name) {
                where.name = query.name;
            }

            // Get municipality
            const res = await db.municipality.findAll({
                order: [['name', 'ASC']],
                where,
            });
            return res;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    /**
     * Retrieves one
     * @param {string} id - The id of the municipality
     */
    async retrieveOne(id) {
        try {
            const res = await db.municipality.findByPk(id);
            return res;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
};
