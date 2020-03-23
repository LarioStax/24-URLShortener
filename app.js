const express = require("express");
const app = express();
const mongo = require("mongodb");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Link = require("./models/link.js")

const middleware = require("./middleware/index.js")


//CORS CONFIG FOR FCC TESTS
const cors = require("cors");
app.use(cors({optionSuccessStatus: 200}));

app.use('/public', express.static('public')); //why this?!

//body parser to be able to use req.body!
app.use(bodyParser.urlencoded({extended: false}));

//DOTENV CONFIG
const dotenv = require("dotenv");
dotenv.config();

//MONGOOSE CONFIG
mongoose.connect(process.env.DATABASE_URL,
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


app.post("/api/shorturl/new", [middleware.isLink, middleware.findNumOfLinks], function(req, res) {
	let originalLink = req.body.url;
	let count = req.count + 1; //count is number of links in db + 1
	let newLink = {original_url: originalLink, short_url: count};
	Link.create(newLink, function(err, newLink) {
		if (err) {
			res.send(err);
		} else {
			res.json({"original_url": newLink.original_url, "short_url": newLink.short_url});
		}
	})
});

app.get("/api/shorturl/:num", function(req, res) {
	let short_url = Number(req.params.num);
	Link.find({short_url: short_url}, function(err, foundLink) {
		if (err || !foundLink) {
			res.send("Link not found!")
		} else {
			res.json({"original_url": foundLink[0].original_url, "short_url": foundLink[0].short_url});
		}
	})
});

// ****************************************************************************
// ADDITIONAL THINGS/FUNCTIONALITY TO CODE IN:
// - INDEX PAGE SHOWING ALL EXISTING URLS
// - CHECK WETHER A LINK IS ALREADY INCLUDED AND GIVING EXISTING SHORT URL INSTEAD OF CREATING NEW ONE
// - CREATING A ROUTES FILE AND MOVING THE ROUTES THERE
// - CREATE A COPY WITH CORRECT BEST PRACTICES RESTFUL ROUTING!
// ****************************************************************************

let port = process.env.PORT || 8000;
app.listen(port, function() {
	console.log("URL Shortener listening on " + port + "!")
});