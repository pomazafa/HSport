const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    const Product = sequelize.define('Product', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
        productName: { type: Sequelize.STRING, allowNull: false, unique: true },
        productDescription: { type: Sequelize.STRING, allowNull: true },
        brand: { type: Sequelize.STRING, allowNull: true },
        productPrice: { type: Sequelize.DOUBLE(7, 2), allowNull: false, validate: { min: 0.01 } },
        imageUrl: { type: Sequelize.STRING, allowNull: true }
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'Products',
        timestamps: false,
    });
    return Product;
}