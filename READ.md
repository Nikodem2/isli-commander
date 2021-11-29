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
