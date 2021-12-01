const db = require("../utils/db");

async function dashboard(req, res) {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    //! Cards 
    //? Total Signups in current month
    let signups = await db.User.countDocuments({createdAt: {$gte: firstDay, $lt: lastDay}});

    //? Total Products 
    let products = await db.Product.countDocuments();

    //? orders per day - Count
    let orders_day = "await db.Order.find();"



    //! Graphs - duration 6 month
    //? Sales per month
    let sales_month = "await db.Order.find()";


    res.json({
        //! Cards
        signups: signups,
        products: products,
        orders_day: orders_day,

        //! Graphs
        sales_month: sales_month,
    });
}

async function setTax(req, res) {
    let doc_count = await db.Tax.count();
    if(doc_count === 1){
        let tax_doc = await db.Tax.findOne();
        await db.Tax.findByIdAndUpdate(tax_doc._id, req.body).then(()=>{
            res.status(200).json({msg: "Tax info Updated!"});
        });
    } else {
        await db.Tax.create(req.body).then(()=>{
            res.status(200).json({msg: "Tax info Set!"});
        });
    }
}
async function getTax(req, res) {
    let taxInfo = await db.Tax.findOne();
    res.json(taxInfo);
}

module.exports = {
    dashboard,
    setTax,
    getTax,
}