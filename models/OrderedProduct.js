const Sequelize = require('sequelize');
const Product = require('./Product.js');
const Order = require('./Order.js');

const Model = Sequelize.Model;

module.exports = class OrderedProduct extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
            productId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: Product, key: 'id' }
            },
            orderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: Order, key: 'id' }
            },
            countOfProducts: { type: Sequelize.INTEGER, allowNull: false }
        }, {
            sequelize,
            modelName: 'OrderedProduct',
            tableName: 'OrderedProducts',
            timestamps: false
        });
    }
};