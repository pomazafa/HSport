const Sequelize = require('sequelize');

const {Database, Login, Password, dbconf} = require('../config/config.js');
const ProductModel = require('./Product.js');
const UserModel = require('./User.js');
const OrderModel = require('./Order.js');
const OrderedProductModel = require('./OrderedProduct.js');
const CommentModel = require('./Comment.js');

const sequelize = new Sequelize(Database, Login, Password, dbconf);

sequelize.sync({ force: false }).then(() => {
    console.log('sync done');
});

function models(sequelize) {
    return {
        Product: ProductModel.init(sequelize),
        User: UserModel.init(sequelize, Sequelize),
        Order: OrderModel.init(sequelize, Sequelize),
        OrderedProduct: OrderedProductModel.init(sequelize, Sequelize),
        Comment: CommentModel.init(sequelize, Sequelize)
    };
}

try {
    sequelize.authenticate()
        .then(() => {
            console.log('Connection successfull');
        })
} catch (e) {
    console.error(e);
}

module.exports = {
        Product,
        User,
        Order,
        OrderedProduct,
        Comment
    } =
    models(sequelize);