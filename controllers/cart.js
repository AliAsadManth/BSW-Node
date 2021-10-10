const db = require("../utils/db");
const Cart = db.Cart;

async function addToCart(req, res) {
    let chk = false;
    let index = -1;
    try {
        let cartChk = await Cart.countDocuments({userId: req.params.uid});
        if(cartChk !== 0){
            let cart = await Cart.findOne({userId: req.params.uid});
            
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
            let cart = Cart({userId: req.params.uid});
            cart.product.push(req.body);
            await Cart.create(cart).then(()=>{
                res.status(200).json({message: "Product Added to Cart."});
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

async function increment(req, res) {
    let index = -1;
    try {
        let cart = await Cart.findOne({userId: req.params.uid});
        cart.product.forEach((singleProduct, i) => {
            if(singleProduct.productId == req.params.id){
                index = i; //? Index no
            }
        });
        cart.product[index].quatity += 1;
        await Cart.findByIdAndUpdate(cart._id, cart).then(()=>{
            res.status(200).json({message: "Quantity increased"});
        });
    } catch (err) {
        res.status(500).json(err);
    }
}
async function decrement(req, res) {
    let index = -1;
    try {
        let cart = await Cart.findOne({userId: req.params.uid});
        cart.product.forEach((singleProduct, i) => {
            if(singleProduct.productId == req.params.id){
                index = i; //? Index no
            }
        });
        cart.product[index].quatity -= 1;
        if(cart.product[index].quatity === 0){
            cart.product.splice(index, 1);
        }
        await Cart.findByIdAndUpdate(cart._id, cart).then(()=>{
            res.status(200).json({message: "Quantity decreased"});
        });
        
    } catch (err) {
        res.status(500).json(err);
    }
}

async function getCart(req, res) {
    try {
        let cart = await Cart.findOne({userId: req.params.uid}).populate('product.productId', "name image");
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
}

async function removeFromCart(req, res) {
    let index = -1;
    try {
        let cart = await Cart.findOne({userId: req.params.uid});
        cart.product.forEach((singleProduct, i) => {
            if(singleProduct.productId == req.params.id){
                index = i; //? Index no
            }
        });
        if(index >= 0){
            cart.product.splice(index, 1);
        }
        await Cart.findByIdAndUpdate(cart._id, cart).then(()=>{
            res.status(200).json({message: "Product Deleted from Cart."});
        });

    } catch (err) {
        res.status(500).json(err);
    }
}
module.exports = {
    addToCart,
    getCart,
    increment,
    decrement,
    removeFromCart,
};
