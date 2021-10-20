const fs = require("fs");
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
    if (req.file) {
      req.body = { ...req.body, image: req.file.path };
      await Slider.create(req.body).then(() => {
        res.status(200).json({ msg: "Slider Uploaded sucessfully!" });
      });
    } else {
      res.json({msg: "Please Attach Image!"});
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
async function deleteSlider(req, res) {
  try {
    let singleSlider = await Slider.findById(req.params.id);
    let path = ".\\" + singleSlider.image;
    // let path = "./default.jpg";

    await Slider.findByIdAndDelete(req.params.id).then(() => {
      fs.unlink(path, (err) => {
        if (err) {
          res.json(err);
          return;
        } else {
          res.status(200).json({ msg: "Slider Deleted!" });
          return;
        }
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
async function updateSlider(req, res) {
  try {
    let singleSlider = await Slider.findById(req.params.id);
    singleSlider.active = !singleSlider.active;
    await Slider.findByIdAndUpdate(req.params.id, singleSlider).then(() => {
      if (singleSlider.active) {
        res.status(200).json({ msg: "Slider Activated" });
      } else {
        res.status(200).json({ msg: "Slider Deactivated" });
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
}
module.exports = {
  getSliders,
  createSlider,
  deleteSlider,
  updateSlider,
};
