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
  getByCategoryID,
} = require("../controllers/product");

//? Image Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "./Uploads/images");
    } else if (file.fieldname === "pdf") {
      if (file.mimetype === "application/pdf") {
        cb(null, "./Uploads/pdf");
      } else {
        cb(new Error("Invalid PDF File!"));
      }
    }
  },
  filename: (req, file, cb) => {
    let fileName =
      Date.now().toString() +
      Math.random().toString(8).split(".").pop() +
      "." +
      file.originalname.split(".").pop();
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });
const uploader = upload.fields([
  { name: "image", maxCount: 5 },
  { name: "pdf", maxCount: 1 },
]);

router.get("/", getAllProducts);
router.post("/create", uploader, addProduct);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/getlatest", getLatestProducts);
router.get("/getByCatId/:cid", getByCategoryID);
router.get("/:id", getProductByID);
router.put("/:id/update", uploader, updateProduct);
router.put("/:id/delete", deleteProduct);
router.put("/:id/addstock", addStock);
router.put("/:id/feature", featureProduct);

module.exports = router;
