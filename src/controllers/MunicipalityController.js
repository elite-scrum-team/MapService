const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    async retrieve() {
        try {
            const res = await db.municipality.findAll();
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
