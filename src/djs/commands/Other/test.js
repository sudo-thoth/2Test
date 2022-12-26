const { SlashCommandBuilder } = require("@discordjs/builders");
const message = `The Command Works!`;
const commandName = "test";
const commandDescription = "Test command";
module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}}`),
  async execute(interaction) {
    try {
      await interaction.reply({
        content: `${message}`,
        ephemeral: true,
      });
      console.log(`Test Command Successfully Executed: ✅`);
    } catch (error) {
      console.log(`Test Command Failed to Execute: ❌`, error);
    }
    console.log(`Test Command Complete: ✅`);
  }
};
