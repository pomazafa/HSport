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
var Message = null;

exports.index = async function(request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
                where: {
                    id: request.user.id
                }
            })
            .then(result => {
                if (result != null) {
                    if (result.status == 1) {

                        if (result.role == 1) {
                            response.render('profile.hbs', {
                                User: result.toJSON(),
                                isAuth: true,
                                isAdmin: true,
                                Title: 'Настройка профиля',
                                Message: Message
                            })
                        } else {
                            response.render('profile.hbs', {
                                User: result.toJSON(),
                                isAuth: true,
                                Title: 'Настройка профиля',
                                Message: Message
                            })
                        }
                        Message = null;
                    } else {
                        response.redirect('/profile/deleted');
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
    if (await verifyToken(request, response)) {
        const userName = request.body.name;
        const userTel = request.body.tel;
        const userSurname = request.body.surname;
        const userMail = request.body.mail;
        var userPassword = request.body.password;
        const userPasswordNew = request.body.passwordNew;


        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result === null) {
            // страница ошибки

            response.send('Вы не авторизованы');

        } else {
            if (result.status == 1) {
                if (userPassword != "") {
                    if (userPasswordNew != "") {
                        const salt = result.passwordSalt;
                        const passwordHash = crypto.createHash('sha512').update(`${userPassword}${salt}`).digest('hex');
                        if (passwordHash === result.password) {
                            userPassword = crypto.createHash('sha512').update(`${userPasswordNew}${salt}`).digest('hex');
                        } else {
                            Message = "Старый пароль введён неверно";
                            response.redirect('/profile');
                            return;
                        }
                    } else {
                        Message = "Вы не ввели новый пароль";
                        response.redirect('/profile');
                        return;
                    }
                } else {
                    userPassword = result.password;
                }
                let values = {
                    name: userName,
                    surname: userSurname,
                    mail: userMail,
                    phone: userTel,
                    password: userPassword
                };
                result.update(values);

                Message = "Данные успешно сохранены";
                response.redirect('/profile');
            } else {
                response.redirect('/profile/deleted');
            }
        }
    } else {
        // страница ошибки

        response.send('Вы не авторизованы');

    }
}

exports.delete = async function(request, response) {
    if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result === null) {
        	//страница ошибки
            response.send('Вы не авторизованы');
        } else {
            let values = {
                status: 0
            };
            result.update(values);

            response.redirect('/profile/deleted');

        }
    } else {
        // страница ошибки
        response.send('Вы не авторизованы');

    }
}

exports.deleted = async function(request, response) {

    if (await verifyToken(request, response)) {
        const result = await User.findOne({
                where: {
                    id: request.user.id
                }
            })
            .then(result => {
                if (result != null) {
                    if (result.status == 0) {
                        if (result.role == 1) {
                            response.render('deleted.hbs', {
                                isAuth: true,
                                isAdmin: true,
                                Title: 'Профиль удалён'
                            })
                        } else {
                            response.render('deleted.hbs', {
                                isAuth: true,
                                Title: 'Профиль удалён'
                            })
                        }
                    } else {
                        response.redirect('/profile');
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

}

exports.restore = async function(request, response) {
	if (await verifyToken(request, response)) {
        const result = await User.findOne({
            where: {
                id: request.user.id
            }
        })
        if (result === null) {

        	//страница ошибки
            response.send('Вы не авторизованы');
        } else {
            let values = {
                status: 1
            };
            result.update(values);
            Message = "Профиль восстановлён";
            response.redirect('/profile');

        }
    } else {
        // страница ошибки
        response.send('Вы не авторизованы');

    }
}