const { SlashCommandBuilder } = require("@discordjs/builders");

const commandName = "membercount";
const commandDescription = "See the member count of the server";

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}`),
  async execute(interaction) {
    const message = `Server Member Count: ${interaction.guild.memberCount}`;
    try {
      await interaction.reply({
        content: `${message}`,
        ephemeral: true,
      });
      console.log(`Member Count Command Successfully Executed: ✅`);
    } catch (error) {
      console.log(`Member Count Command Failed to Execute: ❌`);
    }
    console.log(`Member Count Command Complete: ✅`);
  }
};
