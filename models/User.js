const Sequelize = require('sequelize');

const Model = Sequelize.Model;

module.export = class User extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
            Surname: { type: Sequelize.STRING, allowNull: true },
            Name: { type: Sequelize.STRING, allowNull: true },
            Phone: { type: Sequelize.STRING, allowNull: true },
            Mail: { type: Sequelize.STRING, allowNull: false },
            Password: { type: Sequelize.STRING, allowNull: false },
            Status: { type: Sequelize.STRING, allowNull: false }
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'User',
            timestamps: false
        });
    }
};