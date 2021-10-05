const db = require("../utils/db");
const Category = db.Category;
const SubCategory = db.SubCategory;

//? Category Methods
async function getAllCategory(req, res) {
    const categories = await Category.find();
    res.json(categories);
}
async function createCategory(req, res) {
    try {
        await Category.create(req.body).then(()=>{
            res.status(200).json({message: "Category Created Sucessfully"});
        });
    } catch (err) {
        res.status(500).json(err);
    }
}
async function deleteCategory(req, res) {
    try {
        if(await SubCategory.findOne({parentCategory: req.params.id})){
            res.status(200).json({message: "Delete Sub Categories First!"});
            return;
        }else{
            await Category.findByIdAndDelete(req.params.id).then(() => {
                res.status(200).json({message: "Category Deleted!"});
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}
async function updateCategory(req, res) {
    try {
        await Category.findByIdAndUpdate(req.params.id, req.body).then(()=>{
            res.status(200).json({message: "Category Updated"});
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

//? Sub Category Methods
async function getAllSubCategory(req, res) {
    const subCategories = await SubCategory.find().populate('parentCategory', 'name parentCategory');
    res.json(subCategories);
}
async function createSubCategory(req, res) {
    try {
        await SubCategory.create(req.body).then(()=>{
            res.status(200).json({message: "Category Created Sucessfully"});
        });
    } catch (err) {
        res.status(500).json(err);
    }
}
async function deleteSubCategory(req, res) {
    try {
        await SubCategory.findByIdAndDelete(req.params.id).then(() => {
            res.status(200).json({message: "Category Deleted!"});
        });
    } catch (err) {
        res.status(500).json(err);
    }
}
async function updateSubCategory(req, res) {
    try {
        await Category.findByIdAndUpdate(req.params.id, req.body).then(()=>{
            res.status(200).json({message: "Category Updated"});
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getAllCategory,
    createCategory,
    deleteCategory,
    updateCategory,

    createSubCategory,
    getAllSubCategory,
    deleteSubCategory,
    updateSubCategory,
}