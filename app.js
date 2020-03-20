const express = require("express");
const app = express();
const mongo = require("mongodb");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Link = require("./models/link.js")

const cors = require("cors");
app.use(cors({optionSuccessStatus: 200}));

app.use('/public', express.static('public')); //why this?!

//body parser to be able to use req.body!
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/hello", function(req, res) {
	res.json("Hello API!");
});

app.post("/api/shorturl/new", function(req, res) {
	console.log(req.body);
	res.send("yas");
});


let port = process.env.PORT || 8000;
app.listen(port, function() {
	console.log("URL Shortener listening on " + port + "!")
});