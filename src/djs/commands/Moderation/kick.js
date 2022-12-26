const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the discord server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to be kicked.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the kick.")
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
        `You can't take action on ${user.username} since they have a higher role.`
      )
      .setColor(0xc72c3b);

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    ) {
      console.log(`Kick Request Denied: ❌`);

      try {
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
      } catch (error) {
        console.log(`Failed Negative Ban Message Attempt`, error);
      }
    } else {
      try {
        await member.kick(reason);
      } catch (error) {
        console.error(`Failed Kick Attempt`, error);
      }

      const embed = new EmbedBuilder()
        .setDescription(
          `:white_check_mark: Successfully kicked ${user} with reason: ${reason}`
        )
        .setColor(0x1cd154);

      try {
        await interaction.reply({
          embeds: [embed],
        });
      } catch (error) {
        console.log(`Failed Positive Kick Message Attempt`, error);
      }
      console.log(`Kick Request Accepted: ✅`);
    }
    console.log(`Kick Command Complete: ✅`);
  }
};
