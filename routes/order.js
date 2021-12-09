const express = require("express");
const router = express.Router();

const {
  getOrders,
  placeOrders,
  checkout,
  getOrderById,
  deleteOrder,
  invoice
} = require("../controllers/order");

router.get("/", getOrders);
router.get("/invoice/:id", invoice); //? id -> order id
router.post("/placeOrder/:id", placeOrders); //? id -> user id
router.patch("/checkout", checkout);
router.get("/:id", getOrderById); //? id -> user id
router.delete("/deleteOrder/:oid", deleteOrder); //? oid -> order id

module.exports = router;
