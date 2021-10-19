// Init
const router = require("express").Router();

// All Routes
router.use("/user", require("./user"));
router.use("/category", require("./category"));
router.use("/product", require("./product"));
router.use("/cart", require("./cart"));
router.use("/slider", require("./slider"));

// Export
module.exports = router;
