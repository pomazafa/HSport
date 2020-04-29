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
const crypto = require('crypto');
const makeSalt = require('../public/js/createSalt.js');
var errMessage = null;

exports.index = async function(request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
                where: {
                    id: request.user.id
                }
            })
            .then(result => {
                if (result != null) {
                    if (result.role == 1) {
                        response.render('profile.hbs', {
                            User: result.toJSON(),
                            isAuth: true,
                            isAdmin: true,
                            Title: 'Настройка профиля',
                            errMessage: errMessage
                        })
                    } else {
                        response.render('profile.hbs', {
                            User: result.toJSON(),
                            isAuth: true,
                            Title: 'Настройка профиля',
                            errMessage: errMessage
                        })
                    }
                } else {

                    // страница ошибки

                    response.send('Вы не авторизованы');
                }
            })
    } else {

        // страница ошибки

        response.send('Вы не авторизованы');

    }
};

exports.update = async function(request, response) {
    //const pname = request.body.pname;
}

exports.delete = async function(request, response) {

}