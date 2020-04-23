exports.index = function (request, response) {
    response.render('index.hbs')
};
exports.about = function (request, response) {
    response.send("О сайте");
};
