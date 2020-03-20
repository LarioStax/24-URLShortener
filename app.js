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

mongoose.connect("mongodb://localhost/url_shortener",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true 
	});

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/hello", function(req, res) {
	res.json("Hello API!");
});

app.post("/api/shorturl/new", function(req, res) {
	let originalLink = req.body.url;
	let randomNumber = Math.floor(Math.random(1)*1000); //refactor this later to count all items in db collection and set it to that number!
	let newLink = {original_url: originalLink, short_url: randomNumber};
	console.log(originalLink);
	console.log(randomNumber);
	console.log(newLink);
	Link.create(newLink, function(err, newLink) {
		if (err) {
			console.log(err);
		} else {
			console.log(newLink);
			res.send("Success!!!");
		}
	})
});

app.get("/api/shorturl/:num", function(req, res) {
	let short_url = Number(req.params.num);
	console.log(typeof short_url)
	Link.find({short_url: short_url}, function(err, foundLink) {
		if (err || !foundLink) {
			console.log(err);
			res.send("Link not found!")
		} else {
			console.log(foundLink);
			// res.json(foundLink);
			res.json({"original_url": foundLink[0].original_url, "short_url": foundLink[0].short_url});
		}
	})

})


let port = process.env.PORT || 8000;
app.listen(port, function() {
	console.log("URL Shortener listening on " + port + "!")
});