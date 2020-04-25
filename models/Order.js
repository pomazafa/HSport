const Sequelize = require('sequelize');
const User = require('./User.js');

const Model = Sequelize.Model;

module.exports = class Order extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
            orderStatus: { type: Sequelize.STRING, allowNull: false },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: User, key: 'id' }
            }
        }, {
            sequelize,
            modelName: 'Order',
            tableName: 'Orders',
            timestamps: false
        });
    }
};