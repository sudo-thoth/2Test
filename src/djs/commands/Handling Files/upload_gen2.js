const {
    SlashCommandBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const scripts = require("../../functions/scripts/scripts.js");
  const get = require("../../functions/Handling Files/functions.js");
  const createEmb = require("../../functions/create/createEmbed.js");
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("upload")
      .setDescription(
        "Upload files to get later, using # thats sent [ IF NO Before/After ID opt's == ALL Files Uploaded ]"
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
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
          ),
  
    async execute(interaction) {
      try {
        await interaction.deferReply({ ephemeral: true });
      } catch (error) {
        console.log(`error occurred with the defer`)
        scripts.logError(error, `error deferring reply`);
      }
      const { options } = interaction;
      const target = options.getChannel("target-channel");
      const beforeID = options.getString("before-message-id");
      const afterID = options.getString("after-message-id");
  
      if (beforeID && afterID) {
        try{
          await interaction.editReply({ embeds: [createEmb.createEmbed({
            title: "Warning!",
            description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the \`after ID\` Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
            color: scripts.getErrorColor(),
          })] });
        } catch (error) {
          try {
            await get.throwErrorReply({
                interaction: interaction,
                error: error,
                action: `error editing reply`,
              })
          } catch (err) {
            console.log(`error occurred with the throwErrorReply`)
            console.log(`Original Error is: `, error)
          }
        }
        await scripts.delay(5000);
        try{
          await interaction.editReply({ embeds: [createEmb.createEmbed({
            title: "Warning! \`continuing with command in\` \`5\`",
            description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the after ID Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
            color: scripts.getErrorColor(),
          })] });
        } catch (error) {
          try {
            await get.throwErrorReply({
                interaction: interaction,
                error: error,
                action: `error editing reply`,
              })
          } catch (err) {
            console.log(`error occurred with the throwErrorReply`)
            console.log(`Original Error is: `, error)
          }
        }
        await scripts.delay(1000);
        try{
          await interaction.editReply({ embeds: [createEmb.createEmbed({
            title: "Warning! \`continuing with command in\` \`4\`",
            description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the after ID Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
            color: scripts.getErrorColor(),
          })] });
        } catch (error) {
          try {
            await get.throwErrorReply({
                interaction: interaction,
                error: error,
                action: `error editing reply`,
              })
          } catch (err) {
            console.log(`error occurred with the throwErrorReply`)
            console.log(`Original Error is: `, error)
          }
        }
        await scripts.delay(1000);
        try{
          await interaction.editReply({ embeds: [createEmb.createEmbed({
            title: "Warning! \`continuing with command in\` \`3\`",
            description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the after ID Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
            color: scripts.getErrorColor(),
          })] });
        } catch (error) {
          try {
            await get.throwErrorReply({
                interaction: interaction,
                error: error,
                action: `error editing reply`,
              })
          } catch (err) {
            console.log(`error occurred with the throwErrorReply`)
            console.log(`Original Error is: `, error)
          }
        }
        await scripts.delay(1000);
        try{
          await interaction.editReply({ embeds: [createEmb.createEmbed({
            title: "Warning! \`continuing with command in\` \`2\`",
            description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the after ID Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
            color: scripts.getErrorColor(),
          })] });
        } catch (error) {
          try {
            await get.throwErrorReply({
                interaction: interaction,
                error: error,
                action: `error editing reply`,
              })
          } catch (err) {
            console.log(`error occurred with the throwErrorReply`)
            console.log(`Original Error is: `, error)
          }
        }
        await scripts.delay(1000);
        try{
          await interaction.editReply({ embeds: [createEmb.createEmbed({
            title: "Warning! \`continuing with command in\` \`1\`",
            description: "You can't use **both** before & after ID options at the same time.\n\n**I am ignoring the before ID option and will upload all files found after the after ID Message option.**\n\nIf you want to upload all files, just ignore the before & after ID options.\n\nIf you want to utilize the before ID option, enter the command again & just ignore the after ID option.",
            color: scripts.getErrorColor(),
          })] });
        } catch (error) {
          try {
            await get.throwErrorReply({
                interaction: interaction,
                error: error,
                action: `error editing reply`,
              })
          } catch (err) {
            console.log(`error occurred with the throwErrorReply`)
            console.log(`Original Error is: `, error)
          }
        }
        await scripts.delay(1000);
  
      }
      const userId = interaction.user.id;;
      const user = interaction.user;
      // this the first listener, that calls function
          await get.uploadMessageBatch(interaction, target, beforeID, afterID)

       
    },
  };
  