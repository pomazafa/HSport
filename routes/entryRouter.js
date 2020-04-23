const express = require("express");
const entryController = require("../controllers/entryController.js");
const entryRouter = express.Router();

entryRouter.get("/", entryController.index);
entryRouter.get("/exit", entryController.exit);
entryRouter.post("/registration", entryController.register);
entryRouter.post("/authentication", entryController.authenticate);

module.exports = entryRouter;
