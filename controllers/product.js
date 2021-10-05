const db = require("../utils/db");
const Product = db.Product;

async function getAllProducts(req, res) {
    try {
        let products = await Product.find().populate("categoryId", "name parentCategory");
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
}

async function addProduct(req, res) {
    try {
        if(req.file){
            req.body={...req.body, image: req.file.path};
        }
        await Product.create(req.body).then(()=>{
            res.status(200).json({message: "Product created sucessfully!"});
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

async function getProductByID(req, res) {
    try {
        let product = await Product.findById(req.params.id);
        
        //? Getting 8 Related Products
        let relatedProducts = await Product.aggregate([
            {$match: {categoryId: product.categoryId, _id: {$ne: req.params.id}}},
            { $sample: { size: 8 }}
        ]);
        
        res.status(200).json({product: product, relatedProducts: relatedProducts});
    } catch (err) {
        res.status(500).json(err);
    }
}
module.exports = {
    getAllProducts,
    addProduct,
    getProductByID
}