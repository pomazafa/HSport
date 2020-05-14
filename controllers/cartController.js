const {
    Product,
    User,
    Order,
    OrderedProduct
} = require('../models/model.js');
const verifyToken = require('../public/js/func.js');
const getRating = require('../public/js/rating.js');
const getPrice = require('../public/js/price.js');
var form = null;
const error401 = require('../public/js/error401.js');
const errorAdmin = require('../public/js/errorAdmin.js');

var currentProductId = null;

exports.index = async function (request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role != 1) {
                Product.findAll({
                    include: [{
                        model: Order,
                        where: {
                            UserId: request.user.id,
                            orderStatus: 'created'
                        }
                    }, {
                        model: User
                    }]
                }).then(products => {
                    if (products.length != 0) {
                        getRating(products)
                        response.render('cart.hbs', {
                            Title: 'Корзина',
                            Products: products.map(product => Object.assign(product.toJSON(), {
                                rating: product.rating
                            })),
                            isAuth: true
                        })
                    } else {
                        response.render('message.hbs', {
                            Title: 'Корзина',
                            message: "Корзина пуста",
                            buttonAction: "window.location.href = '/catalog'",
                            buttonValue: "К каталогу",
                            isAuth: true
                        });
                    }
                })
            } else {
                errorAdmin(request, response);
            }
        } else {
            error401(request, response);

        }
    } else {
        error401(request, response);

    }
}

exports.add = async function (request, response) {
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
                            UserId: request.user.id,
                            orderDate: new Date()
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
                    response.status(520).send({
                        error: "something wrong"
                    });
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

exports.remove = async function (request, response) {
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
                    response.status(520).send({
                        error: "something wrong"
                    });
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

exports.increase = async function (request, response) {
    currentProductId = request.query.id;
    console.log(currentProductId)
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

                    OrderedProduct.findOne({
                            where: {
                                OrderId: order.id,
                                ProductId: +currentProductId
                            }
                        })
                        .then(orderedProduct => {
                            let values = {
                                countOfProducts: (orderedProduct.countOfProducts + 1)
                            }

                            orderedProduct.update(values);

                        })

                    response.status(200).send();
                } catch (e) {
                    console.log(e);
                    response.status(520).send({
                        error: "something wrong"
                    });
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

exports.decrease = async function (request, response) {
    currentProductId = request.query.id;
    console.log(currentProductId)
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

                    OrderedProduct.findOne({
                            where: {
                                OrderId: order.id,
                                ProductId: +currentProductId
                            }
                        })
                        .then(orderedProduct => {

                            if (orderedProduct.countOfProducts > 1) {
                                let values = {
                                    countOfProducts: (orderedProduct.countOfProducts - 1)
                                }

                                orderedProduct.update(values);
                            } else {
                                OrderedProduct.destroy({
                                    where: {
                                        id: orderedProduct.id
                                    }
                                });
                            }
                        })

                    response.status(200).send();
                } catch (e) {
                    console.log(e);
                    response.status(520).send({
                        error: "something wrong"
                    });
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

exports.complete = async function (request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role != 1) {
                const order = await Order.findOne({
                    where: {
                        UserId: request.user.id,
                        orderStatus: 'created'
                    }
                })
                if (order == null) {
                    response.status(500).send();
                    return;
                } else {
                    const values = {
                        orderStatus: 'being processed',
                        orderDate: new Date()
                    }
                    order.update(values);
                }
                response.status(200).send();
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

exports.carts = async function (request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role != 1) {
                Order.findAll({
                    where: {
                        UserId: request.user.id
                    },
                    include: [
                        {
                            model: Product
                        }
                    ]
                }).then(orders => {
                    if (orders.length != 0) {
                        getPrice(orders)
                        response.render('carts.hbs', {
                            Title: 'Мои заказы',
                            Orders: orders.map(order => Object.assign(order.toJSON(), {
                                sumPrice: order.orderPrice
                            })),
                            isAuth: true
                        })
                    } else {
                        response.render('message.hbs', {
                            Title: 'Мои заказы',
                            message: "У Вас нет ни одного заказа.",
                            buttonAction: "window.location.href = '/catalog'",
                            buttonValue: "К каталогу",
                            isAuth: true
                        });
                    }
                })
            } else {
                errorAdmin(request, response);
            }
        } else {
            error401(request, response);
        }
    } else {
        error401(request, response);
    }
}