const express = require("express");
const router = express.Router();

const {
    getSliders,
} = require("../controllers/slider");

router.get("/", getSliders);

module.exports = router;