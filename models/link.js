const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
	"original_url": "",
	"short_url": ""
})

let Link = mongoose.model("Link", linkSchema);
module.exports = Link;