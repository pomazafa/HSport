const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const cookieParser = require('cookie-parser');
const hbs = require("hbs");
const multer = require("multer");

const homeRouter = require("./routes/homeRouter.js");
const catalogRouter = require("./routes/catalogRouter.js");
const cartRouter = require("./routes/cartRouter.js");
const entryRouter = require("./routes/entryRouter.js");
const profileRouter = require("./routes/profileRouter.js");
const productRouter = require("./routes/productRouter.js");
const error404 = require("./public/js/error404");
const {storageConfig} = require("./config/config.js");

app.use(cookieParser());

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
    error404(req, res);
});

app.listen(process.env.PORT || 3000);