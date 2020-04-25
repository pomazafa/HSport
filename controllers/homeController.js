const { secret } = require('../config/config.js');
const verifyToken = require('../public/js/func.js');
const jwt = require('jsonwebtoken');
const {
    Product,
    User,
    Order,
    OrderedProduct,
    Comment
} = require('../models/model.js');


exports.index = async function(request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result != null) {
            if (result.role == 1) {
                response.render('index.hbs', {
                    Title: 'Главная',
                    isAuth: true,
                    isAdmin: true
                })
            } else {
                response.render('index.hbs', {
                    Title: 'Главная',
                    isAuth: true
                })
            }
        } else {
            response.render('index.hbs', {
                    Title: 'Главная'
            })
        }
    } else {
        response.render('index.hbs', {
                    Title: 'Главная'
        })
    }
};