const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const createEmb = require("../../functions/create/createEmbed.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("upload-files")
    .setDescription(
      "Upload files to get later, using # thats sent [ IF NO Before/After ID opt's == ALL Files Uploaded ]"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("upload-all-audio-files")
        .setDescription("Upload all the audio files from the channel. (Use before & after ID opts to set a range/limit)")
        .addChannelOption((option) =>
          option
            .setName("target-channel")
            .setDescription("Select a channel to upload the files from [ IF YOU IGNORE: Command is Run in CURRENT Channel ]")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("before-message-id")
            .setDescription("Enter the Message ID of the <Newest> message; Sets me to Upload every File Found BEFORE it >")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("after-message-id")
            .setDescription("Enter the Message ID of the <Oldest> message; Sets me to Upload every File Found AFTER it >")
            .setRequired(false)
        )
  )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("upload-all-kraken-files")
        .setDescription("Upload all kraken audio files within the channel. (Use before & after ID opts to set a range/limit)")
        .addChannelOption((option) =>
          option
            .setName("target-channel")
            .setDescription("Select a channel to upload the files from [ IF YOU IGNORE: Command is Run in CURRENT Channel ]")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("before-message-id")
            .setDescription("Enter the Message ID of the <Newest> message; Sets me to Upload every File Found BEFORE it >")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("after-message-id")
            .setDescription("Enter the Message ID of the <Oldest> message; Sets me to Upload every File Found AFTER it >")
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      console.log(`error occurred with the defer`)
      scripts.logError(error, `error deferring reply`);
    }
    const { options } = interaction;
    const type = options.getSubcommand();
    const target = options.getChannel("target-channel");
    const beforeID = options.getString("before-message-id");
    const afterID = options.getString("after-message-id");

    if (beforeID && afterID) {
      try{
        await interaction.editReply({ embeds: [createEmb.createEmbed({
          title: "Warning!",
          description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the after ID Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
          color: scripts.getErrorColor(),
        })] });
      } catch (error) {
        scripts.logError(error, `error editing reply`);
      }
      await scripts.delay(5000);
      try{
        await interaction.editReply({ embeds: [createEmb.createEmbed({
          title: "Warning! \`continuing with command in\` \`5\`",
          description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the after ID Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
          color: scripts.getErrorColor(),
        })] });
      } catch (error) {
        scripts.logError(error, `error editing reply`);
      }
      await scripts.delay(1000);
      try{
        await interaction.editReply({ embeds: [createEmb.createEmbed({
          title: "Warning! \`continuing with command in\` \`4\`",
          description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the after ID Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
          color: scripts.getErrorColor(),
        })] });
      } catch (error) {
        scripts.logError(error, `error editing reply`);
      }
      await scripts.delay(1000);
      try{
        await interaction.editReply({ embeds: [createEmb.createEmbed({
          title: "Warning! \`continuing with command in\` \`3\`",
          description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the after ID Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
          color: scripts.getErrorColor(),
        })] });
      } catch (error) {
        scripts.logError(error, `error editing reply`);
      }
      await scripts.delay(1000);
      try{
        await interaction.editReply({ embeds: [createEmb.createEmbed({
          title: "Warning! \`continuing with command in\` \`2\`",
          description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the after ID Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
          color: scripts.getErrorColor(),
        })] });
      } catch (error) {
        scripts.logError(error, `error editing reply`);
      }
      await scripts.delay(1000);
      try{
        await interaction.editReply({ embeds: [createEmb.createEmbed({
          title: "Warning! \`continuing with command in\` \`1\`",
          description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the after ID Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
          color: scripts.getErrorColor(),
        })] });
      } catch (error) {
        scripts.logError(error, `error editing reply`);
      }
      await scripts.delay(1000);

    }
    const userId = interaction.user.id;;
    const user = interaction.user;
    // this the first listener, that calls function
    switch (type) {
      case "upload-all-audio-files":
        await scripts_djs.uploadFileBatch(interaction, target, beforeID, afterID)
        break;
      case "upload-all-kraken-files":
        await scripts_djs.uploadKrakenLinksBatch(interaction, target, beforeID, afterID)
        break;
    }
  },
};
