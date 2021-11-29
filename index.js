const Discord = require("discord.js");
const fs = require("fs");
require("path");
const mongoose = require("mongoose");
const Prefix = require("./models/prefix");
const { Permissions } = require("discord.js");

function handler(path, folder, bot, config) {
	bot.commands = new Discord.Collection();
	console.log(`[Isli commander] The prefix has been set to ${config.prefix}`);
	if (config.mongoURI) {
		mongoose
			.connect(config.mongoURI, {
				useUnifiedTopology: true,
				useNewUrlParser: true,
			})
			.then(console.log("Connected to mongo"));
	}
	fs.readdir((path += folder), (err, files) => {
		if (err) console.log(err);

		let jsfile = files.filter((f) => f.split(".").pop() === "js");
		if (jsfile.length <= 0) {
			console.log("Couldn't find commands.");
			return;
		}
		var a = {};
		global.aliases = {};
		jsfile.forEach((f, i) => {
			let props = require(`${path}${f}`);
			if (props.help.aliases) {
				for (let i = 0; i < props.help.aliases.length; i++) {
					a[props.help.aliases[i]] = props.help.name;
				}
			}
			bot.commands.set(props.help.name, props);
			aliases = a;
		});
		console.log(`[Isli Commander] Loaded ${jsfile.length} commnads!`);
	});
	fs.readdir((__dirname += "/commands/"), (err, files) => {
		if (err) console.log(err);

		let jsfile = files.filter((f) => f.split(".").pop() === "js");
		if (jsfile.length <= 0) {
			console.log("Couldn't find commands.");
			return;
		}
		jsfile.forEach((f, i) => {
			let props = require(`${__dirname}${f}`);
			if (!config.mongoURI) {
				if (props.help.name != "prefix") {
					if (props.help.aliases) {
						for (let i = 0; i < props.help.aliases.length; i++) {
							a[props.help.aliases[i]] = props.help.name;
						}
					}
					bot.commands.set(props.help.name, props);
				}
			} else {
				if (props.help.aliases) {
					for (let i = 0; i < props.help.aliases.length; i++) {
						a[props.help.aliases[i]] = props.help.name;
					}
				}
				bot.commands.set(props.help.name, props);
			}
		});
	});
	bot.on("messageCreate", async (message) => {
		if (message.mentions.members.first()) {
			if (
				message.mentions.members.first().user.username == client.user.username
			) {
				if (config.mongoURI != undefined) {
					await Prefix.find({
						guildID: message.guild.id,
					}).then((data) => {
						if (data[0]) {
							E = data[0].prefix;
							message.channel.send(`My prefix is ${E}`);
						} else {
							message.channel.send(`My prefix is ${config.prefix}`);
						}
					});
				}
			}
		}
		if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (config.mongoURI) {
			await Prefix.find({
				guildID: message.guild.id,
			}).then((data) => {
				if (data[0]) {
					prefix = data[0].prefix;
					return prefix;
				}
			});
		}
		if (!prefix) {
			var prefix = config.prefix;
		}
		let messageArray = message.content.split(" ");
		let cmd = messageArray[0].toLowerCase();
		let args = messageArray.slice(1);
		//Check for prefix
		if (!cmd.startsWith(prefix)) return;
		var commandfile = bot.commands.get(cmd.slice(prefix.length));
		var al = Object.keys(aliases).length;
		for (var i = 0; al > i; i++) {
			if (cmd.slice(prefix.length) == Object.keys(aliases)[i]) {
				var commandfile = bot.commands.get(aliases[Object.keys(aliases)[i]]);
			}
		}
		if (commandfile) {
			if (commandfile.help.permissions) {
				if (
					message.member.permissions.has(
						Permissions.FLAGS[commandfile.help.permissions]
					)
				) {
					if (commandfile.owner == true) {
						if (config.owners.includes(message.author.id)) {
							commandfile.run(bot, message, args, config);
						}
					} else {
						commandfile.run(bot, message, args, config);
					}
				} else {
					message.reply({ content: "No perms", ephemeral: true });
				}
			} else {
				if (commandfile.owner == true) {
					if (config.owners.includes(message.author.id)) {
						commandfile.run(bot, message, args, config);
					}
				} else {
					commandfile.run(bot, message, args, config);
				}
			}
		}
	});
}

module.exports = handler;
