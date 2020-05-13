const { User } = require('../../models/model');
const verifyToken = require('./func.js');

module.exports = async function error404(req, res) {
    if (await verifyToken(req, res)) {
        const result = await User.findOne({
            where: {
                id: req.user.id
            }
        })
        if (result != null) {
            if (result.role == 1) {
                res.render('message.hbs', {
                    Title: "Страница не найдена",
                    message: "Кажется, такой страницы не существует, попробуйте перейти в наш каталог, нажав на кнопку!",
                    buttonAction: "window.location.href = 'http://localhost:3000/catalog'",
                    buttonValue: "К каталогу",
                    isAuth: true,
                    isAdmin: true
                })
            } else {
                res.render('message.hbs', {
                    Title: "Страница не найдена",
                    message: "Кажется, такой страницы не существует, попробуйте перейти в наш каталог, нажав на кнопку!",
                    buttonAction: "window.location.href = 'http://localhost:3000/catalog'",
                    buttonValue: "К каталогу",
                    isAuth: true
                });
            }
        } else {
            res.render('message.hbs', {
                Title: "Страница не найдена",
                message: "Кажется, такой страницы не существует, попробуйте перейти в наш каталог, нажав на кнопку!",
                buttonAction: "window.location.href = 'http://localhost:3000/catalog'",
                buttonValue: "К каталогу"
            });
        }
    } else {
        res.render('message.hbs', {
            Title: "Страница не найдена",
            message: "Кажется, такой страницы не существует, попробуйте перейти в наш каталог, нажав на кнопку!",
            buttonAction: "window.location.href = 'http://localhost:3000/catalog'",
            buttonValue: "К каталогу"
        });
    }
}