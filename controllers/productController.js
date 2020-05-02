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

var currentProductId = null;

exports.index = async function(request, response) {
    currentProductId = request.query.id;
    if (currentProductId) {
        if (await verifyToken(request, response)) {
            const result = await User.findOne({
                where: {
                    id: request.user.id
                }
            })
            if (result != null) {
                if (result.role != 1) {
                    const products = Product.findOne({
                        where: { id: currentProductId },
                        include: [{
                                model: Order,
                                required: false,
                                where: {
                                    UserId: request.user.id
                                }
                            },
                            {
                                model: User
                            }
                        ]
                    }).then(product => {
                        response.render('product.hbs', {
                            Title: product.productName,
                            Product: product.toJSON(),
                            isAuth: true
                        })
                    })
                } else {
                    const products = Product.findOne({
                        where: { id: currentProductId },
                        include: [
                            {
                                model: User
                            }
                        ]
                    }).then(product => {
                        response.render('product.hbs', {
                            Title: product.productName,
                            Product: product.toJSON(),
                            isAuth: true,
                            isAdmin: true
                        })
                    })
                }
            } else {
                const products = Product.findOne({
                    where: { id: currentProductId },
                    include: [
                        {
                            model: User
                        }
                    ]
                }).then(product => {
                    response.render('product.hbs', {
                        Title: product.productName,
                        Product: product.toJSON()
                    })
                })
            }
        } else {
            const products = Product.findOne({
                    where: { id: currentProductId },
                    include: [
                        {
                            model: User
                        }
                    ]
                }).then(product => {
                    response.render('product.hbs', {
                        Title: product.productName,
                        Product: product.toJSON()
                    })
                })
        }
    }
    else
    {
        response.redirect('/catalog');
    }
}