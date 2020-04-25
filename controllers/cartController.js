const {
    Product,
    User,
    Order,
    OrderedProduct,
    Comment
} = require('../models/model.js');
const { secret } = require('../config/config.js');
const verifyToken = require('../public/js/func.js');
const jwt = require('jsonwebtoken');
var form = null;

var currentProductId = null;

exports.add = function(request, response) {
    currentProductId = request.query.id;
    //console.log(currentProductId);
    try {

    	//проверить, вошёл ли юзер

    	//проверить, создан ли у него заказ, и если нет, то создать

    	//проверить, что пользователь ещё не добавлял этот товар

    	// const orderedProduct = OrderedProduct.build({
     //        product_id: currentProductId,
     //        orderId: ??????????????????????????,
     //        countOfProducts: 1
     //    })
     //    orderedProduct.save();
    	response.send("Success");
    } 
    catch (e) {
        response.status(500).send({ error: "something wrong with database" });
    }
};