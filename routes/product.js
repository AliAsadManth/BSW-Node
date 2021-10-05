const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
    getAllProducts,
    addProduct,
    getProductByID,
} = require("../controllers/product");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + file.originalname);
    }
});
const uploadImage = multer({storage: storage});

router.get("/", getAllProducts);
router.post("/create", uploadImage.single("image"), addProduct);
router.get("/:id", getProductByID);

module.exports = router;
