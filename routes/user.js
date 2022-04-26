const express = require("express");
const Controller = require("../controllers/user");
const router = express.Router();
const checkAuth = require("./../middleware/check-auth");

router.get("/", Controller.list);
router.post("/", Controller.addUser);
router.put("/", checkAuth, Controller.editUser);

router.get("/getBasicinfo", checkAuth, Controller.getBasicinfo);

router.post("/login", Controller.login);


module.exports = router;
