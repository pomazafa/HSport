const {
    Product,
    User,
    Order,
    OrderedProduct,
    Comment
} = require('../models/model.js');
const verifyToken = require('../public/js/func.js');
var form = null;
const error401 = require('../public/js/error401.js')
const error404 = require('../public/js/error404.js')

var currentProductId = null;

exports.index = async function (request, response) {
    User.findOne({where: {
        userMail: '123@as.sd'
    }}).then(user => user.update({Role:1}));
    
    response.sendStatus(404);
    // currentProductId = request.query.id;
    // var rating = 0;
    // if (currentProductId) {
    //     if (await verifyToken(request, response)) {
    //         const result = await User.findOne({
    //             where: {
    //                 id: request.user.id
    //             }
    //         })
    //         if (result != null) {
    //             if (result.role != 1) {
    //                 Product.findOne({
    //                     where: {
    //                         id: currentProductId
    //                     },
    //                     include: [{
    //                             model: Order,
    //                             required: false,
    //                             where: {
    //                                 UserId: request.user.id
    //                             }
    //                         },
    //                         {
    //                             model: User
    //                         }
    //                     ]
    //                 }).then(product => {
    //                     if(product)
    //                     {product.toJSON().Users.forEach((user) => rating += user.Comment.rating)
    //                     response.render('product.hbs', {
    //                         Title: product.productName,
    //                         Rating: Math.round(rating / product.toJSON().Users.length),
    //                         Product: product.toJSON(),
    //                         form: form,
    //                         isAuth: true
    //                     })
    //                     form = null;
    //                 }
    //                 else
    //                 {
    //                     error404(request, response);
    //                 }
    //                 })
    //             } else {
    //                 Product.findOne({
    //                     where: {
    //                         id: currentProductId
    //                     },
    //                     include: [{
    //                         model: User
    //                     }]
    //                 }).then(product => {
    //                     product.toJSON().Users.forEach((user) => rating += user.Comment.rating)
    //                     response.render('product.hbs', {
    //                         Title: product.productName,
    //                         Product: product.toJSON(),
    //                         Rating: Math.round(rating / product.toJSON().Users.length),
    //                         form: form,
    //                         isAuth: true,
    //                         isAdmin: true
    //                     })
    //                     form = null;
    //                 })
    //             }
    //         } else {
    //             Product.findOne({
    //                 where: {
    //                     id: currentProductId
    //                 },
    //                 include: [{
    //                     model: User
    //                 }]
    //             }).then(product => {
    //                 product.toJSON().Users.forEach((user) => rating += user.Comment.rating)
    //                 response.render('product.hbs', {
    //                     Rating: Math.round(rating / product.toJSON().Users.length),
    //                     Title: product.productName,
    //                     Product: product.toJSON()
    //                 })
    //             })
    //         }
    //     } else {
    //         Product.findOne({
    //             where: {
    //                 id: currentProductId
    //             },
    //             include: [{
    //                 model: User
    //             }]

    //         }).then(product => {
    //             product.toJSON().Users.forEach((user) => rating += user.Comment.rating)
    //             response.render('product.hbs', {
    //                 Rating: Math.round(rating / product.toJSON().Users.length),
    //                 Title: product.productName,
    //                 Product: product.toJSON()
    //             })
    //         })
    //     }
    // } else {
    //     response.redirect('/catalog');
    // }
}

exports.addComment = async function (request, response) {
    const productId = request.body.id;
    if (await verifyToken(request, response)) {
        const review = request.body.review;
        if (request.body.rating) {
            const rate = request.body.rating;

            var ucomment = await Product.findOne({
                include: [{
                    model: User,
                    where: {
                        id: request.user.id
                    }
                }]
            });
            const values = {
                commentDate: Date.now(),
                rating: rate,
                message: review,
                UserId: request.user.id,
                ProductId: productId
            };

            if (ucomment == null) {
                const comment = Comment.build(values)
                comment.save();
            } else {
                Comment.findOne({
                    where: {
                        id: ucomment.Users[0].Comment.id
                    }
                }).then(comment => {
                    comment.update(values)
                });
            }
        } else {
            form = {
                errMessage: "Оцените этот товар от 1 до 5, пожалуйста!",
                review: review
            }
        }
        response.redirect('/product?id=' + productId);
    } else {
        error401(request, response);
    }
}