const express = require("express");
const router = express.Router();

const {
  getOrders,
  placeOrders,
  setStatus,
  checkout,
  getOrderById,
  deleteOrder,
  invoice,
  Webhook,
} = require("../controllers/order");

router.get("/", getOrders);
router.get("/invoice/:id", invoice); //? id -> order id
router.put("/status/:id", setStatus);//? id -> order id 
router.post("/placeOrder/:id", placeOrders); //? id -> user id
router.patch("/checkout", checkout);
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  Webhook
);
router.delete("/deleteOrder/:oid", deleteOrder); //? oid -> order id
router.get("/:id", getOrderById); //? id -> user id

module.exports = router;
