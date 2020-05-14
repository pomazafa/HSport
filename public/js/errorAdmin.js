module.exports = function errorAdmin(request, response)
{
    response.render('message.hbs', {
            Title: "Ошибка авторизации",
            message: "Чтобы выполнить это действие, необходимо зайти под записью обычного пользоваться",
            buttonAction: "window.location.href = '/entry/exit'",
            buttonValue: "Выйти",
            isAuth: true,
            isAdmin: true
        });
}