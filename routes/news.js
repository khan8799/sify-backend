const express = require("express");
const Controller = require("../controllers/news");
const checkAuth = require("./../middleware/check-auth");

const router = express.Router();

router.get("/", checkAuth, Controller.list);
router.post("/", checkAuth, Controller.add);

module.exports = router;
