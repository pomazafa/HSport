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

exports.index = async function(request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role != 1) {
                const products = await OrderedProduct.findAll({
                    include: [{
                        model: Order,
                        where: { UserId: request.user.id, orderStatus: 'created'} 
                    }, {
                        model: Product
                    }]
                }).then(products => {
                    response.render('cart.hbs', {
                        Title: 'Корзина',
                        Products: products.map(product => product.toJSON()),
                        isAuth: true
                    })
                })
            } else {
                response.send('Вы зашли под записью администратора, Вам недоступна функция')


                // сделать красивую страничку


            }
        } else {
            response.redirect('/entry/exit');
        }
    } else {
        response.redirect('/entry/exit');
    }
}

exports.add = async function(request, response) {
    currentProductId = request.query.id;
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
                            UserId: request.user.id,
                            orderStatus: 'created'
                        }
                    })
                    if (order == null) {
                        order = await Order.create({
                            orderStatus: 'created',
                            UserId: request.user.id
                        });
                    }

                    var orderedProduct = await OrderedProduct.findOne({
                        where: {
                            OrderId: order.id,
                            ProductId: +currentProductId
                        }
                    });

                    if (orderedProduct == null) {
                        orderedProduct = OrderedProduct.create({
                            ProductId: +currentProductId,
                            OrderId: order.id,
                            countOfProducts: 1
                        })
                    }

                    response.status(201).send();
                } catch (e) {
                    console.log(e);
                    response.status(520).send({ error: "something wrong" });
                }
            } else {
                response.status(403).send();
            }
        } else {
            response.status(401).send();
        }
    } else {
        response.status(401).send();
    }
};

exports.remove = async function(request, response) {
    currentProductId = request.query.id;
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
                            UserId: request.user.id,
                            orderStatus: 'created'
                        }
                    })
                    if (order == null) {
                        response.status(500).send();
                    }

                    OrderedProduct.destroy({
                        where: {
                            OrderId: order.id,
                            ProductId: +currentProductId
                        }
                    });

                    response.status(201).send();
                } catch (e) {
                    console.log(e);
                    response.status(520).send({ error: "something wrong" });
                }
            } else {
                response.status(403).send();
            }
        } else {
            response.status(401).send();
        }
    } else {
        response.status(401).send();
    }
}