const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const get = require("../../functions/Handling Files/functions.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("download")
    .setDescription(
      "Send to your Dms or a Channel; Use a unique batch ID to download all files from a previous save."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("download-to-dms")
        .setDescription("Download files to your Dms.")
        .addStringOption((option) =>
    option
      .setName("batch-id")
      .setDescription("Enter the batch ID of the files you want to download.")
      .setRequired(true)
    )
    
  )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("download-to-channel")
        .setDescription("Download files to a channel of your choice.")
        .addChannelOption((option) =>
          option
            .setName("target-channel")
            .setDescription("Select a channel to download the files to.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("batch-id")
            .setDescription("Enter the batch ID of the files you want to download.")
            .setRequired(true)
        )
        
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }
    await interaction.editReply({embeds:[createEmb.createEmbed({title:`Downloading Now`})]})
    const { options } = interaction;
    const type = options.getSubcommand();
    const target = options.getChannel("target-channel");
    const batchID = options.getString("batch-id");
    const user = interaction.user;
    // this the first listener, that calls function

    if (type === "download-to-dms") {

        await get.downloadMessageBatch(batchID, user, interaction)

    }
    if (type === "download-to-channel") {

        await get.downloadMessageBatch(batchID, target, interaction)

    }
  },
};
