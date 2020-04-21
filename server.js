const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Sequelize = require('sequelize');
const expressHbs = require("express-handlebars");
const cookieParser = require('cookie-parser');
const hbs = require("hbs");
const cors = require('cors');

const userRouter = require("./routes/userRouter.js");
const homeRouter = require("./routes/homeRouter.js");
const entryRouter = require("./routes/entryRouter.js");
const models = require("./models/model.js")

// const sequelizeMaster = new Sequelize("", "pomazafa", "pomazafaP1", {
//   dialect: "mysql"
// });

// sequelizeMaster.query("CREATE DATABASE IF NOT EXISTS HSPORT;")

// const { Product, User, Order, OrderedProduct, 
//  Comment } = require('./models/model.js').ORM(sequelize);

app.use(cors());
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

app.use("/users", userRouter);
app.use("/entry", entryRouter);
app.use("/", homeRouter);

app.use(function(req, res, next) {
    res.status(404).send("Not Found");
});


app.listen(3000);