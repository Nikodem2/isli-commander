const discord = require("discord.js");
const fs = require("fs");
require("path");
const { Permissions } = require("discord.js");
const talkedRecently = new Set();
const mongoose = require("mongoose");

function handler(path, folder, bot, config) {
	bot.commands = new Discord.Collection();
	fs.readdir(path += '/' += folder += '/', (err, files) => {
		if (err) console.log(err);

		let jsfile = files.filter((f) => f.split(".").pop() === "js");
		if (jsfile.length <= 0) {
			console.log("Couldn't find commands.");
			return;
		}
		var a = {};
		global.aliases = {};
		jsfile.forEach((f, i) => {
			let props = require(`./commands/${f}`);
			console.log(`${f} loaded!`);
			if (props.help.aliases) {
				for (let i = 0; i < props.help.aliases.length; i++) {
					a[props.help.aliases[i]] = props.help.name;
				}
			}
			bot.commands.set(props.help.name, props);
			aliases = a;
		});
	});
}
module.exports = handler;
