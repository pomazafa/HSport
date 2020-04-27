const Product = require('./Product.js');
const Order = require('./Order.js');
const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    const OrderedProduct = sequelize.define('OrderedProduct', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
        countOfProducts: { type: Sequelize.INTEGER, allowNull: false }
    }, {
        sequelize,
        modelName: 'OrderedProduct',
        tableName: 'OrderedProducts',
        timestamps: false
    });
    return OrderedProduct;
}