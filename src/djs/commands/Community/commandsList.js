const { SlashCommandBuilder } = require("@discordjs/builders");
const message = ``;
const commandName = "commandslist";
const commandDescription = 'Get a list of all the commands';
const scripts = require('../../functions/scripts/scripts.js');

// making the funcName bold in the success and fail messages
module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}`),
  async execute(interaction) {
    let commandsList = scripts.getCommands(interaction.client, `${commandName}`);

    const interactionObj = scripts.getInteractionObj(interaction);
    const message = `**${interactionObj.userInfo.displayName}**, here is a list of all the commands:
    ${commandsList}`;
    try {
	await interaction.reply({content: message, ephemeral: true});
} catch (error) {
  scripts.logError(error, `Failed while replying to interaction with command list: ${interaction.commandName}`);
	
}
    console.log(`${commandName} Complete: ✅`);
  }
};
