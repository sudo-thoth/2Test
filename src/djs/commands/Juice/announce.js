// IMPORTS
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Collection,
  PermissionsBitField,
  
} = require("discord.js");

const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const scripts_mongoDB = require("../../functions/scripts/scripts_mongoDB.js");


// Put this in scripts_djs.js instead of here
// NEED TODO : Update all variables below


// Slash Command
let attachmentCollection = new Collection();
let interactionCollection = new Collection();




const commandName = "announce";
const commandDescription = "Send an announcement to a channel in the server";


module.exports = {
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription(commandDescription)
    // slot for user to select which text channel they would like to send the announcement into (Required)
    .addChannelOption((option) =>
      option
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setName("sendto")
        .setDescription("The channel you would like to announce in")
        .setRequired(true)
    )
    // slot for the music file NOT required
    .addAttachmentOption((option) =>
      option
        .setName("attachment")
        .setDescription("The file you would like to attach to the announcement")
    )
    // slot for user to select which roles they want to tag in the message, Up to 3, non required
    .addRoleOption((opt) =>
      opt
        .setName("role1")
        .setDescription("The Roles you would like to tag in your announcement")
    )
    .addRoleOption((opt) =>
      opt.setName("role2").setDescription("Optional Additional roles to tag")
    )
    .addRoleOption((opt) =>
      opt.setName("role3").setDescription("Optional Additional roles to tag")
    ),
};
