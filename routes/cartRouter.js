const express = require("express");
const cartController = require("../controllers/cartController.js");
const cartRouter = express.Router();

cartRouter.get('/', cartController.index);
cartRouter.get('/add', cartController.add);
cartRouter.get('/remove', cartController.remove);
cartRouter.get('/increase', cartController.increase);
cartRouter.get('/decrease', cartController.decrease);
cartRouter.get('/complete', cartController.complete);

module.exports = cartRouter;
