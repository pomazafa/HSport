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
const path = require('path');

var form = null;
var errMessage = null;


exports.index = async function(request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role == 1) {
                const products = await Product.findAll()
                .then(products => {
                    response.render('catalog.hbs', {
                        Products: products.map(product => product.toJSON()),
                        isAuth: true,
                        isAdmin: 'true',
                        Title: 'Каталог'
                    })
                });
            } else {
                const products = await Product.findAll({
                    include: [
                        {
                            model: Order,
                            required: false,
                            where: {
                                UserId: request.user.id,
                                orderStatus: 'created'
                            }
                        },
                        {
                            model: User
                        }
                    ]
                }).then(products => {
                    products.forEach(product => {
                        product.rating = 0;
                        product.Users.forEach((user) => product.rating += user.Comment.rating);
                        if(product.Users.length)
                        {
                            product.rating = Math.round(product.rating / product.Users.length);
                        }
                    })
                    response.render('catalog.hbs', {
                        Products: products.map(product => 
                            {
                                return Object.assign(product.toJSON(), {rating: product.rating});
                            }
                            ),
                        Title: 'Каталог',
                        isAuth: true
                    })
                });
            }
        } else {
            const products = await Product.findAll().then(products => {
                response.render('catalog.hbs', {
                    Title: 'Каталог',
                    Products: products.map(product => product.toJSON())
                })
            });
        }
    } else {
        const products = await Product.findAll().then(products => {
            response.render('catalog.hbs', {
                Title: 'Каталог',
                Products: products.map(product => product.toJSON())
            })
        });
    }
};

exports.add = async function(request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role == 1) {
                response.render('createProduct.hbs', {
                    Title: 'Добавление товара',
                    errMessage: errMessage,
                    isAuth: true,
                    form: form
                });
                errMessage = "";
                form = null;
                return;
            } else {
                response.redirect('/catalog');
            }
        } else {
            response.redirect('/catalog');
        }
    } else {
        response.redirect('/catalog');
    }
}

exports.addPost = async function(request, response) {
    const pname = request.body.pname;
    const pdescription = request.body.pdescription == "" ? null : request.body.pdescription;
    const pbrand = request.body.pbrand == "" ? null : request.body.pbrand;
    const pprice = request.body.pprice;

    const result = await Product.findOne({
        where: {
            productName: pname
        }
    })
    if (result != null) {
        form = {
            pname: pname,
            pdescription: pdescription,
            pbrand: pbrand,
            pprice: pprice
        };
        errMessage = "Товар с данным наименованием уже существует.";
        response.redirect('/catalog/add');
    } else {
        const filedata = request.file;
        var fileExt;
        if (!filedata) {
            fileExt = null;
        } else {
            fileExt = path.extname(filedata.originalname);
        }

        const product = Product.build({
            productName: pname,
            productDescription: pdescription,
            brand: pbrand,
            productPrice: pprice,
            imageExt: fileExt
        })
        product.save();
        response.redirect('/catalog');
    }
}