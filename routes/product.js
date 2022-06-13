const express = require("express");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");
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
  getRecommended,
} = require("../controllers/product");

//? Image Storage
const uploads_folder = "./uploads";
const img_folder = uploads_folder + "/images";
const pdf_folder = uploads_folder + "/pdf";
if (!fs.existsSync(uploads_folder)) {
  fs.mkdirSync(uploads_folder);
}
if (!fs.existsSync(img_folder)) {
  fs.mkdirSync(img_folder);
}
if (!fs.existsSync(pdf_folder)) {
  fs.mkdirSync(pdf_folder);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, img_folder);
    } else if (file.fieldname === "pdf") {
      if (file.mimetype === "application/pdf") {
        cb(null, pdf_folder);
      } else {
        cb(new Error("Invalid PDF File!"));
      }
    }
  },
  filename: (req, file, cb) => {
    let fileName = Date.now().toString() + Math.random().toString(8).split(".").pop() + "." + file.originalname.split(".").pop();
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
router.get("/recommended/:uid", getRecommended);
router.get("/getByCatId/:cid", getByCategoryID);
router.get("/:id", getProductByID);
router.put("/:id/update", uploader, updateProduct);
router.put("/:id/delete", deleteProduct);
router.put("/:id/addstock", addStock);
router.put("/:id/feature", featureProduct);

module.exports = router;
