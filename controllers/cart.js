const db = require("../utils/db");
const Cart = db.Cart;

async function addToCart(req, res) {
    let chk = false;
    let index = -1;
    try {
        let cartChk = await Cart.countDocuments({userId: req.params.id});
        if(cartChk !== 0){
            let cart = await Cart.findOne({userId: req.params.id});
            
            cart.product.forEach((singleProduct, i) => {
                if(singleProduct.productId == req.body.productId){
                    chk = true; //? Product Find
                    index = i; //? Index no
                }
            });
            if(chk){
                cart.product[index].quatity += req.body.quatity;
                await Cart.findByIdAndUpdate(cart._id, cart).then(()=>{
                    res.status(200).json({message: "Product Added to Cart."});
                });
            } else {
                cart.product.push(req.body);
                await Cart.findByIdAndUpdate(cart._id, cart).then(()=>{
                    res.status(200).json({message: "Product Added to Cart."});
                });
            }
        } else {
            let cart = Cart({userId: req.params.id});
            cart.product.push(req.body);
            await Cart.create(cart).then(()=>{
                res.status(200).json({message: "Product Added to Cart."});
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

async function getCart(req, res) {
    try {
        let cart = await Cart.findOne({userId: req.params.id}).populate('product.productId');
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    addToCart,
    getCart,
};
