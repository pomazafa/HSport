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
                response.render("catalog.hbs", { Products: await Product.findAll(), isAuth: true, isAdmin: true });
            } else {
                response.render("catalog.hbs", { Products: await Product.findAll(), isAuth: true });
            }
        } else {
            response.render("catalog.hbs", { Products: await Product.findAll() });
        }
    } else {
        response.render("catalog.hbs", { Products: await Product.findAll() });
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
                response.render('createProduct.hbs', { errMessage: errMessage, isAuth: true });
                errMessage = "";
                return;
            } else {
                response.redirect('/catalog');
            }
        }
        errMessage = "";
    }
}

exports.addPost = async function(request, response) {
    const pname = request.body.pname;
    const result = await Product.findOne({
        where: {
            productName: pname
        }
    })
    if (result != null) {
        errMessage = "Товар с данным наименованием уже существует.";
        response.redirect('/catalog/add');
    } else {
        const pdescription = request.body.pdescription;
        const pbrand = request.body.pbrand;
        const pprice = request.body.pprice;

        const filedata = request.file;
        if (!filedata)
            console.log("Ошибка при загрузке файла");

        const product = Product.build({
            Name: pname,
            productName: pname,
            productDescription: pdescription,
            brand: pbrand,
            productPrice: pprice
        })
        product.save();

        response.redirect('/catalog/');
    }
}