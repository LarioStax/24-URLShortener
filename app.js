const express = require("express");
const app = express();
const mongo = require("mongodb");
const mongoose = require("mongoose");

const cors = require("cors");
app.use(cors({optionSuccessStatus: 200}));

app.use('/public', express.static('public')); //why this?!

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/hello", function(req, res) {
	res.json("Hello API!");
});


app.listen("8000", function() {
	console.log("URL Shortener listening on " + "8000" + "!")
})