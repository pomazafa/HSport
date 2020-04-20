//const sequelize = require('../server.js').sequelize;
//const User = require('../models/model.js').ORM(sequelize).User;

exports.index = function (request, response){
    response.render("entry.hbs", {
    	bodyClass: "body-entry"
    });
};
// exports.addUser = function (request, response){
//     response.render("create.hbs");
// };
// exports.getUsers = function(request, response){
//     response.render("users.hbs", {
//         users: User.getAll()
//     });
// };
// exports.postUser= function(request, response){
//     const username = request.body.name;
//     const userage = request.body.age;
//     const user = new User(username, userage);
//     user.save();
//     response.redirect("/users");
// };
