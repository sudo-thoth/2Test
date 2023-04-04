const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config({ path: "../../my.env" });
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const createBtn = require("../../functions/create/createButton.js");
const createActRow = require("../../functions/create/createActionRow.js");
const lists = require("../../../MongoDB/db/schemas/schema_list.js");
const client = require("../../index.js");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-list")
    .setDescription(
      "Create an Embeded Custom and Editable List" // it will create an embed for the user to use as the 'list' then another command will allow them tho add a line to the 'list' in the embed description and another command will allow them to remove a line from the 'list' in the embed description
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option // this is the title of the list embed,
        .setName("list-title")
        .setDescription("The Title of the List")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }

    const { options } = interaction;
   
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: `Request to create list in <#${interaction.channel.id}> Received`,
          description: `<a:LoadingRed:1006206951602008104> \`loading ${options.getString("list-title")} list\``,
          color: scripts.getErrorColor(),
        }),
      ],
    });
    let listEmbedObj = {
      // title: `${options.getString("list-title")}`,
      description: `\`Run the /add-list-item command to add your first item to the list!\` \n\`\`\`\n \`\`\``,
      color: scripts.getColor(),
      author: {
        iconURL: `${interaction.guild.iconURL()}`,
        // name: `\u200B`
        name: `${options.getString("list-title")}`
      }, 
      footer: {
        text: `Last Updated By: ${interaction.user.username} | #${interaction.channel.name}`,
        iconURL: `${interaction.user.avatarURL()}`
      }
    }
  // create an embed to send in the channel as the list\
  let listEmbed = createEmb.createEmbed(listEmbedObj);
// send the new embed in the channel as the list
interaction.channel.send({ embeds: [listEmbed] }).then(async (msg) => {
  // send a reply to the user saying the list was created
  await interaction.editReply({
    embeds: [
      createEmb.createEmbed({
       // title: `List Created`,
        description: `:white_check_mark: \`List Created\``,
        //description: `> **Run the \`/add-list-item\` command to add an item to the list**`,
        color: scripts.getSuccessColor(),
      }),
    ],
  });

  // create a new list
  const newList = {
    _id: new mongoose.Types.ObjectId(),
    guildId: `${interaction.guild.id}`,
    guildName: `${interaction.guild.name}`,
    channelId: `${interaction.channel.id}`,
    channelName: `${interaction.channel.name}`,
    messageId: `${msg.id}`,
    messageURL: `${msg.url}`,
    listTitle: `${options.getString("list-title")}`,
    listItems: [],
    embedObj: listEmbedObj,
  }

      let result = await lists.create(newList);
      if (result) {
        console.log("Document created:", result);
        
      } else {
        console.error("Error creating document:", result);
        try {
          await interaction.user.send({
            embeds: [
              createEmb.createEmbed({
                title: `Error Occurred!`,
                description: `Error Report:\n*send to steve jobs if problem persists*\n\`\`\`js\nunable to save the list to the database, please use \`/reconnect\` & try again\n\`\`\``,
                color: scripts.getErrorColor()
              })      
            ]
          })
        } catch (err) {
          console.log(`error-->>>`, err)
          
        }
      }
}).catch(async (error) => {
  try {
    await interaction.user.send({
      embeds: [
        createEmb.createEmbed({
          title: `Error Occurred!`,
          description: `Error Report:\n*send to steve jobs if problem persists*\n\`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor()
        })      
      ]
    })
  } catch (err) {
    console.log(`og error-->>>`, error)
    
  }
})
 
  },
};
