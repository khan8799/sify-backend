const express = require("express");
const Controller = require("../controllers/test_user");
const router = express.Router();

router.post("/signup", Controller.signup);
router.post("/login", Controller.login);

module.exports = router;
