const express = require("express");
const router = express.Router();

const { getOrders, placeOrders, checkout } = require("../controllers/order");

router.get("/", getOrders);
router.post("/:id", placeOrders);
router.patch("/checkout", checkout);

module.exports = router;
