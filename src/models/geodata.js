const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Geodata = sequelize.define('geodata', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
        },
        raw: DataTypes.JSON,
    });

    return Geodata;
};
