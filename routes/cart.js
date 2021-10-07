const express = require("express");
const router = express.Router();
const {
    addToCart,
    getCart,
} = require("../controllers/cart");

router.get("/:id", getCart);
router.post("/add/:id", addToCart);

module.exports = router;