const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
require("dotenv").config({ path: "../../my.env" });
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const groups = require("../../../MongoDB/db/schemas/schema_dynamicMessageGroup.js");
const mongoose = require("mongoose");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-dynamic-message-group")
    .setDescription("A Dynamic group of messages reposted every 30 minutes")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("group-name")
        .setDescription("The Name of the Dynamic Message Group")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setName("group-channel")
        .setDescription("The channel you would like to host the group in")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }
    const { options } = interaction;
    let groupName = options?.getString("group-name");
    let groupChannel = options?.getChannel("group-channel");
    try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Request to create the ${groupName} dynamic message group was received`,
            description: `<a:LoadingRed:1006206951602008104> \`loading\``,
            color: scripts.getColor(),
          }),
        ],
      });
    } catch (error) {
      console.log(error);
      try {
        await interaction.user.send({
          embeds: [
            createEmb.createEmbed({
              title: `Error: Request to create the ${groupName} dynamic message group was received`,
              description: `Error Log: \n\`\`\`js\n${error}\n\`\`\``,
              color: scripts.getErrorColor(),
            }),
          ],
        });
      } catch (err) {
        console.log(err);
      }
    }
    let group;
    try {
      group = await groups.findOne({
        channelId: groupChannel.id,
        groupName: groupName,
      });
    } catch (error) {
      scripts.logError(error, `error finding group in database`);
    }
    if (!group) {
      console.log(`group not found`);
      try {
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: ``,
              description: `<a:LoadingRed:1006206951602008104> \`Creating the ${groupName} Dynamic Message Group\``,
              color: scripts.getColor(),
            }),
          ],
        });
      } catch (error) {
        console.log(error);
        try {
          await interaction.user.send({
            embeds: [
              createEmb.createEmbed({
                title: `Error: Creating the ${groupName} Dynamic Message Group`,
                description: `Error Log: \n\`\`\`js\n${error}\n\`\`\``,
                color: scripts.getErrorColor(),
              }),
            ],
          });
        } catch (err) {
          console.log(err);
        }
      }
      let obj = {};
      obj._id = `${new mongoose.Types.ObjectId()}`;
      obj.messages = [];
      obj.groupName = groupName;
      obj.channelId = groupChannel.id;
      obj.serverId = groupChannel.guild.id;
      obj.groupID = scripts_djs.getRandID();
      obj.onlineStatus = false;
      try {
        await groups.create(obj);
        console.log(
          `The [ Group Name: ${obj.groupName} , Group id: ${obj.groupID} ] was JUST saved to the database`
        );
      } catch (error) {
        console.log(
          `Error while trying to save The [ Group Name: ${obj.groupName} , Group id: ${obj.groupID} ] to the database: `,
          error
        );
        return await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Error Occurred`,
              description: `\`There was an error with the database, please try again\``,
              footer: { text: `If error persists, contact the Devs` },
              color: scripts.getColor(),
            }),
          ],
        });
      }
      console.log(`the group`, group);
      return await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `${groupName} Group Has Been Created`,
            color: scripts.getSuccessColor(),
            description: `**__TO ADD A MESSAGE__**\n> Run \`/add-Dynamic-Message\` to add a message to the group\n  OR\n> Right-click any message in the channel -> go to apps -> select \`Add to Dynamic Message Group\``,
          }),
        ],
      });
    } else {
      console.log(`group is already created with the same name found`);
      return await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error Occurred`,
            description: `\`There is already a Group Registered to the #${groupChannel.id} channel, please try again with a Different Name\``,
          }),
        ],
      });
    }
  },
};
