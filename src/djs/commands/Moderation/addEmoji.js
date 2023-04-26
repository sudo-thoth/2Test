
const client = require("../../index.js");

const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-emoji')
    .setDescription('steal an emoji and add it to the server')
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option
        .setName('emoji')
        .setDescription('the emoji')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const emoji = options.getString('emoji');
    try{
    await interaction.deferReply({ephemeral: true});
  } catch (error) {
    return console.log(error)
  }

const guild = interaction.guild;
const botMember;
try{
botMember = await guild.members.fetch(client.user.id)
} catch (error) {
console.log(error)
}
        // Check if bot has permission to manage emojis
        if (!botMember?.permissions.has(Permissions.FLAGS.MANAGE_GUILD_EXPRESSIONS)) {
            return interaction.editReply({embeds:[createEmb.createEmbed({description: `<@${interaction.client.user.id}> does not have permission to manage emojis on this server. It must have permission to manage Emojis and Stickers`, color: scripts.getErrorColor()})]});
        }

        try {
            // Create the emoji
            const createdEmoji = await guild.emojis.create(emoji, {
                reason: `Added by ${interaction.user.tag}`
            });
            await interaction.editReply({embeds:[createEmb.createEmbed({description: `Emoji added successfully: ${createdEmoji}`, color: scripts.getSuccessColor()})]});
            await scripts.delay(6000)
            await interaction.deleteReply()
        } catch (error) {
            console.error(error);
            await interaction.editReply({embeds:[createEmb.createEmbed({description: `There was an error adding the emoji.\n\n**Error:**\n${error}`, color: scripts.getErrorColor()})]});
        }
  
  },
};
