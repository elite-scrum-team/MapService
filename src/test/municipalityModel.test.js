const {
    sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists,
} = require('sequelize-test-helpers');

const locationModel = require('../models/municipality');

describe('src/models/municipality', () => {
    const Model = locationModel(sequelize, dataTypes);
    const instance = new Model();

    // checking if the model is the same instance as the newmodel()
    checkModelName(Model)('municipality');

    context('properties', () => {
        ['id', 'name'].forEach(checkPropertyExists(instance));
    });
});
