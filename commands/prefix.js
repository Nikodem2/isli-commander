const Discord = require("discord.js");
const Prefix = require("../models/prefix");
const mongoose = require("mongoose");
module.exports.run = async (bot, message, args, config) => {
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
