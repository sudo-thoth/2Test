const { SlashCommandBuilder } = require("@discordjs/builders");
const scripts = require("../../functions/scripts/scripts.js");
const createEmbed = require("../../functions/create/createEmbed.js");

const commandName = "sendselectroles";
const commandDescription =
  "Send a self-assign role select menu to a channel. [ first 10 role option emojis are assigned ]";
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const createEmb = require("../../functions/create/createEmbed.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}`)
    .addChannelOption((option) =>
      option
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setName("roleselectmenutarget")
        .setDescription("The channel you want to post the role selection menu in")
        .setRequired(true)
    )
    // slot for user to select which roles they want to tag in the message, Up to 24, non required
    .addRoleOption((opt) =>
      opt
        .setName("role1")
        .setDescription("[:tada:] <- 1st Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role2")
        .setDescription("[:speaking_head:] <- 2nd Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role3")
        .setDescription("[:musical_note:] <- 3rd Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role4")
        .setDescription("[:file_folder:] <- 4th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role5")
        .setDescription("[:cinema:] <- 5th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role6")
        .setDescription("[:cd:] <- 6th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role7")
        .setDescription("[:moneybag:] <- 7th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role8")
        .setDescription("[🎛️] <- 8th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role9")
        .setDescription("[:lock:] <- 9th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role10")
        .setDescription("[:newspaper:] <- 10th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role11")
        .setDescription("[] <- 11th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role12")
        .setDescription("[] <- 12th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role13")
        .setDescription("[] <- 13th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role14")
        .setDescription("[] <- 14th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role15")
        .setDescription("[] <- 15th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role16")
        .setDescription("[] <- 16th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role17")
        .setDescription("[] <- 17th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role18")
        .setDescription("[] <- 18th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role19")
        .setDescription("[] <- 19th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role20")
        .setDescription("[] <- 20th Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role21")
        .setDescription("[] <- 21st Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role22")
        .setDescription("[] <- 22nd Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role23")
        .setDescription("[] <- 23rd Role to add to role options")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role24")
        .setDescription("[] <- 24th Role to add to role options")
    )
};
