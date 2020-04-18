const Sequelize = require('sequelize');

const Model = Sequelize.Model;

module.export = class Comment extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: Product, key: 'id' }
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: User, key: 'id' }
            },
            comment_date: { type: Sequelize.Date, allowNull: false },
            rating: { type: Sequelize.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
            message: { type: Sequelize.STRING, allowNull: true }
        }, {
            sequelize,
            modelName: 'Comment',
            tableName: 'Comment',
            timestamps: false
        });
    }
};