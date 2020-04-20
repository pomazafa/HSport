const Sequelize = require('sequelize');

const ProductModel = require('./Product.js');
const UserModel = require('./User.js');
const OrderModel = require('./Order.js');
const OrderedProductModel = require('./OrderedProduct.js');
const CommentModel = require('./Comment.js');

module.exports = function models(sequelize) {
  return {
    Product: ProductModel.init(sequelize),
	User: UserModel.init(sequelize, Sequelize),
	Order: OrderModel.init(sequelize, Sequelize),
	OrderedProduct: OrderedProductModel.init(sequelize, Sequelize),
	Comment: CommentModel.init(sequelize, Sequelize)
  };
}
