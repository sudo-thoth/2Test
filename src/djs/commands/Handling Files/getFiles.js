const { SlashCommandBuilder } = require("@discordjs/builders");
const commandName = "getfiles";
const commandDescription = "Get every attachment in the channel";
const scripts_djs = require('../../functions/scripts/scripts_djs.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}`),
  async execute(interaction) {
    // This is the same as the above function, but with an embed
    scripts_djs.gatherChannelFiles(interaction);
  }
};
