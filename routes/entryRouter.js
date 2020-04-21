const express = require("express");
const entryController = require("../controllers/entryController.js");
const entryRouter = express.Router();
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config.js')
const verifyToken = require('../public/js/func.js');

entryRouter.get("/", entryController.index);
entryRouter.get("/asd", 
  verifyToken,
  entryController.asd
);
entryRouter.post("/registration", entryController.register);
entryRouter.post("/authentication", entryController.authenticate);

module.exports = entryRouter;
