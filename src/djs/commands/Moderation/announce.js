// IMPORTS
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Collection,
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
  async execute(interaction) {
    console.log(`🦾 ~ <<Announce>> Command Entered`);
    let randID = `#${Math.floor(Math.random() * 90000) + 10000}`;
    if (!interaction) return;

    let interactionObj = scripts_djs.getInteractionObj(interaction)

    

    // The attachment if the user to includes an attachment
    let attachment = null, role1 = null, role2 = null, role3 = null, targetChannel;
    attachment = interaction.options.getAttachment("attachment") ? interaction.options.getAttachment("attachment") : null;
    
    role1 = interaction.options.getRole("role1") ? interaction.options.getRole("role1") : null;
   
    role2 = interaction.options.getRole("role2") ? interaction.options.getRole("role2") : null;
    
    role3 = interaction.options.getRole("role3") ? interaction.options.getRole("role3") : null;
    
    targetChannel = interaction.options.getChannel("sendto");
    

    let roles = [role1, role2, role3];
    if (roles.length <= 0) {
      roles = [];
    } else {
      roles = roles.filter((role) => role != null );
    }
    


    let attachmentURL = attachment ? attachment.url : null;
    let userId = interaction.user.id ? interaction.user.id : null;
    let channelId = interaction.channel.id ? interaction.channel.id : null;

    


    console.log(`🦾 ~ <<Announce>> Command Entered`);

    // Save the data to the database
    let data = {
      userId: userId,
      channelId: channelId,
      randID: randID,
      attachmentURL: attachmentURL,
      roles: roles,
    }

    scripts_mongoDB.saveSlashCommandData(data);
    


    // take this attachment, check if its file size is less than 8 mb, then return true or false whether in order to determine to send as a file or prompt the user to get an external link for the file

    let validFile = (attachment) => {
      if (attachment) {
        const size = attachment.size;
        console.log(`Actual Size : ${size} Vs. Max Size : ${8 * 1024 * 1024}`);
        // Checking if file is larger than max file send size | 8mb
        if (size >= 8 * 1024 * 1024) {
          console.log("File Size TOO BIG per Discord Api Rules");

          return -1;
        } else {
          console.log("Attachment Size Valid ~ Sending as file attachment");
          return 0;
        }
      } else {
        // No Attachment present
        console.log(`User did not input an attachment`);
        return 1;
      }
    };


    // Variable containing whether the attachment is valid or not
    let validStatus = validFile(attachment);

    

    // SWITCH TO CHECK THE OUTCOME OF VALID SIZE AND GO FORWARD ACCORDINGLY

    switch (validStatus) {
      // : VALID FILE PRESENT
      case 0:
        console.log(
          `Sending Q: \'What kind of Announcement would you like to make? \'`
        );

        interaction.reply({
          ephemeral: true,
          embeds: [scripts_djs.embed_Announcement_File(interaction, randID)],
          components: [
            await scripts_djs.row_Announcement(randID),
          ],
        });

        break;

      // : INVALID FILE PRESENT
      case -1:
        console.log(`Sending -1 interaction`);
        let embed = scripts_djs.embed_FileSizeTooBig(interaction, randID)
        let choiceRow = scripts_djs.row_FileSizeTooBig(randID)

        message_fileSizeTooBig = {
          content: `Select One of the 2 Options`,
          embeds: [embed],
          ephemeral: true,
          components: [choiceRow],
        };
        await interaction.editReply(message_fileSizeTooBig);
        break;

      // : NO FILE PRESENT
      case 1:
        console.log(
          `Sending Q: \'What kind of Announcement would you like to make? \'`
        );
        let row = await scripts_djs.row_Announcement(randID)
        let row2 = await scripts_djs.row2_Announcement(randID)
        try {
        interaction.reply({
          ephemeral: true,
          embeds: [scripts_djs.embed_Announcement_NoFile(interaction, randID)],
          components: [row, row2],
        });
      } catch (error) {
        scripts.logError(error, "unable to send reply message")
      }

        break;

      default:
    }
  },
};
