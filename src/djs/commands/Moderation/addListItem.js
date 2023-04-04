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

// list choice auto complete listener

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isAutocomplete()) return;

  const channel = interaction.channel;
  if(!channel) return;
  const channelLists = await lists.find({
    channelId: channel.id,
    listTitle: { $regex: `^${title}`, $options: "i" },
  });
  const choices = channelLists.map((list) => {
    return { name: list.listTitle, value: list.listTitle };
  });

  const filteredChoices = choices.filter((choice) =>
    choice.name.startsWith(title)
  );
  const responseChoices = filteredChoices.map((choice) => ({
    name: choice.name,
    value: choice.value,
  }));
  await interaction.respond({ options: responseChoices });
});



module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-list-item")
    .setDescription("Add a new item/entry to a list")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("list-title")
        .setDescription("The Title of the List")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) => 
      option
        .setName("new-item")
        .setDescription("The new entry or line to add")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }
// bullet point -   <:star_list_point:1092610932938657902>
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
