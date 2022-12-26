const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(`discord.js`);
require("dotenv").config();
const fs = require('fs');
const { token } = process.env;
const client = new Client({
    intents: [ GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent ]});
 
client.commands = new Collection();

client.on('ready', () => {
    console.log('---------- >> Bot is Online << ----------');
    client.user.setActivity('with my code', { type: 'PLAYING' });
});

console.log(`token: ${token}`)


const functionFolders = fs.readdirSync("./src/functions");



client.login(token);








const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();


