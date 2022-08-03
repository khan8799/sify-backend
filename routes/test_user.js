const express = require("express");
const Controller = require("../controllers/test_user");
const router = express.Router();

router.post("/signup", Controller.signup);

module.exports = router;
