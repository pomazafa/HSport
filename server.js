const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Sequelize = require('sequelize');
const expressHbs = require("express-handlebars");
const cookieParser = require('cookie-parser');
const hbs = require("hbs");

const homeRouter = require("./routes/homeRouter.js");
const entryRouter = require("./routes/entryRouter.js");
const models = require("./models/model.js")

app.use(cookieParser());

app.engine("hbs", expressHbs({
    layoutsDir: "views/layouts",
    defaultLayout: "main",
    extname: "hbs"
}))

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/entry", entryRouter);
app.use("/", homeRouter);

app.use(function(req, res, next) {
    res.status(404).send("Not Found");
});

app.listen(3000);