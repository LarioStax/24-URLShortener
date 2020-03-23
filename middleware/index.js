const Link = require("../models/link.js")

let middlewareObject = {};

middlewareObject.isLink = function(req, res, next) {
	let checkLink = req.body.url;
	let regexHttp = /^https?:\/\/.+/gi;
	let regexWww = /^www\..+/gi;
	if (regexHttp.test(checkLink)) {
		next();
	} else if (regexWww.test(checkLink)) {
		next();
	} else {
		res.json({"error": "Please provide a valid url!"});
	}
}

middlewareObject.findNumOfLinks = function(req, res, next) {
	Link.find({}, function(err, foundLinks) {
		if (err) {
			res.send(err);
		} else {
			req.count = foundLinks.length;
			next();
		}
	});;
}

module.exports = middlewareObject;