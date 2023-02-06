const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("upload-files")
    .setDescription(
      "Upload all files in channel to retrieve later by using a batch ID # sent when the command completes."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles),

  async execute(interaction) {
      await scripts_djs.uploadFileBatch(interaction)
  },
};
