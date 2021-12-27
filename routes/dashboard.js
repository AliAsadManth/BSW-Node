const express = require("express");
const router = express.Router();
const {
    dashboard,
    graph,
    setTax,
    getTax,
} = require("../controllers/dashboard");

router.get("/", dashboard);
router.get("/graph", graph);
router.post("/setTax", setTax);
router.get("/getTax", getTax);

module.exports = router;