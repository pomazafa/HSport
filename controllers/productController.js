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
    var rating = 0;
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
                        product.toJSON().Users.forEach((user) => rating += user.Comment.rating)
                        response.render('product.hbs', {
                            Title: product.productName,
                            Rating: Math.round(rating / product.toJSON().Users.length),
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
                        product.toJSON().Users.forEach((user) => rating += user.Comment.rating)
                        response.render('product.hbs', {
                            Title: product.productName,
                            Product: product.toJSON(),
                            Rating: Math.round(rating / product.toJSON().Users.length),
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
                    product.toJSON().Users.forEach((user) => rating += user.Comment.rating)
                    response.render('product.hbs', {
                        Rating: Math.round(rating / product.toJSON().Users.length),
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
                    product.toJSON().Users.forEach((user) => rating += user.Comment.rating)
                    response.render('product.hbs', {
                        Rating: Math.round(rating / product.toJSON().Users.length),
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

exports.addComment = async function(request, response) {
    const productId = request.body.id;
    if (await verifyToken(request, response)) {
    const review = request.body.review;
    const rate = 1;

    const comment = Comment.build({
        commentDate: Date.now(),
        rating: rate,
        message: review,
        UserId: request.user.id,
        ProductId: productId
    })
    comment.save();
    response.redirect('/product?id=' + productId);
}
else{
    response.redirect('/entry/exit');
}
}
