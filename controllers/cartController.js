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
                    var order = await Order.findOne({
                        where: {
                            userId: request.user.id,
                            orderStatus: 'created'
                        }
                    })
                    if(order == null)
                    {
                        order = await Order.create({
                            orderStatus: 'created',
                            userId: request.user.id
                        });
                    }
                    
                    var orderedProduct = await OrderedProduct.findOne({
                        where: {
                            orderId: order.id,
                            productId: +currentProductId
                        }
                    });

                    if(orderedProduct == null)
                    {
                        orderedProduct = OrderedProduct.create({
                        productId: +currentProductId,
                        orderId: order.id,
                        countOfProducts: 1
                        })
                    }

                    response.status(201).send();
                } 
                catch (e) {
                    console.log(e);
                    response.status(520).send({ error: "something wrong" });
                }
            } 
            else
            {
                response.status(403).send();
            }
        } else {
            response.status(401).send();
        }
    } else {
        response.status(401).send();
    }
};