const Sequelize = require('sequelize');

const Model = Sequelize.Model;

module.export = class Ordered_product extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
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
            modelName: 'Ordered_product',
            tableName: 'Ordered_product',
            timestamps: false
        });
    }
};