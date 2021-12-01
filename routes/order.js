const express = require("express");
const router = express.Router();

const {
    getOrders,
    placeOrders,
} = require("../controllers/order");

router.get("/", getOrders);
router.post("/:id", placeOrders);

module.exports = router;