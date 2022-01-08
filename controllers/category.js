const db = require("../utils/db");
const Category = db.Category;
const SubCategory = db.SubCategory;
const Product = db.Product;

//? Category Methods
async function getAllCategory(req, res) {
  let page = req.query.page || 1;
  let items_per_page = 12;
  let category_count = await Category.countDocuments();
  let total_pages = Math.ceil(category_count / items_per_page);
  if (page > total_pages) {
    page = total_pages;
  }
  let categories = await Category.find()
    .skip((page - 1) * items_per_page)
    .limit(items_per_page);
  res.json({
    categories: categories,
    total_category: category_count,
    total_pages: total_pages,
    items_per_page: items_per_page,
    current_page: parseInt(page),
    has_next_page: page < total_pages,
    has_previous_page: page > 1,
    next_page: parseInt(page) + 1,
    previous_page: page - 1,
  });
}
async function createCategory(req, res) {
  try {
    if (req.body.parentCategory === undefined) {
      res.status(200).json({ msg: "Please Select Category" });
      return;
    }
    await Category.create(req.body).then(() => {
      res.status(200).json({ msg: "Category Created Sucessfully" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
async function deleteCategory(req, res) {
  try {
    let subcat = await SubCategory.findOne({ parentCategory: req.params.id });
    if (subcat) {
      res.status(200).json({ msg: "Delete Sub Categories First!" });
      return;
    } else {
      await Category.findByIdAndDelete(req.params.id).then(() => {
        res.status(200).json({ msg: "Category Deleted!" });
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
async function updateCategory(req, res) {
  try {
    await Category.findByIdAndUpdate(req.params.id, req.body).then(() => {
      res.status(200).json({ msg: "Category Updated" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
async function getCategoryById(req, res) {
  try {
    let categories = await Category.find({ parentCategory: req.params.id });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
}
async function getCat(req, res) {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
}
//? Sub Category Methods
async function getAllSubCategory(req, res) {
  let page = req.query.page || 1;
  let items_per_page = 12;
  let category_count = await SubCategory.countDocuments();
  let total_pages = Math.ceil(category_count / items_per_page);
  if (page > total_pages) {
    page = total_pages;
  }
  const subCategories = await SubCategory.find()
    .populate("parentCategory", "name parentCategory")
    .skip((page - 1) * items_per_page)
    .limit(items_per_page);
  res.json({
    categories: subCategories,
    total_category: category_count,
    total_pages: total_pages,
    items_per_page: items_per_page,
    current_page: parseInt(page),
    has_next_page: page < total_pages,
    has_previous_page: page > 1,
    next_page: parseInt(page) + 1,
    previous_page: page - 1,
  });
}
async function productSubCat(req, res) {
  try {
    const subCategories = await SubCategory.find();
    res.json(subCategories);
  } catch (err) {
    res.status(500).json(err);
  }
}
async function createSubCategory(req, res) {
  try {
    if (req.body.parentCategory === undefined) {
      res.status(200).json({ msg: "Please Select Category" });
      return;
    }
    await SubCategory.create(req.body).then(() => {
      res.status(200).json({ msg: "SubCategory Created Sucessfully" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
async function deleteSubCategory(req, res) {
  try {
    let ProductChk = await Product.findOne({ categoryId: req.params.id });
    if (ProductChk) {
      res.status(200).json({ msg: "Delete Products in this category First!" });
      return;
    } else {
      await SubCategory.findByIdAndDelete(req.params.id).then(() => {
        res.status(200).json({ msg: "SubCategory Deleted!" });
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
async function updateSubCategory(req, res) {
  try {
    await SubCategory.findByIdAndUpdate(req.params.id, req.body).then(() => {
      res.json({ msg: "SubCategory Updated" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
async function getSubcategoryById(req, res) {
  try {
    let subcategories = await SubCategory.find({
      parentCategory: req.params.id,
    }).populate("parentCategory", "name");
    res.status(200).json(subcategories);
  } catch (err) {
    res.status(500).json(err);
  }
}
module.exports = {
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

  productSubCat,
  getCat
};
