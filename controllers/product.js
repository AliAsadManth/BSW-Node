const db = require("../utils/db");
const Product = db.Product;

async function getAllProducts(req, res) {
  try {
    let products = await Product.find({status: true}).populate(
      "categoryId",
      "name parentCategory"
    );
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function addProduct(req, res) {
  try {
    if (req.file) {
      req.body = { ...req.body, image: req.file.path };
    }
    await Product.create(req.body).then(() => {
      res.status(200).json({ msg: "Product created sucessfully!" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}

async function updateProduct(req, res) {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body).then(() => {
      res.status(200).json({msg:"Product Updated Sucessfully!"});
    });
  } catch (err) {
    res.status(200).json(err);
  }
}

async function deleteProduct(req, res) {
  try {
    let product = await Product.findById(req.params.id);
    product.status = false;
    await Product.findByIdAndUpdate(req.params.id, product).then(()=>{
      res.status(200).json({msg: "Product Deleted"});
    });
  } catch (err) {
    res.status(200).json(err);
  }
}

async function getProductByID(req, res) {
  try {
    let product = await Product.findById(req.params.id);

    //? Getting 8 Related Products
    let relatedProducts = await Product.aggregate([
      {
        $match: { categoryId: product.categoryId, _id: { $ne: req.params.id }, status: true},
      },
      { $sample: { size: 8 } },
    ]);

    res.status(200).json({ product: product, relatedsProducts: relatedProducts });
  } catch (err) {
    res.status(500).json(err);
  }
}
async function addStock(req, res) {
  try {
    let product = await Product.findById(req.params.id);
    if(req.body.stock < 1){
      res.status(500).json({msg: "Stock cannot be less than 1"});
      return;
    }
    product.stock += req.body.stock;
    await Product.findByIdAndUpdate(req.params.id, product).then(()=>{
      res.status(200).json({msg: "Stock Added Sucessfully!"});
    });
  } catch (err) {
    res.status(500).json(err);
  }
}

async function searchProducts(req, res) {
  try {
    if(req.query.q !== ""){
      const regex = new RegExp(req.query.q, 'i');
      let results = await Product.find({name : { $regex : regex}, status : true});
      res.status(200).json(results);
    }else{
      // let results = await Product.find({status : true});
      // res.status(200).json(results);
      res.status(200).json();
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  getAllProducts,
  addProduct,
  getProductByID,
  updateProduct,
  deleteProduct,
  addStock,
  searchProducts
};
