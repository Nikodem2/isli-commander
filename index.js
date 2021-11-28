const discord = require('discord.js')
const fs = require('fs')
const path = require('path')
const { Permissions } = require("discord.js");
const talkedRecently = new Set();
const mongoose = require("mongoose")


function handler(path, folder, client) {
  client.Prefix = require("./models/prefix");
  if (client.config.mongoURI) {
    mongoose
	.connect(
		client.config.mongoURI,
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
		}
	)
	.then(console.log("Connected to mongo"));
  }
  client.commands = new discord.Collection();
const comfolder = path += folder
  fs.readdir(comfolder, (err, files) => {
	if (err) console.log(err);

	let jsfile = files.filter((f) => f.split(".").pop() === "js");
	if (jsfile.length <= 0) {
		console.log("Couldn't find commands.");
		return;
	}
	var a = {};
	global.aliases = {};
	jsfile.forEach((f, i) => {
		let props = require(`${comfolder}${f}`);
		console.log(`${f} loaded!`);
		if (props.help.aliases) {
			for (let i = 0; i < props.help.aliases.length; i++) {
				a[props.help.aliases[i]] = props.help.name;
			}
		}
		client.commands.set(props.help.name, props);
		aliases = a;
	});
});
client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;
	if (client.config.mongoURI) {
	  await client.Prefix.find({
		guildID: message.guild.id,
	}).then((data) => {
		if (data[0]) {
			prefix = data[0].prefix;
			return prefix;
		}
	});
	}
	if (!prefix) {
		var prefix = client.config.prefix;
	}
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0].toLowerCase();
	let args = messageArray.slice(1);
	//Check for prefix
	if (!cmd.startsWith(prefix)) return;

	if (talkedRecently.has(message.author.id)) {
		message.channel.send(
			`Wait a few secs before using the commands again - ${message.author} `
		);
	} else {
		var sus = Math.floor(Math.random() * 101);
		if (sus == 55) {
			message.channel.send("sus");
		} else {
			var commandfile = client.commands.get(cmd.slice(prefix.length));
			var al = Object.keys(aliases).length;
			for (var i = 0; al > i; i++) {
				if (cmd.slice(prefix.length) == Object.keys(aliases)[i]) {
					var commandfile = client.commands.get(aliases[Object.keys(aliases)[i]]);
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
							if (client.config.owners.includes(message.author.id)) {
								commandfile.run(client, message, args);
								talkedRecently.add(message.author.id);
								setTimeout(() => {
									talkedRecently.delete(message.author.id);
								}, 5000);
							}
						} else {
							commandfile.run(client, message, args);
							talkedRecently.add(message.author.id);
							setTimeout(() => {
								talkedRecently.delete(message.author.id);
							}, 5000);
						}
					} else {
						message.reply({ content: "No perms", ephemeral: true });
					}
				} else {
					if (commandfile.owner == true) {
						if (bot.config.owners.includes(message.author.id)) {
							commandfile.run(client, message, args);
							talkedRecently.add(message.author.id);
							setTimeout(() => {
								talkedRecently.delete(message.author.id);
							}, 5000);
						}
					} else {
						commandfile.run(client, message, args);
						talkedRecently.add(message.author.id);
						setTimeout(() => {
							talkedRecently.delete(message.author.id);
						}, 5000);
					}
				}
			}
		}
	}
});
}
module.exports = handler