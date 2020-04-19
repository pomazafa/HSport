const Sequelize = require('sequelize');

const Model = Sequelize.Model;

module.exports = class Product extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
            product_name: { type: Sequelize.STRING, allowNull: false },
            product_description: { type: Sequelize.STRING, allowNull: true },
            product_price: { type: Sequelize.DOUBLE(7, 2), allowNull: false }
        }, {
            sequelize,
            modelName: 'Product',
            tableName: 'Products',
            timestamps: false
        });
    }
};