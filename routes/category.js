const express = require("express");
const router = express.Router();

const {
    getAllCategory,
    createCategory,
    deleteCategory,
    updateCategory,

    createSubCategory,
    getAllSubCategory,
    deleteSubCategory,
    updateSubCategory,
} = require("../controllers/category");

//? Parent Category
router.get("/", getAllCategory);
router.post("/create", createCategory);
router.delete("/:id/delete", deleteCategory);
router.put("/:id/update", updateCategory);

//? Sub category
router.get("/subcategory", getAllSubCategory);
router.post("/subcategory/create", createSubCategory);
router.delete("/subcategory/:id/delete", deleteSubCategory);
router.put("/subcategory/:id/update", updateSubCategory);

module.exports = router;