const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define('location', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
        },
        coordinate: DataTypes.GEOMETRY('POINT'),
    });

    Location.associate = models => {
        Location.belongsTo(models.municipality);
    };

    return Location;
};
