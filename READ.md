## Isli commander

Isli commander is a Discord.JS command handler made by Tofix.js. The goal of the package is to make simple and easy to make commands in discord.js wihout worrying about command handler

## Dependecies

Node.js v16.6 or newer\
discord.js v13 or newer

## Documentation (coming soon)

## Installation

```bash
npm i isli-commander
```

## Support & Feature Request

Click here

## Usage

```js
const handler = require("isli-commander");
require("path");
const DJS = require("discord.js");
const { Intents } = require("discord.js");
const client = new DJS.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		//these ones you need
	],
});
client.on("ready", async () => {
	handler(__dirname, "/Your folder name/", client, {
		prefix: "Your prefix here",
		owners: ["Your discord user id"],
		mongoURI: "Your mongo uri here", //optional used for per server prefixes
	});
});
client.login("Your token here");
```

## Example commad

```js
const DJS = require("discord.js");
module.exports.run = async (bot, message, args /*the arguments u can use*/) => {
	message.channel.send("pong");
};
module.exports.help = {
	name: "ping",
	desc: "description of the command",
	category: "other", //used for the help menu (optional)
	permissions: ["ADMINISTRATOR"], //optional
	owner: false, //checks if u are the owner of the bot (optional)
};
```

![](https://i.imgur.com/uHKxzgZ.gif)
