const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const {
    getSliders,
    createSlider,
    deleteSlider,
    updateSlider,
    getActiveSliders
} = require("../controllers/slider");
const uploads_folder = "./uploads";
const slider_folder = uploads_folder+"/sliders";
if (!fs.existsSync(uploads_folder)) {
  fs.mkdirSync(uploads_folder);
}
if (!fs.existsSync(slider_folder)) {
  fs.mkdirSync(slider_folder);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, slider_folder);
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