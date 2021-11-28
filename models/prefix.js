const mongoose = require("mongoose");

const prefix = new mongoose.Schema({
	guildID: { type: String },
	prefix: { type: String },
});
const Prefix = mongoose.model("Prefix", prefix);
module.exports = Prefix;
