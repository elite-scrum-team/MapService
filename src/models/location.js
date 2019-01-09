
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('locations', {
        coordinat: DataTypes.GEOMETRY('POINT'),   
    })
}

