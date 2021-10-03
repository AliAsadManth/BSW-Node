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
const user = "admin";
const pass = "admin";
const db = "bsw";
// const url = "mongodb+srv://"+user+":"+pass+"@cluster0.gmbxc.mongodb.net/"+db+"?retryWrites=true&w=majority";
const url = "mongodb://"+user+":"+pass+"@cluster0-shard-00-00.gmbxc.mongodb.net:27017,cluster0-shard-00-01.gmbxc.mongodb.net:27017,cluster0-shard-00-02.gmbxc.mongodb.net:27017/"+db+"?ssl=true&replicaSet=atlas-5wgyx3-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("Connected to mongoDB :)"));

// Routes
app.use("/user", require("./routes/user"));

app.get("/", (req, res)=>{
  res.send("Haalo");
});


// listening to server
app.listen(port, () => console.log("Server is running on port: " + port));
