const {
    Product,
    User,
    Order,
    OrderedProduct,
    Comment
} = require('../models/model.js');

const { secret } = require('../config/config.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function makeSalt(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.index = function(request, response) {
    response.render("entry.hbs", {
        bodyClass: "body-entry"
    });
};

exports.register = function(request, response) {
    const userName = request.body.name;
    const userTel = request.body.tel;
    const userSurname = request.body.surname;
    const userMail = request.body.mail;
    const userPassword = request.body.password;
    User.findOne({
            where: {
                Mail: userMail
            }
        })
        .then(function(result) {
            if (result !== null) {
                var form = {
                    name: userName,
                    surname: userSurname,
                    mailR: userMail,
                    tel: userTel
                };
                response.render('entry.hbs', {
                    bodyClass: "body-entry",
                    form: form
                });
            } else {
                const salt = makeSalt(6);
                const passwordHash = crypto.createHash('sha512').update(`${userPassword}${salt}`).digest('hex');

                const user = User.build({
                    Name: userName,
                    Surname: userSurname,
                    Mail: userMail,
                    Password: passwordHash,
                    PasswordSalt: salt,
                    Status: 'active'
                })
                //(userName, userTel, userSurname, userMail, passwordHash, salt);
                user.save();

                response.redirect("/entry");
            }
        });
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
        var form = {
            mailA: userMail,
        };
        response.render('entry.hbs', {
            bodyClass: "body-entry",
            form: form
        });
    } else {
        const salt = result.PasswordSalt;
        const passwordHash = crypto.createHash('sha512').update(`${userPassword}${salt}`).digest('hex');

        if (passwordHash === result.Password) {
            const token = jwt.sign({ id: result.id}, secret, {
            });
            response.cookie('token', token, {
                secure: false, // set to true if your using https
            });
            response.end('token = ' + token);
        } else {
            response.end("INCORRECT PASSWORD");
        }
    }
};
exports.asd = async (req, res) => {
    res.end('asd');
}