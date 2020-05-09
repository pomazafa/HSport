const {
    Product,
    User,
    Order,
    OrderedProduct,
    Comment
} = require('../models/model.js');
const {
    secret
} = require('../config/config.js');
const verifyToken = require('../public/js/func.js');
const getRating = require('../public/js/rating.js');
const jwt = require('jsonwebtoken');
const path = require('path');

var form = null;
var errMessage = null;


exports.index = async function (request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role == 1) {
                const products = await Product.findAll({
                        include: [{
                            model: User
                        }]
                    })
                    .then(products => {
                        getRating(products);
                        response.render('catalog.hbs', {
                            Products: products.map(product => Object.assign(product.toJSON(), {
                                rating: product.rating
                            })),
                            isAuth: true,
                            isAdmin: 'true',
                            Title: 'Каталог'
                        })
                    });
            } else {
                const products = await Product.findAll({
                    include: [{
                            model: User
                        },
                        {
                            model: Order,
                            where: {
                                UserId: request.user.id,
                                orderStatus: 'created'
                            },
                            required: false
                        }
                    ]
                }).then(products => {
                    getRating(products);
                    response.render('catalog.hbs', {
                        Products: products.map(product => Object.assign(product.toJSON(), {
                            rating: product.rating
                        })),
                        Title: 'Каталог',
                        isAuth: true
                    })
                });
            }
        } else {
            const products = await Product.findAll({
                include: [{
                    model: User
                }]
            }).then(products => {
                getRating(products);
                response.render('catalog.hbs', {
                    Title: 'Каталог',
                    Products: products.map(product => Object.assign(product.toJSON(), {
                        rating: product.rating
                    })),
                })
            });
        }
    } else {
        const products = await Product.findAll({
            include: [{
                model: User
            }]
        }).then(products => {
            getRating(products);
            response.render('catalog.hbs', {
                Title: 'Каталог',
                Products: products.map(product => Object.assign(product.toJSON(), {
                    rating: product.rating
                })),
            })
        });
    }
};

exports.add = async function (request, response) {
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
                    submitMessage: "Добавить",
                    submitAction: `/catalog/add`,
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

exports.addPost = async function (request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role == 1) {
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
            response.redirect('/catalog');
        }
        response.redirect('/catalog');
    }
    response.redirect('/catalog');
}

exports.change = async function (request, response) {
    const productId = request.query.id;
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role == 1) {
                if (productId != undefined) {
                    const productToChange = await Product.findOne({
                        where: {
                            id: productId
                        }
                    })
                    if (productToChange != null) {
                        form = {
                            pname: productToChange.productName,
                            pdescription: productToChange.productDescription,
                            pbrand: productToChange.brand,
                            pprice: productToChange.productPrice
                        };
                        response.render('createProduct.hbs', {
                            Title: 'Изменение товара',
                            errMessage: errMessage,
                            isAuth: true,
                            submitMessage: "Изменить",
                            submitAction: `/catalog/change?id=` + productId,
                            form: form
                        });
                        errMessage = "";
                        form = null;
                        return;
                    } else {
                        response.render('message.hbs', {
                            Title: "Ошибка. Товар не найден",
                            message: "Ошибка, товар не найден.",
                            buttonAction: `window.location.href = 'http://localhost:3000/catalog'`,
                            buttonValue: "Вернуться к каталогу"
                        });
                    }
                } else {
                    response.redirect('/catalog');
                }
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


exports.changePost = async function (request, response) {
    const productId = request.query.id;
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role == 1) {
                if (productId != undefined) {
                    const productToChange = await Product.findOne({
                        where: {
                            id: productId
                        }
                    })
                    if (productToChange != null) {
                        const pname = request.body.pname;
                        const pdescription = request.body.pdescription == "" ? null : request.body.pdescription;
                        const pbrand = request.body.pbrand == "" ? null : request.body.pbrand;
                        const pprice = request.body.pprice;

                        const product = await Product.findOne({
                            where: {
                                productName: pname
                            }
                        })
                        if (product != null && pname != productToChange.productName) {
                            form = {
                                pname: pname,
                                pdescription: pdescription,
                                pbrand: pbrand,
                                pprice: pprice
                            };
                            errMessage = "Товар с данным наименованием уже существует.";
                            response.redirect(`/catalog/change?id=` + productId);
                        } else {

                            const filedata = request.file;
                            var fileExt;
                            if (!filedata) {
                                fileExt = productToChange.imageExt;
                            } else {
                                fileExt = path.extname(filedata.originalname);
                            }

                            const values = {
                                productName: pname,
                                productDescription: pdescription,
                                brand: pbrand,
                                productPrice: pprice,
                                imageExt: fileExt
                            };
                            productToChange.update(values);

                            response.redirect('/catalog');
                        }
                    } else {
                        response.render('message.hbs', {
                            Title: "Ошибка. Товар не найден",
                            message: "Ошибка, товар не найден.",
                            buttonAction: `window.location.href = 'http://localhost:3000/catalog'`,
                            buttonValue: "Вернуться к каталогу"
                        });
                    }
                } else {
                    response.redirect('/catalog');
                }
            }
            response.redirect('/catalog');
        }
        response.redirect('/catalog');
    }
    response.redirect('/catalog');
}