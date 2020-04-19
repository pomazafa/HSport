const Sequelize = require('sequelize');
const Product = require('./Product.js');
const Order = require('./Order.js');

const Model = Sequelize.Model;

module.exports = class OrderedProduct extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: Product, key: 'id' }
            },
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: Order, key: 'id' }
            },
            count_of_products: { type: Sequelize.INTEGER, allowNull: false }
        }, {
            sequelize,
            modelName: 'OrderedProduct',
            tableName: 'OrderedProducts',
            timestamps: false
        });
    }
};