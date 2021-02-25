const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
var multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
// db connection
mongoose.connect("mongodb://localhost:27017/Blog", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	// we're connected!
	console.log("db connected");
});

// configuration for multer ,file handling middleware
var upload = multer({ dest: "uploads" });

// app middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());

// routes
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
app.get("/home", (req, res) => {
	res.send("home");
});

// use routes
app.use("/api", userRoutes);
app.use("/api", authRoutes);


const port = 7000;
app.listen(port, () => {
	console.log(`server running at port ${process.env.PORT}`);
});

process.on("uncaughtException", (err) => {
	console.log("uncaught exception", err);
});
