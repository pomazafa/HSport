const express = require("express");
const productController = require("../controllers/productController.js");
const productRouter = express.Router();

productRouter.get("/", productController.index);
productRouter.post("/addComment", productController.addComment);

module.exports = productRouter;
