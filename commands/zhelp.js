const { MessageEmbed } = require("discord.js");
const { MessageActionRow } = require("discord.js");
const { MessageSelectMenu } = require("discord.js");
module.exports.run = async (bot, message, args) => {
	var count = Array.from(bot.commands).length;
	const desc = Array.from(bot.commands.values());
	var cmd = {};
	var cmdraw = {};
	var returns = false;
	for (i = 0; i < count; i++) {
		if (!desc[i].help.category) {
			if (desc[i].help.owner != true) cmd["other"] += [desc[i].help.name + " "];
		} else {
			if (desc[i].help.owner != true) {
				cmd[desc[i].help.category] += [desc[i].help.name + " "];
			}
		}
	}
	Object.keys(cmd).forEach(function (key) {
		cmd[key] = typeof cmd[key] === "string" ? cmd[key].slice(9) : cmd[key];
		cmd[key] = typeof cmd[key] === "string" ? cmd[key].slice(0, -1) : cmd[key];
		cmd[key] = typeof cmd[key] === "string" ? cmd[key].split(" ") : cmd[key];
	});
	cmdraw = cmd;
	Object.keys(cmd).forEach(function (key) {
		for (i = 0; cmd[key].length > i; i++) {
			var e = bot.commands.get(cmdraw[key][i]);
			cmd[key][i] += " - " + bot.commands.get(cmd[key][i]).help.desc;
			if (e.help.aliases) {
				cmd[key][i] += "\n" + "aliases: " + e.help.aliases;
			}
		}
	});

	var categories = Object.keys(cmd);
	var dropdown = [];
	for (i = 0; i < Object.keys(cmd).length; i++) {
		dropdown.push({
			label: categories[i],
			value: categories[i],
		});
	}
	const row = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("help")
			.setPlaceholder("Choose Category")
			.addOptions(dropdown)
	);
	const exampleEmbed = new MessageEmbed()
		.setColor("#0099ff")
		.setTitle("Commands")
		.setURL("https://youtu.be/d1YBv2mWll0")
		.setAuthor(
			bot.user.username,
			bot.user.displayAvatarURL({ size: 1024, dynamic: true })
		)
		.setThumbnail(bot.user.displayAvatarURL({ size: 1024, dynamic: true }))
		.setTimestamp()
		.setFooter(
			"The god is watching",
			bot.user.displayAvatarURL({ size: 1024, dynamic: true })
		);
	Object.keys(cmd).forEach(function (key) {
		exampleEmbed.addField(key + " - " + cmd[key].length + " commands", "⠀");
	});
	var mogus = await message.channel.send({
		embeds: [exampleEmbed],
		components: [row],
	});
	setTimeout(() => {
		returns = true;
	}, 60000);
	bot.on("interactionCreate", async (interaction) => {
		if (returns == true) return;
		if (!interaction.isSelectMenu()) return;
		if (interaction.customId == "help") {
			if (interaction.user.id == message.author.id) {
				const embed = new MessageEmbed()
					.setTitle("Help")
					.setColor("#0099ff")
					.setAuthor(
						bot.user.username,
						bot.user.displayAvatarURL({ size: 1024, dynamic: true })
					)
					.setThumbnail(
						bot.user.displayAvatarURL({ size: 1024, dynamic: true })
					)
					.addField(interaction.values[0], cmd[interaction.values].join("\n"))
					.setTimestamp()
					.setFooter(
						"The god is watching",
						bot.user.displayAvatarURL({ size: 1024, dynamic: true })
					);
				await interaction.deferUpdate();
				await mogus.edit({ embeds: [embed] });
			} else {
				interaction.reply({
					content: "Do not change someone elses help >:(",
					ephemeral: true,
				});
			}
		}
	});
};

module.exports.help = {
	name: "help",
	desc: "this",
	category: "⚙️ - Utility",
};
