const db = require("../utils/db");
const Slider = db.Slider;

async function getSliders(req, res) {
    try {
        let sliders = await Slider.find();
        res.json(sliders);
    } catch (err) {
        res.status(500).json(err);
    }
}
async function createSlider(req, res) {
    try {
        if(req.file){
            req.body = { ...req.body, image: req.file.path };
            await Slider.create(req.body).then(()=>{
                res.status(200).json({ msg: "Slider Uploaded sucessfully!" });
            });
        } else {
            res.status(500).json("Please Attach File");
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getSliders,
    createSlider,
}