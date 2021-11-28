const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	message.channel.send(bot.guilds.cache.map((guild) => guild.name).join(", "));
};

module.exports.help = {
	name: "servers",
	desc: "gets all server",
	category: "⚙️ - Utility",
	owner: true, //false
};
