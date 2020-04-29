const express = require("express");
const profileController = require("../controllers/profileController.js");
const profileRouter = express.Router();

profileRouter.get("/", profileController.index);
profileRouter.get("/delete", profileController.delete);
profileRouter.post("/update", profileController.update);

module.exports = profileRouter;
