const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require("dotenv").config({ path: "../../my.env" });
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const client = require("../../index.js");
const groups = require("../../../MongoDB/db/schemas/schema_dynamicMessageGroup.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete-dynamic-message")
    .setDescription("Delete a Message to Dynamic group of messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("message-id")
        .setDescription("The message id of the message to delete to the group")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }

    const { options } = interaction;

    let messageID = options?.getString("message-id");

    let groupsFound;
    try {
      groupsFound = await groups.find({
        channelId: interaction.channel.id,

      });
    } catch (error) {
      scripts.logError(error, `error finding group`);
    }

    // fetch message
    let theMessage;
    try {
      theMessage = await interaction.channel.messages.fetch(messageID);
    } catch (error) {
      console.log(`error fetching message`, error);
      return await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error Occurred`,
            description: `Error fetching message\n__Error:__\n\`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          }),
        ],
      });
    }
    if (!theMessage || theMessage?.author.id !== client.user.id){
      return await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error Occurred`,
            description: `The Message ID Given \`${messageID}\` Is Not Attached To Any Messages Created by <@${client.user.id}> in #${interaction.channel.id}`,
            color: scripts.getErrorColor(),
          }),
        ],
      });
    }
    
    if (!groupsFound || groupsFound.length === 0) {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error Occurred`,
            description: `There are No Groups in <#${interaction.channel.id}>`,
            color: scripts.getErrorColor(),
          }),
        ],
      });
      await scripts.delay(5000);
      return await interaction.deleteReply();
    }

    let relGroups = [];
    let relevantGroups = [];

    groupsFound.forEach((group) => {
      // define a new let for an array of the groups that contain a message in its messages array with the same currentID property as the messageID
      relGroups = group.messages.filter(
        (message) => message.currentID === messageID
      );
      if (relGroups.length > 0) {
        relevantGroups.push(group);
      }
    });
    // for every group in relevantGroups, remove the message from the messages array and update the database. If there are no messages left after the removal, set the onlinestatus property to false
    for (let group of relevantGroups) {
      if (group.messages?.length > 0) {
        group.messages = group.messages.filter(
          (message) => message.currentID !== messageID
        );
      }
      if (group.messages?.length === 0 || !group.messages) {
        group.onlineStatus = false;
      }
      try {
        await groups.findOneAndUpdate(
          {
            channelId: interaction.channel.id,
            groupName: group.groupName,
          },
          {
            messages: group.messages || [],
            onlineStatus: group.onlineStatus,
          }
        );
      } catch (error) {
        scripts.logError(error, `error saving group`);
      }
    }
    // if there are no relevant groups, return an error
    if (!relevantGroups || relevantGroups.length === 0) {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error Occurred`,
            description: `The Message ID Given \`${messageID}\` Is Not Within Any Dynamic Message Groups in <#${interaction.channel.id}>`,
            color: scripts.getErrorColor(),
          }),
        ],
      });
      await scripts.delay(5000);
      return await interaction.deleteReply();
    }
    // if there are relevant groups, return a success message

    let res;

    let relevantGroupsString = ``;
    for (const group of relevantGroups) {
      relevantGroupsString += `\`-\` \`${group.groupName}\`\n`;
    }

    try {
      res = await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Message Removed from Dynamic Groups`,
            description: relevantGroupsString,
            color: scripts.getSuccessColor(),
          }),
        ],
      });
    } catch (error) {
      return console.log(error);
    }
  },
};
