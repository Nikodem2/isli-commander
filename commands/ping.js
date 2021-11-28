const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	message.channel.send("Pinging...").then((m) => {
		var ping = m.createdTimestamp - message.createdTimestamp;
		m.edit(`**:ping_pong: Pong! Bot's Ping Is: ${ping}ms**`);
	});
};

module.exports.help = {
	name: "ping",
	desc: "shows ping",
	category: "⚙️ - Utility",
};
