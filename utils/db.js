//? init
const mongoose = require("mongoose");

//? Mongo connection
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("Connected to mongoDB :)"));

//? export
module.exports = {
	User: require("../models/user"),
	Product: require("../models/product"),
	Cart: require("../models/cart"),
	Category: require("../models/category"),
	SubCategory: require("../models/subCategory"),
	Order: require("../models/order"),
	Slider: require("../models/slider"),
};
