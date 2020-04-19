const Sequelize = require('sequelize');
const Product = require('./Product.js');
const User = require('./User.js');

const Model = Sequelize.Model;

module.exports = class Comment extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
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
            comment_date: { type: Sequelize.DATE, allowNull: false },
            rating: { type: Sequelize.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
            message: { type: Sequelize.STRING, allowNull: true }
        }, {
            sequelize,
            modelName: 'Comment',
            tableName: 'Comments',
            timestamps: false
        });
    }
};