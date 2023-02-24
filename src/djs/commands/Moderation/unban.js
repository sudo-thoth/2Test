const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from the discord server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("Discord ID of the user you want to unban.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;

    const userId = options.getString("userid");

    try {
      try {
        await interaction.guild.members.unban(userId);
      } catch (error) {
        console.error(`Failed Unban Attempt`, error);
      }

      const embed = new EmbedBuilder()
        .setDescription(
          `:white_check_mark: Successfully unbanned id ${userId} from the guild.`
        )
        .setColor(0x5fb041)
        .setTimestamp();

      try {
        await interaction.reply({
          embeds: [embed],
        });
      } catch (error) {
        console.error(`Failed Positive Unban Message Attempt`, error);
      }
      console.log(`Unban Request Accepted: ✅`);
    } catch (err) {
      console.error(`Failed Unban Attempt`, error);

      const errEmbed = new EmbedBuilder()
        .setDescription(`Please provide a valid member's ID.`)
        .setColor(0xc72c3b);

      try {
        interaction.reply({ embeds: [errEmbed], ephemeral: true });
      } catch (error) {
        console.error(`Failed Negative Unban Message Attempt`, error);
      }
      console.log(`Unban Request Denied: ❌`);
    }
    console.log(`Unban Command Complete: ✅`);
  }
};
