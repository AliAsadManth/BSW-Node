const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    getSliders,
    createSlider,
    deleteSlider,
    updateSlider,
    getActiveSliders
} = require("../controllers/slider");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/sliders");
    },
    filename: (req, file, cb) => {
        let fileName = Date.now().toString() + Math.random().toString(8).split(".").pop() +"."+ file.originalname.split('.').pop();
        cb(null, fileName);
    }
});
const uploadSlider = multer({storage: storage});

router.get("/", getSliders);
router.get("/active", getActiveSliders);

router.post("/create", uploadSlider.single("image"), createSlider);
router.delete("/delete/:id", deleteSlider);
router.put("/update/:id", updateSlider);

module.exports = router;