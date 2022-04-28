const express = require("express");
const Controller = require("../controllers/payment");
const checkAuth = require("./../middleware/check-auth");

const router = express.Router();

router.get("/", checkAuth, Controller.list);
router.post("/orderId", checkAuth, Controller.createOrderId);
router.put("/verify", checkAuth, Controller.verifyPaymentSignature);

module.exports = router;
