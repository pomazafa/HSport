const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    const User = sequelize.define('User', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
        surname: { type: Sequelize.STRING, allowNull: true },
        name: { type: Sequelize.STRING, allowNull: true },
        phone: { type: Sequelize.STRING, allowNull: true },
        mail: { type: Sequelize.STRING, allowNull: false, unique: true },
        password: { type: Sequelize.STRING, allowNull: false },
        passwordSalt: { type: Sequelize.STRING, allowNull: false },
        status: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 0, max: 1 } },
        role: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 0, max: 1 } }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        timestamps: false
    });
    return User;
}