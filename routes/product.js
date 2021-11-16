const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  getAllProducts,
  addProduct,
  getProductByID,
  updateProduct,
  deleteProduct,
  addStock,
  searchProducts,
  featureProduct,
  getFeaturedProducts,
  getLatestProducts,
} = require("../controllers/product");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + file.originalname);
  },
});
const uploadImage = multer({ storage: storage });

router.get("/", getAllProducts);
router.post("/create", uploadImage.array("image", 5), addProduct);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/getlatest", getLatestProducts);
router.get("/:id", getProductByID);
router.put("/:id/update", uploadImage.array("image", 5), updateProduct);
router.put("/:id/delete", deleteProduct);
router.put("/:id/addstock", addStock);
router.put("/:id/feature", featureProduct);

module.exports = router;
