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
            bodyClass: "body-entry",
            form:form
        });
    }
};

exports.exit = async function(request, response) {
    response.cookie('token', '');
    form = null;
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
            Mail: userMail
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
    	form = null;
        const salt = makeSalt(6);
        const passwordHash = crypto.createHash('sha512').update(`${userPassword}${salt}`).digest('hex');

        const user = User.build({
            Name: userName,
            Surname: userSurname,
            Mail: userMail,
            Password: passwordHash,
            PasswordSalt: salt,
            Status: 1,
            Role: 0
        })
        user.save();
        form = {
        	mailA: userMail,
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
            Mail: userMail
        }
    })
    if (result === null) {
        form = {
            mailA: userMail,
            messageA: 'Пользователя с такой почтой не существует'
        };
        response.redirect('/entry');
    } else {
        const salt = result.PasswordSalt;
        const passwordHash = crypto.createHash('sha512').update(`${userPassword}${salt}`).digest('hex');

        if (passwordHash === result.Password) {
            const token = jwt.sign({ id: result.id }, secret, {});
            response.cookie('token', token, {
                secure: false, // set to true if your using https
            });
            response.redirect('/');
            //response.end('token = ' + token);
        } else {
            form = {
            mailA: userMail,
            messageA: 'Неверный пароль'
        };
        response.redirect('/entry');
        }
    }
};
exports.asd = async (req, res) => {
    //console.log(verifyToken(req, res));
    if (await verifyToken(req, res) != null) {
        res.end('asd');
    } else {
        res.end('(((');
    }
}
exports.dsa = async (req, res) => {
    res.end('dsa');
}