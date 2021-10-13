const db = require("../utils/db");
const Slider = db.Slider;

async function getSliders(req, res) {
    try {
        // TODO: GET Slider...
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getSliders
}