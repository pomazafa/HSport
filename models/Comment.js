const { Sequelize } = require('sequelize');

module.exports = function(sequelize) {
    const Comment = sequelize.define('Comment', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
        commentDate: { type: Sequelize.DATE, allowNull: false },
        rating: { type: Sequelize.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
        message: { type: Sequelize.STRING, allowNull: true }
    }, {
        sequelize,
        modelName: 'Comment',
        tableName: 'Comments',
        timestamps: false
    });
    return Comment;
}