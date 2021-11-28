const express = require("express");
const router = express.Router();
const {
    addToCart,
    getCart,
    increment,
    decrement,
    removeFromCart,
} = require("../controllers/cart");

// ? id => product id, uid => user id
router.get("/:uid", getCart);
router.post("/add/:uid", addToCart);
router.delete("/remove/:id/:uid", removeFromCart);
router.put("/increment/:id/:uid", increment);
router.put("/decrement/:id/:uid", decrement);


module.exports = router;