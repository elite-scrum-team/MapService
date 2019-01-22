const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    async retrieve(query) {
        try {
            const where = {};

            // Add name filter
            if (query.name) {
                where.name = query.name;
            }

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
