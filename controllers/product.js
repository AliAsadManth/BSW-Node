const db = require("../utils/db");
const Product = db.Product;

async function getAllProducts(req, res) {
  try {
    let products = await Product.find().populate(
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
    if(req.files){
      let path = '';
      req.files.forEach((files, index, arr) => {
        path = path + files.path + ',';
      });
      path = path.substring(0, path.lastIndexOf(','));
      req.body = { ...req.body, image: path};
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
      res.status(200).json({ msg: "Product Updated Sucessfully!" });
    });
  } catch (err) {
    res.status(200).json(err);
  }
}

async function deleteProduct(req, res) {
  try {
    let product = await Product.findById(req.params.id);
    product.status = false;
    await Product.findByIdAndUpdate(req.params.id, product).then(() => {
      res.status(200).json({ msg: "Product Deleted" });
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
        $match: {
          categoryId: product.categoryId,
          _id: { $ne: req.params.id },
          status: true,
        },
      },
      { $sample: { size: 8 } },
    ]);
    product = {...product._doc, image: product.image.split(',')};
    relatedProducts.forEach((value, index)=>{
      relatedProducts[index].image =  value.image.split(',')[0];
    });
    
    res
      .status(200)
      .json({ product: product, relatedProducts: relatedProducts });
  } catch (err) {
    res.status(500).json(err);
  }
}
async function addStock(req, res) {
  try {
    let product = await Product.findById(req.params.id);
    if (req.body.stock < 1) {
      res.json({ msg: "Stock cannot be less than 1" });
      return;
    }
    product.stock += req.body.stock;
    await Product.findByIdAndUpdate(req.params.id, product).then(() => {
      res.status(200).json({ msg: "Stock Added Sucessfully!" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}

async function searchProducts(req, res) {
  try {
    if (req.query.q !== "") {
      const regex = new RegExp(req.query.q, "i");
      let results = await Product.find({
        name: { $regex: regex },
        status: true,
      });
      results.forEach((value, index)=>{
        results[index].image =  value.image.split(',')[0];
      });
      res.status(200).json(results);
    } else {
      // let results = await Product.find({status : true});
      // res.status(200).json(results);
      res.status(200).json();
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
async function featureProduct(req, res) {
  try {
    let singleProduct = await Product.findById(req.params.id);
    let docCount = await Product.countDocuments({ featured: true });
    if (docCount === 8 && singleProduct.featured === false) {
      res.json({ msg: "Only 8 Products can be featured" });
      return;
    }
    singleProduct.featured = !singleProduct.featured;
    await Product.findByIdAndUpdate(req.params.id, singleProduct).then(() => {
      if (singleProduct.featured) {
        res.status(200).json({ msg: "Product Added to Featured Products!" });
      } else {
        res
          .status(200)
          .json({ msg: "Product Removed from Featured Products!" });
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
async function getFeaturedProducts(req, res) {
  try {
    let featuredProducts = await Product.aggregate([
      { $match: { featured: true, status: true } },
      // { $sample: { size: 8 } },
    ]);
    featuredProducts.forEach((value, index)=>{
      featuredProducts[index].image =  value.image.split(',')[0];
    });
    res.status(200).json(featuredProducts);
  } catch (err) {
    res.status(500).json(err);
  }
}
async function getLatestProducts(req, res) {
  try {
    let latestProducts = await Product.find().sort({ _id: -1 }).limit(8);
    latestProducts.forEach((value, index)=>{
      latestProducts[index].image =  value.image.split(',')[0];
    });
    res.json(latestProducts);
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
  searchProducts,
  featureProduct,
  getFeaturedProducts,
  getLatestProducts,
};
