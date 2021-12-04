const db = require("../utils/db");

async function getOrders(req, res) {
    res.json("Haalo");
}

async function placeOrders(req, res) {
    res.json(req.params.id);
}
// TODO: DELETE ORDER...
module.exports = {
    getOrders,
    placeOrders
};