const Discord = require("discord.js");
const Prefix = require("../models/prefix");
const mongoose = require("mongoose");
const config = require("../config.json");
mongoose
	.connect(
		"mongodb+srv://2137:LtMTvXirxLTuPVQp@cluster0.zonfz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
		}
	)
	.then(console.log("Connected to mongo"));

module.exports.run = async (bot, message, args) => {
	if (args[0] == config.prefix) {
		await Prefix.remove({ prefix: config.prefix });
	} else {
		await Prefix.findOneAndUpdate(
			{
				guildID: message.guild.id,
			},
			{
				guildID: message.guild.id,
				prefix: args[0],
			},
			{
				upsert: true,
			}
		).then(
			message.channel.send(`Prefix was sucsessfully changed to ${args[0]}`)
		);
	}
};

module.exports.help = {
	name: "prefix",
	desc: "changes the prefix for the server",
	category: "⚙️ - Utility",
	permissions: "ADMINISTRATOR",
};
