const db = require("../utils/db");
const Product = db.Product;

async function getAllProducts(req, res) {
  try {
    let page = req.query.page || 1;
    let items_per_page = 12;
    let product_count = await Product.countDocuments();
    let total_pages = Math.ceil(product_count / items_per_page);
    if (page > total_pages) {
      page = total_pages;
    }
    let products = await Product.find()
      .populate("categoryId", "name parentCategory")
      .sort({ _id: -1 })
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);

    res.status(200).json({
      products: products,
      total_products: product_count,
      total_pages: total_pages,
      items_per_page: items_per_page,
      current_page: parseInt(page),
      has_next_page: page < total_pages,
      has_previous_page: page > 1,
      next_page: parseInt(page) + 1,
      previous_page: page - 1,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}

async function addProduct(req, res) {
  try {
    if (req.files.image) {
      let images = req.files.image;
      let filePaths = [];
      images.forEach((image) => {
        filePaths.push(image.path);
      });
      req.body = { ...req.body, image: filePaths };
    }
    if (req.files.pdf) {
      let pdf = req.files.pdf;
      req.body = { ...req.body, pdf: pdf[0].path };
    }
    await Product.create(req.body).then((data) => {
      res.status(200).json({ msg: "Product created sucessfully!", data });
    });
  } catch (err) {
    console.log("error----->", err.message);
    res.status(500).json(err);
  }
}

async function updateProduct(req, res) {
  try {
    if (req.files.image) {
      let images = req.files.image;
      const filePaths = [];
      images.forEach((image) => {
        filePaths.push(image.path);
      });
      req.body = { ...req.body, image: filePaths };
    }
    if (req.files.pdf) {
      let pdf = req.files.pdf[0];
      req.body = { ...req.body, pdf: pdf.path };
    }

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
      let page = req.query.page || 1;
      let items_per_page = 12;
      let product_count;
      let total_pages;
      let results;
      if (req.query.mpn === "true" || req.query.mpn === "True") {
        product_count = await Product.find({
          mpn: { $regex: regex },
          status: true,
        }).countDocuments();
        total_pages = Math.ceil(product_count / items_per_page);
        if (page > total_pages) {
          page = total_pages;
        }

        let search = await Product.find({
          mpn: { $regex: regex },
          status: true,
        });

        results = search.slice(
          (page - 1) * items_per_page,
          (page - 1) * items_per_page + items_per_page
        );
      } else {
        product_count = await Product.find({
          name: { $regex: regex },
          status: true,
        }).countDocuments();
        total_pages = Math.ceil(product_count / items_per_page);
        if (page > total_pages) {
          page = total_pages;
        }
        let search = await Product.find({
          name: { $regex: regex },
          status: true,
        });

        results = search.slice(
          (page - 1) * items_per_page,
          (page - 1) * items_per_page + items_per_page
        );
      }
      res.status(200).json({
        products: results,
        total_products: product_count,
        total_pages: total_pages,
        items_per_page: items_per_page,
        current_page: parseInt(page),
        has_next_page: page < total_pages,
        has_previous_page: page > 1,
        next_page: parseInt(page) + 1,
        previous_page: page - 1,
      });
    } else {
      getAllProducts(req, res);
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
    let featuredProducts = await Product.find(
      // [
      // { $match:
      { featured: true, status: true }
      // },
      // { $sample: { size: 8 } },
      // ]
    );

    res.status(200).json(featuredProducts);
  } catch (err) {
    res.status(500).json(err);
  }
}
async function getLatestProducts(req, res) {
  try {
    let latestProducts = await Product.find().sort({ _id: -1 }).limit(8);

    res.json(latestProducts);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function getByCategoryID(req, res) {
  try {
    let page = req.query.page || 1;
    let items_per_page = 12;
    let product_count = await Product.find({
      categoryId: req.params.cid,
    }).countDocuments();
    let total_pages = Math.ceil(product_count / items_per_page);
    if (page > total_pages) {
      page = total_pages;
    }
    let productsByCategoryID = await Product.find({
      categoryId: req.params.cid,
    })
      .populate("categoryId", "name")
      .sort({ _id: -1 })
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);
      res.status(200).json({
        products: productsByCategoryID,
        total_products: product_count,
        total_pages: total_pages,
        items_per_page: items_per_page,
        current_page: parseInt(page),
        has_next_page: page < total_pages,
        has_previous_page: page > 1,
        next_page: parseInt(page) + 1,
        previous_page: page - 1,
      });
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
  getByCategoryID,
};
