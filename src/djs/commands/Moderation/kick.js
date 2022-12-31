const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const scripts = require("../../functions/scripts/scripts.js");

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
      scripts.logError(error, `Failed Fetch Attempt`);
    }

    const errEmbed = new EmbedBuilder()
      .setDescription(
        `You can't take action on ${user.username} since they have a higher role.`
      )
      .setColor(0xc72c3b);

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position || interaction.guild.me.roles.highest.position <
      member.roles.highest.position || !interaction.guild.me.permissions.has(PermissionFlagsBits.KickMembers)
    ) {
      console.log(`Kick Request Denied: ❌`);

      try {
        await interaction.reply({ embeds: [errEmbed], ephemeral: true });
      } catch (error) {
        scripts.logError(error, `Failed Negative Ban Message Attempt`);
      }
    } else {
      try {
        await member.kick(reason);
      } catch (error) {
        scripts.logError(error, `Failed Kick Attempt`);
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
        scripts.logError(error, `Failed Positive Kick Message Attempt`);
      }
      console.log(`Kick Request Accepted: ✅`);
    }
    console.log(`Kick Command Complete: ✅`);
  }
};
