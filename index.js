require("dotenv").config();
const express = require("express");

//? Initializing app and port
const app = express();
const port = process.env.PORT;

//? middlewares
require("./middlewares/common")(app);

//? Conecting with DB
require("./utils/db");

//? Routes
app.use("/", require("./routes/routes"));

//! Static Image and Slider folders
app.use("/uploads/images", express.static("./Uploads/images"));
app.use("/uploads/pdf", express.static("./Uploads/pdf"));
app.use("/uploads/sliders", express.static("./Uploads/sliders"));

//? Test Route
app.use("/", (req, res) => {
  res.send(
    "<center><h1 style='color:Tomato; font-size: 100;'>Main Page!</h1></center>"
  );
});

//? listening to server
app.listen(port, () => console.log("Server is running on port: " + port));
