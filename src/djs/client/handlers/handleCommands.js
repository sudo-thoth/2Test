const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");


const dotenv = require("dotenv")
dotenv.config({ path: "../../../../my.env" });

const { Test_Bot_token, Test_Bot_clientId } = process.env;
const clientId = Test_Bot_clientId;

module.exports = async (client, commandFolders, path) => {
  client.commandArray = [];
  const filteredCommandFolders = commandFolders.filter(folder => !folder.includes('.DS_Store'));
  for (const folder of filteredCommandFolders) {
    const commandFiles = fs
      .readdirSync(`${path}/${folder}`)
      .filter((file) => file.endsWith(".js") && !file.includes('.DS_Store'));
  
    for (const file of commandFiles) {
      const command = require(`../../commands/${folder}/${file}`);
      if (folder === 'lastFM') break;
        
    
        client.commands.set(command.data?.name, command);
        client.commandArray.push(command.data?.toJSON());
      

      // if were to do an alt way w prefix commands
      // if (folder === 'lastFM') {
      //   client.lfcommands.set(command.name, command);
      //   if (command.aliases) {
      //     for (let i = 0; i < command.aliases.length; i++) {
      //       client.lfcommands.set(command.aliases[i], command)
      //     }
      //   }
      // } else if (folder === 'snipes') {
      //   client.scommands.set(command.data.name, command);
      //   scommands.push(command.data.toJSON());
      // } else {
      //   client.commands.set(command.data.name, command);
      //   client.commandArray.push(command.data.toJSON());
      // }
    }
  }

  const rest = new REST({
    version: "9",
  }).setToken(Test_Bot_token);


  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

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
