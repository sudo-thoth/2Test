const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the discord server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to be banned.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the ban.")
    ),

  async execute(interaction) {
    const { options } = interaction;

    const user = options.getUser("target");
    const reason = options.getString("reason")
      ? options.getString("reason")
      : "No reason provided.";

    let member;
    try {
      member = await interaction.guild.members.fetch(user.id);
    } catch (error) {
      console.error(`Failed Fetch Attempt`, error);
    }

    const errEmbed = new EmbedBuilder()
      .setDescription(
        `You can't take action on ${user.username} since they have a higher role than you.`
      )
      .setColor(0xc72c3b);

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    ) {
      console.log(`Ban Request Denied: ❌`);

      try {
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
      } catch (error) {
        console.log(`Failed Negative Ban Message Attempt`, error);
      }
    } else {
      try {
        await member.ban({ reason });
      } catch (error) {
        console.error(`Failed Ban Attempt`, error);
      }

      const embed = new EmbedBuilder()
        .setDescription(
          `:white_check_mark: Successfully banned ${user} with reason: ${reason}`
        )
        .setColor(0x5fb041)
        .setTimestamp();

      try {
        await interaction.reply({
ephemeral: true,
          embeds: [embed],
        });
      } catch (error) {
        console.error(`Failed Positive Ban Message Attempt`, error);
      }
      console.log(`Ban Request Accepted: ✅`);
    }
    console.log(`Ban Command Complete: ✅`);
  }
};
