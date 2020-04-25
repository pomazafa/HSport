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
var form = null;

function makeSalt(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.index = async function(request, response) {
    if (await verifyToken(request, response)) {
        response.redirect('/');
    } else {
        response.render("entry.hbs", {
            bodyClass: "body-grey",
            form: form,
            isEntry: true
        });
        form = null;
    }
};

exports.exit = async function(request, response) {
    response.cookie('token', '');
    response.redirect("/entry");
};

exports.register = async function(request, response) {
    const userName = request.body.name;
    const userTel = request.body.tel;
    const userSurname = request.body.surname;
    const userMail = request.body.mail;
    const userPassword = request.body.password;
    const result = await User.findOne({
        where: {
            mail: userMail
        }
    })
    if (result != null) {
        form = {
            name: userName,
            surname: userSurname,
            mailR: userMail,
            tel: userTel,
            messageR: 'Пользователь с такой почтой уже зарегистрирован'
        };
        response.redirect('/entry');
    } else {
        const salt = makeSalt(6);
        const passwordHash = crypto.createHash('sha512').update(`${userPassword}${salt}`).digest('hex');

        const user = User.build({
            name: userName,
            surname: userSurname,
            mail: userMail,
            phone: userTel,
            password: passwordHash,
            passwordSalt: salt,
            status: 1,
            role: 0
        })
        user.save();
        form = {
            mailA: userMail,
            changeNav: true,
            messageA: 'Пользователь успешно зарегистрирован. Попробуйте войти в аккаунт'
        };
        response.redirect("/entry");
    }
};

exports.authenticate = async function(request, response) {
    const userMail = request.body.mail;
    const userPassword = request.body.password;
    const result = await User.findOne({
        where: {
            mail: userMail
        }
    })
    if (result === null) {
        form = {
            mailA: userMail,
            changeNav: true,
            messageA: 'Пользователя с такой почтой не существует'
        };
        response.redirect('/entry');
    } else {
        const salt = result.passwordSalt;
        const passwordHash = crypto.createHash('sha512').update(`${userPassword}${salt}`).digest('hex');

        if (passwordHash === result.password) {
            const token = jwt.sign({ id: result.id }, secret, {});
            response.cookie('token', token, {
                secure: false, // set to true if your using https
            });
            response.redirect('/');
            //response.end('token = ' + token);
        } else {
            form = {
                mailA: userMail,
                changeNav: true,
                messageA: 'Неверный пароль'
            };
            response.redirect('/entry');
        }
    }
};