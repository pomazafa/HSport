const Sequelize = require('sequelize');

const {Database, Login, Password, dbconf} = require('../config/config.js');
const ProductModel = require('./Product.js');
const UserModel = require('./User.js');
const OrderModel = require('./Order.js');
const OrderedProductModel = require('./OrderedProduct.js');
const CommentModel = require('./Comment.js');

const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL || `mysql://${Login}:${Password}@localhost:3306/${Database}`);

sequelize.sync({ force: false }).then(() => {
    console.log('sync done');
});

function models(sequelize) {
    var model =  {
        Product: ProductModel(sequelize),
        User: UserModel(sequelize),
        Order: OrderModel(sequelize),
        OrderedProduct: OrderedProductModel(sequelize),
        Comment: CommentModel(sequelize)
    };

    model.Product.belongsToMany(model.User, { through: model.Comment});
    model.User.belongsToMany(model.Product, { through: model.Comment});

    model.User.hasMany(model.Order);
    model.Order.belongsTo(model.User);
    
    model.Product.belongsToMany(model.Order, { through: model.OrderedProduct});
    model.Order.belongsToMany(model.Product, { through: model.OrderedProduct});
    model.OrderedProduct.belongsTo(model.Product);
    model.OrderedProduct.belongsTo(model.Order);
    
    return model;
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