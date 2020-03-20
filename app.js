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


app.post("/api/shorturl/new", [isLink, findNumOfLinks], function(req, res) {
	let originalLink = req.body.url;
	let count = req.count + 1; //count is number of links in db + 1
	let newLink = {original_url: originalLink, short_url: count};
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
	Link.find({short_url: short_url}, function(err, foundLink) {
		if (err || !foundLink) {
			console.log(err);
			res.send("Link not found!")
		} else {
			res.json({"original_url": foundLink[0].original_url, "short_url": foundLink[0].short_url});
		}
	})

})

function isLink(req, res, next) {
	let checkLink = req.body.url;
	let regexHttp = /^https?:\/\/.+/gi;
	let regexWww = /^www\..+/gi;
	if (regexHttp.test(checkLink)) {
		console.log("correct link");
		next();
	} else if (regexWww.test(checkLink)) {
		console.log("correct link");
		next();
	} else {
		res.json({"error": "Please provide a valid url!"});
	}
}

function findNumOfLinks(req, res, next) {
	Link.find({}, function(err, foundLinks) {
		if (err) {
			console.log(err);
		} else {
			req.count = foundLinks.length;
			next();
		}
	});;
}


let port = process.env.PORT || 8000;
app.listen(port, function() {
	console.log("URL Shortener listening on " + port + "!")
});