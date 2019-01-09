
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('municipality', {
        name: DataTypes.STRING,
    })
}

