
const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const scripts = require("../../functions/scripts/scripts.js");
  const createEmbed = require("../../functions/create/createEmbed.js");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("whois")
      .setDescription("get info about a user.")
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("User to get to know more about.")
          .setRequired(true)
      ),
  
    async execute(interaction) {
      const { options } = interaction;
  
      const member = options.getMember("target");
      const memberInfoObj = scripts.geMemberInfoObj(member);
      const {name, displayName, userId, avatar, role, joined, created, messages, kicks, bans, warns } = memberInfoObj;

      scripts.cLog(messages)
      const embedObj = {
        title: `${displayName} User Info`,
        description: `**Name:** ${name}\n**Role:** ${role}`,
        color: `${scripts.getColor()}`,
        fields: [
            {
                name: `Date ${displayName} Joined the Server`,
                value: joined,
                inline: true
            },
            {
                name: `Date ${displayName} Joined Discord`,
                value: created,
                inline: true
            },
            {
                name: `Total Number of Messages ${displayName} has Sent in the Server`,
                value: messages,
                inline: true
            },
            {
                name: `Total Number of Kicks ${displayName} has Received in the Server`,
                value: kicks === undefined ? 0 : kicks,
                inline: true
            },
            {
                name: `Total Number of Warnings ${displayName} has Received in the Server`,
                value: warns === undefined ? 0 : warns,
                inline: true
            }
        ],
        thumbnail: avatar,
        footer: {
            text: `User Info Request by: ${interaction.user.username}`,
            icon_url: interaction.user.avatarURL()
        }
      }
      const errEmbed = new EmbedBuilder()
      .setDescription(
        `An Error Occurred while retrieving information about : ${name}`
      )
      .setColor(0xc72c3b);
      const memberInfoEmbed = createEmbed(embedObj);

        try {
            await interaction.reply({ embeds: [memberInfoEmbed] });
          } catch (error) {
            console.log(`whois Request Denied: ❌`);
            try {
            await interaction.reply({ embeds: [errEmbed], ephemeral: true });
            } catch (error) {
                scripts.logError(error, `Failed sending error embed to the user`);
            }
            scripts.logError(error, `Failed Member Info Embed Attempt`);
          }
          console.log(`whois Request Accepted: ✅`);





          console.log(`whois Command Complete: ✅`);

    }
}