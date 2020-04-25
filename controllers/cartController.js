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

exports.add = async function(request, response) {
    currentProductId = request.query.id;
    //console.log(currentProductId);


    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role != 1) {
                try {
                    
                    //проверить, создан ли у него заказ, и если нет, то создать
            
                    //проверить, что пользователь ещё не добавлял этот товар
            
                    // const orderedProduct = OrderedProduct.build({
                    //     product_id: currentProductId,
                    //     orderId: ??????????????????????????,
                    //     countOfProducts: 1
                    // })
                    // orderedProduct.save();
                    response.send();
                } 
                catch (e) {
                    response.status(500).send({ error: "something wrong" });
                }
            } 
        } else {
            response.status(401).send();
        }
    } else {
        response.status(401).send();
    }
};