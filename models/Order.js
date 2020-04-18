const Sequelize = require('sequelize');

const Model = Sequelize.Model;

module.export = class Order extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
            order_status: { type: Sequelize.STRING, allowNull: false },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: User, key: 'id' }
            }
        }, {
            sequelize,
            modelName: 'Order',
            tableName: 'Order',
            timestamps: false
        });
    }
};