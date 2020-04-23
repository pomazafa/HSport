const Sequelize = require('sequelize');

const Model = Sequelize.Model;

module.exports = class Product extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
            productName: { type: Sequelize.STRING, allowNull: false, unique: true },
            productDescription: { type: Sequelize.STRING, allowNull: true },
            brand: {type: Sequelize.STRING, allowNull:true},
            productPrice: { type: Sequelize.DOUBLE(7, 2), allowNull: false,  validate: { min: 0.01} }
        }, {
            sequelize,
            modelName: 'Product',
            tableName: 'Products',
            timestamps: false
        });
    }
};