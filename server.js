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
const productRouter = require("./routes/productRouter.js");
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
    helpers: {
        when: function(operand_1, operand_2, options) {
            result = operand_1 == operand_2;
            if(result) return options.fn(this); 
            return options.inverse(this);    
          }
    },
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
app.use("/product", productRouter);
app.use("/cart", cartRouter);

app.use(function(req, res, next) {
    res.render('message.hbs', {
            Title: "Страница не найдена",
            message: "Кажется, такой страницы не существует, попробуйте перейти в наш каталог, нажав на кнопку!",
            buttonAction: "window.location.href = 'http://localhost:3000/catalog'",
            buttonValue: "К каталогу"
        });
});

app.listen(process.env.PORT || 3000);