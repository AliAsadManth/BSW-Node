const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    getSliders,
    createSlider,
    deleteSlider,
    updateSlider,
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
router.delete("/delete/:id", deleteSlider);
router.put("/update/:id", updateSlider);

module.exports = router;