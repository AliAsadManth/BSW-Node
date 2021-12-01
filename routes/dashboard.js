const express = require("express");
const router = express.Router();
const {
    dashboard,
    setTax,
    getTax,
} = require("../controllers/dashboard");

router.get("/", dashboard);
router.post("/setTax", setTax);
router.get("/getTax", getTax);

module.exports = router;