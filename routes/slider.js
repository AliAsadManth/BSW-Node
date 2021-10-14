const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    getSliders,
    createSlider,
} = require("../controllers/slider");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/sliders");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + file.originalname);
    }
});
const uploadSlider = multer({storage: storage});

router.get("/", getSliders);
router.post("/create", uploadSlider.single("image"), createSlider);

module.exports = router;