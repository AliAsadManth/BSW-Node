const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

//? Initializing app and port
const app = express();
const port = process.env.PORT || 5000;

//? middlewares
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));

app.use(
  session({
    secret: "secretCode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//? Conecting with DB
const user = "admin";
const pass = "admin";
const db = "bsw";

// const url = "mongodb+srv://"+user+":"+pass+"@cluster0.gmbxc.mongodb.net/"+db+"?retryWrites=true&w=majority";
const url = `mongodb://${user}:${pass}@cluster0-shard-00-00.gmbxc.mongodb.net:27017,cluster0-shard-00-01.gmbxc.mongodb.net:27017,cluster0-shard-00-02.gmbxc.mongodb.net:27017/${db}?ssl=true&replicaSet=atlas-5wgyx3-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("Connected to mongoDB :)"));

//? Routes
app.use("/api/user", require("./routes/user"));
app.use("/api/category", require("./routes/category"));
app.use("/api/product", require("./routes/product"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/slider", require("./routes/slider"));

//! Static Image and Slider folders
app.use("/uploads/images", express.static("./uploads/images"));
app.use("/uploads/sliders", express.static("./uploads/sliders"));

//? Test Route
app.use("/", (req, res)=>{
  res.send("<center><h1 style='color:Tomato; font-size: 100;'>Main Page!</h1></center>")
});

//? listening to server
app.listen(port, () => console.log("Server is running on port: " + port));
