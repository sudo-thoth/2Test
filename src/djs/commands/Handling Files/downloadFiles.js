const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("download-files")
    .setDescription(
      "Send to your Dms or a Channel; Use a unique batch ID to download all files from a previous save."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("download-to-dms")
        .setDescription("Download files to your Dms.")
        .addStringOption(option =>
          option.setName('category')
            .setDescription('What kind of File Batch did you save? Message Attachments or Kraken Links? ')
            .setRequired(true)
            .addChoices(
              { name: 'Message Attachment Files', value: 'files_only' },
              { name: 'Kraken Link Files', value: 'kraken_only' },
            ))
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
        .addStringOption(option =>
          option.setName('category')
            .setDescription('What kind of File Batch did you save? Message Attachments or Kraken Links? ')
            .setRequired(true)
            .addChoices(
              { name: 'Message Attachment Files', value: 'files_only' },
              { name: 'Kraken Link Files', value: 'kraken_only' },
            ))
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
    const { options } = interaction;
    const type = options.getSubcommand();
    const target = options.getChannel("target-channel");
    const batchID = options.getString("batch-id");
    const cat = options.getString("category");
    const userId = interaction.user.id;;
    const user = interaction.user;
    // this the first listener, that calls function

    if (type === "download-to-dms") {
      if (cat === "files_only") {
        await scripts_djs.downloadFileBatch(batchID, interaction.user, interaction)
      } else if (cat === "kraken_only") {
        await scripts_djs.downloadKrakenBatch(batchID, interaction.user, interaction)
      }
    }
    if (type === "download-to-channel") {
      if (cat === "files_only") {
        await scripts_djs.downloadFileBatch(batchID, target, interaction)
      } else if (cat === "kraken_only") {
        await scripts_djs.downloadKrakenBatch(batchID, target, interaction)
      }
    }
  },
};
