const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRouter.js");
const homeRouter = require("./routes/homeRouter.js");
const entryRouter = require("./routes/entryRouter.js");
const Sequelize = require('sequelize');

// const sequelizeMaster = new Sequelize("", "pomazafa", "pomazafaP1", {
//   dialect: "mysql"
// });

// sequelizeMaster.query("CREATE DATABASE IF NOT EXISTS HSPORT;")


const sequelize = new Sequelize('HSPORT', 'pomazafa', 'pomazafaP1', {
    dialect: 'mysql',
    host: "localhost",
    pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const { Product, User, Order, OrderedProduct, 
	Comment } = require('./models/model.js').ORM(sequelize);

app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/users", userRouter);
app.use("/entry", entryRouter);
app.use("/", homeRouter);

app.use(function (req, res, next) {
    res.status(404).send("Not Found");
});

try {
    sequelize.authenticate()
        .then(() => {
            console.log('Connection successfull');
        })
} catch (e) {
    console.error(e);
}


app.listen(3000);


