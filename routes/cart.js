const express = require("express");
const router = express.Router();
const {
    addToCart,
    getCart,
    increment,
    decrement,
    removeFromCart,
} = require("../controllers/cart");

router.get("/:uid", getCart);
router.post("/add/:uid", addToCart);
router.delete("/delete/:id/:uid", removeFromCart);
router.put("/increment/:id/:uid", increment);
router.put("/decrement/:id/:uid", decrement);


module.exports = router;