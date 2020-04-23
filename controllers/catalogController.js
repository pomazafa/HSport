const {
    Product,
    User,
    Order,
    OrderedProduct,
    Comment
} = require('../models/model.js');


exports.index = async function(request, response) {
    response.render("catalog.hbs", {Products: await Product.findAll()});
};

exports.add = async function(request, response) { 
	response.render('createProduct.hbs');
}