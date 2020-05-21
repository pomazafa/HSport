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
const error404 = require('../public/js/error404.js');
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
                if (result.status == 0) {
                    response.redirect('/profile/deleted');
                    return
                }
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
                            isAuth: true,
                            buttonAction: "completeOrder(this)",
                            buttonValue: "Подтвердить заказ"
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
            if (result.status == 0) {
                response.redirect('/profile/deleted');
                return
            }
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
            if (result.status == 0) {
                response.redirect('/profile/deleted');
                return
            }
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
            if (result.status == 0) {
                response.redirect('/profile/deleted');
                return
            }
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
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.status == 0) {
                response.redirect('/profile/deleted');
                return
            }
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

exports.orders = async function (request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.status == 0) {
                response.redirect('/profile/deleted');
                return;
            }
            if (result.role != 1) {
                Order.findAll({
                    where: {
                        UserId: request.user.id
                    },
                    include: [{
                        model: Product
                    }, {
                        model: User
                    }]
                }).then(orders => {
                    if (orders.length != 0) {
                        getPrice(orders)
                        response.render('orders.hbs', {
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
                Order.findAll({
                    include: [{
                            model: Product
                        },
                        {
                            model: User
                        }
                    ]
                }).then(orders => {
                    if (orders.length != 0) {
                        getPrice(orders)
                        response.render('orders.hbs', {
                            Title: 'Все заказы',
                            Orders: orders.map(order => Object.assign(order.toJSON(), {
                                sumPrice: order.orderPrice
                            })),
                            isAuth: true,
                            isAdmin: true
                        })
                    } else {
                        response.render('message.hbs', {
                            Title: 'Все заказы',
                            message: "Ни одного заказа нет",
                            buttonAction: "window.location.href = '/catalog'",
                            buttonValue: "К каталогу",
                            isAuth: true,
                            isAdmin: true
                        });
                    }
                })
            }
        } else {
            error401(request, response);
        }
    } else {
        error401(request, response);
    }
}

exports.cart = async function (request, response) {
    const orderId = request.params.id;
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.status == 0) {
                response.redirect('/profile/deleted');
                return
            }
            if (result.role == 0) {
                Product.findAll({
                    include: [{
                        model: Order,
                        where: {
                            UserId: result.id,
                            id: orderId
                        }
                    }, {
                        model: User
                    }]
                }).then(products => {
                    if (products.length != 0) {
                        if (products[0].Orders[0].orderStatus == 'created') {
                            response.redirect('/cart');
                            return;
                        }
                        getRating(products)
                        response.render('cart.hbs', {
                            Title: 'Заказ',
                            Products: products.map(product => Object.assign(product.toJSON(), {
                                rating: product.rating
                            })),
                            isAuth: true,
                            buttonAction: "window.location.href = '/cart/orders'",
                            buttonValue: "Вернуться"
                        })
                    } else {
                        response.render('message.hbs', {
                            Title: 'Ошибка',
                            message: "Информации о заказе нет",
                            buttonAction: "window.location.href = '/cart/orders'",
                            buttonValue: "Вернуться к заказам",
                            isAuth: true
                        });
                    }
                })
            } else {
                Product.findAll({
                    include: [{
                        model: Order,
                        where: {
                            id: orderId
                        }
                    }]
                }).then(products => {
                    if (products.length != 0) {
                        getRating(products)

                        if (products[0].Orders[0].orderStatus == 'being processed') {

                            response.render('cart.hbs', {
                                Title: 'Заказ',
                                Products: products.map(product => Object.assign(product.toJSON(), {
                                    rating: product.rating
                                })),
                                isAuth: true,
                                isAdmin: true,
                                buttonAction: (`window.location.href = '/cart/ready/${orderId}'`),
                                buttonValue: "Готов к самовывозу"
                            })
                        } else {
                            if (products[0].Orders[0].orderStatus == 'pickup') {

                                response.render('cart.hbs', {
                                    Title: 'Заказ',
                                    Products: products.map(product => Object.assign(product.toJSON(), {
                                        rating: product.rating
                                    })),
                                    isAuth: true,
                                    isAdmin: true,
                                    buttonAction: (`window.location.href = '/cart/done/${orderId}'`),
                                    buttonValue: "Завершить заказ"
                                })
                            }
                            else 
                            {
                                response.render('cart.hbs', {
                                    Title: 'Заказ',
                                    Products: products.map(product => Object.assign(product.toJSON(), {
                                        rating: product.rating
                                    })),
                                    isAuth: true,
                                    isAdmin: true,
                                    buttonAction: (`window.location.href = '/cart/orders'`),
                                    buttonValue: "Вернуться"
                                })
                            }
                        }
                    } else {
                        response.render('message.hbs', {
                            Title: 'Ошибка',
                            message: "Информации о заказе нет",
                            buttonAction: "window.location.href = '/cart/orders'",
                            buttonValue: "К заказам",
                            isAuth: true,
                            isAdmin: true
                        });
                    }
                })
            }
        } else {
            error401(request, response);
        }
    } else {
        error401(request, response);
    }
}

exports.ready = async function (request, response) {
    const orderId = request.params.id;
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.status == 0) {
                response.redirect('/profile/deleted');
                return
            }
            if(result.role == 1)
            {
                Order.findOne({
                    where: {
                        id: orderId
                    }
                }).then(order => {
                    if(order){
                        order.update(
                            {
                                orderStatus: 'pickup',
                                orderDate: new Date()
                            }
                        )
                        response.redirect('/cart/orders');
                    }
                    else{
                        response.render('message.hbs', {
                            Title: 'Ошибка',
                            message: "Произошла ошибка при обновлении статуса заказа. Попробуйте позже",
                            buttonAction: "window.location.href = '/cart/orders'",
                            buttonValue: "Вернуться",
                            isAuth: true,
                            isAdmin: true
                        });
                    }
                })
            }
            else
            {
                error404(request, response);
            }
        } else {
            error401(request, response);
        }
    } else {
        error401(request, response);
    }
}

exports.done = async function (request, response) {
    const orderId = request.params.id;
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.status == 0) {
                response.redirect('/profile/deleted');
                return
            }
            if(result.role == 1)
            {
                Order.findOne({
                    where: {
                        id: orderId
                    }
                }).then(order => {
                    if(order){
                        order.update(
                            {
                                orderStatus: 'processed',
                                orderDate: new Date()
                            }
                        )
                        response.redirect('/cart/orders');
                    }
                    else{
                        response.render('message.hbs', {
                            Title: 'Ошибка',
                            message: "Произошла ошибка при обновлении статуса заказа. Попробуйте позже",
                            buttonAction: "window.location.href = '/cart/orders'",
                            buttonValue: "Вернуться",
                            isAuth: true,
                            isAdmin: true
                        });
                    }
                })
            }
            else
            {
                error404(request, response);
            }
        } else {
            error401(request, response);
        }
    } else {
        error401(request, response);
    }
}