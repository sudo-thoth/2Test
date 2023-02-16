const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const client = require("../../index.js");
const dotenv = require("dotenv");
dotenv.config();
let clientId = process.env.clientId;
// clientId = `${clientId}`;

// const clientId = "1055981172318019645";


// get the client id from the client object

// get the current guild id 
// const guild = client.user.guild.id;

 // const guildId = client.user.guild.id;

module.exports = async (client, commandFolders, path) => {
  client.commandArray = [];
  const filteredCommandFolders = commandFolders.filter(folder => !folder.includes('.DS_Store'));
  for (folder of filteredCommandFolders) {
    const commandFiles = fs
  .readdirSync(`${path}/${folder}`)
  .filter((file) => file.endsWith(".js") && !file.includes('.DS_Store'));
    for (const file of commandFiles) {
      const command = require(`../../commands/${folder}/${file}`);
      client.commands.set(command.data.name, command);
      client.commandArray.push(command.data.toJSON());
    }
  }

  const rest = new REST({
    version: "9",
  }).setToken(process.env.token);

  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");
      //console.log(`Logged in as ${client.user.tag}!`);
console.log(`the client-->`, client)
      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });

      console.log("Successfully reloaded application (/) commands.");
      console.log(`Load Commands: ✅`);
    } catch (error) {
      console.error(`Load Commands: ❌`);
       console.error(error);
    }
  })();
  console.log(`Handle Commands: ✅`);
};
