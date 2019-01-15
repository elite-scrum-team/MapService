//Unit-Testing a Model’s Name and Properties

const {
    sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists,
} = require('sequelize-test-helpers');

const locationModel = require('../models/location');

describe('src/models/location', () => {
    const Model = locationModel(sequelize, dataTypes);
    const instance = new Model();

    // checking if the model is the same instance as the newmodel()
    checkModelName(Model)('location');

    context('properties', () => {
        ['id', 'coordinate'].forEach(checkPropertyExists(instance));
    });
});
