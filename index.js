const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initializing app and port

const app = express();
const port = process.env.PORT || 5000;

// middlewares

app.use(express.json());
app.use(cors({ credentials: true, origin: true }));

// Conecting with DB

const url =
  "mongodb+srv://admin:admin@cluster0.gmbxc.mongodb.net/bsw?retryWrites=true&w=majority";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("connected to mongoDB :)"));

// listening to server

app.listen(port, () => console.log("Server is running on port: " + port));
