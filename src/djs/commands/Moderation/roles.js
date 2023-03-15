// a roles command that allows the user to add, remove, or view all the roles the member passed in has (any member in the server, not just the user who ran the command)
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
      .setName("roles")
      .setDescription(
       'View all the roles a member has, or add or remove a role from a member.'
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
      .addUserOption((option) =>
      option
        .setName("user")
        .setDescription('Select a User to manage their roles.')
        .setRequired(true)
    )
          .addStringOption((option) =>
            option
              .setName("action")
              .setDescription('Select an action to perform.')
              .setRequired(true)
              .addChoices(
                { name: "VIEW", value: "view" },
                { name: "ADD", value: "add" },
                { name: "REMOVE", value: "remove" },
              )
          )
          .addRoleOption((option) =>
          option
          .setName("role")
          .setDescription('Select a role to add or remove.')
            .setRequired(false)
          ),
  
    async execute(interaction) {
      try {
        await interaction.deferReply({ ephemeral: true });
      } catch (error) {
        scripts.logError(error, `error deferring reply`);
      }
     try {
       await interaction.editReply({embeds:[createEmb.createEmbed({title:`Downloading Now`})]})
     } catch (error) {
      scripts.logError(error, `error editing reply`);
     }
      const { options } = interaction;
      const action = options.getString("action")
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
  