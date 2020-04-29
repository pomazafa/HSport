const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Sequelize = require('sequelize');
const expressHbs = require("express-handlebars");
const cookieParser = require('cookie-parser');
const hbs = require("hbs");
const multer = require("multer");
const path = require("path");

const homeRouter = require("./routes/homeRouter.js");
const catalogRouter = require("./routes/catalogRouter.js");
const cartRouter = require("./routes/cartRouter.js");
const entryRouter = require("./routes/entryRouter.js");
const profileRouter = require("./routes/profileRouter.js");
const models = require("./models/model.js")

app.use(cookieParser());


const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/products");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.pname + path.extname(file.originalname));
    }
});


app.use(multer({ storage: storageConfig }).single("pimage"));

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
app.use("/catalog", catalogRouter);
app.use("/profile", profileRouter);
app.use("/cart", cartRouter);

app.use(function(req, res, next) {
    res.status(404).send("Not Found");
});

app.listen(3000);