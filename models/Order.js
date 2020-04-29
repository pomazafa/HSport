const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    const Order = sequelize.define('Order', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
        orderStatus: { type: Sequelize.STRING, allowNull: false }
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'Orders',
        timestamps: false
    });
    return Order;
}