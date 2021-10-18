const express = require("express");
const router = express.Router();

const {
    getAllCategory,
    createCategory,
    deleteCategory,
    updateCategory,
    getCategoryById,

    createSubCategory,
    getAllSubCategory,
    deleteSubCategory,
    updateSubCategory,
    getSubcategoryById,
} = require("../controllers/category");

//? Parent Category
router.get("/", getAllCategory);
router.post("/create", createCategory);
router.get("/:id", getCategoryById);
router.delete("/:id/delete", deleteCategory);
router.put("/:id/update", updateCategory);

//? Sub category
router.get("/subcategory", getAllSubCategory);
router.post("/subcategory/create", createSubCategory);
router.get("/subcategory/:id", getSubcategoryById);
router.delete("/subcategory/:id/delete", deleteSubCategory);
router.put("/subcategory/:id/update", updateSubCategory);

module.exports = router;