const express = require("express");
const catalogController = require("../controllers/catalogController.js");
const catalogRouter = express.Router();

catalogRouter.get('/', catalogController.index);
catalogRouter.get('/add', catalogController.add);

module.exports = catalogRouter;
