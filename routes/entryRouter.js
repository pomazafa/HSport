const express = require("express");
const entryController = require("../controllers/entryController.js");
const entryRouter = express.Router();

entryRouter.get("/", entryController.index);

module.exports = entryRouter;
