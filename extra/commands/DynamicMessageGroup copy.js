const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config({ path: "../../my.env" });
const scripts_djs = require("../../src/djs/functions/scripts/scripts_djs.js");
const scripts = require("../../src/djs/functions/scripts/scripts.js");
const createEmb = require("../../src/djs/functions/create/createEmbed.js");
const createBtn = require("../../src/djs/functions/create/createButton.js");
const createActRow = require("../../src/djs/functions/create/createActionRow.js");
const groups = require("../../src/MongoDB/db/schemas/schema_list.js");
const client = require("../../src/djs/index.js");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const createList = require("../../src/djs/commands/Moderation/createList.js");

// list choice auto complete listener

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isAutocomplete()) return;
  if (interaction?.commandName === "add-list-item") {
    
  console.log(`interaction.isAutocomplete()`, interaction, `Done logging interaction`)
    const channel = interaction.channel;
    if(!channel) return;
    let channelLists;
    try {
      channelLists = await lists.find({
      channelId: channel.id,
    }); } catch (error) {
     // scripts.logError(error, `error finding lists in channel`);
     console.log(`user searching for lists in ${channel.name} channel`, `error finding lists in channel`, error)
    }
    const choices = channelLists.map((list) => {
      return { name: list.listTitle, value: list.listTitle.toString() };
    });
  
    // // If I were to filter the choices based on an inputted title name
    // const filteredChoices = choices.filter((choice) =>
    //   choice.name.startsWith(title)
    // );
    // const responseChoices = filteredChoices.map((choice) => ({
    //   name: choice.name,
    //   value: choice.value,
    // }));
    try {
      await interaction.respond(choices ? choices : []);
    } catch (error) {
      if (error.message.includes(`Unknown interaction`)) {
        console.log(
          `An unknown Interaction was Logged\nInteraction User ${interaction?.user?.username}`
        ); // <:android:1083158839957921882>
        return;
      } else {
        return console.log(error);
      }
    }
  }
});



module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-dynamic-message-archive")
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
// bullet point -   <:star_list_point:1092610932938657902>
    const { options } = interaction;
   let groupName = options?.getString("group-name") 

   let groupChannel = options?.getChannel("group-channel");
   // initial response to user
    try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Request to create the ${groupName} dynamic message group was received`,
            description: `<a:LoadingRed:1006206951602008104> \`loading\``,
            color: scripts.getErrorColor(),
          }),
        ],
      });
    } catch (error) {
      console.log(error)
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
        console.log(err)
      }
    }

    // find the list in the database
    let group;
    try {
      group = await groups.findOne({
        channelId: groupChannel.id,
        groupName: groupName,
      });
    } catch (error) {
      scripts.logError(error, `error finding group in database`);
    }
    // if the group doesn't exist, send an error message
    if (!group) {
      console.log(`group not found`)
      console.log(`the group`, group)
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error: Group Not Found`,
            color: scripts.getErrorColor(),
            description: `> \`The group with the name of ${groupName} was not found in this channel.\``,
          }),
        ],
      });
      return;
    }
    // if the list exists, add the new item to the list
    group.groupMessages.push(newItem);

    // format the group string to be sent in the embed
    
  //  let groupString = createList.formatListString(group, group.groupMessages);
   let { author } = group?.embedObj



  //  // configure the new embed
  //   let newListEmbedObj = {
  //     // title: list.listTitle,
  //     description: `\`\`\`\n${listString}\n\`\`\``,
  //     color: scripts.getColor(),
  //     author: {
  //       name: author.name,
  //       iconURL: author.iconURL,
  //     },
  //     footer: {
  //       text: `#${interaction.channel.name} | Last Updated By: ${interaction.user.username}`,
  //       iconURL: interaction.user.avatarURL(),
  //     },
  //     timestamp: true,
  //   };

  //   // update the embedObj in the db list
  //   list.embedObj = newListEmbedObj;
  //   // create the new embed from the obj

  //   let newListEmbed = createEmb.createEmbed(newListEmbedObj);
    

let newEmbeds = createList.createEmbeds(interaction, list);

  // update the first embed with the author properties
  // newEmbeds[0].author = {
  //   name: list?.embeds[0]?.author.name,
  //   iconURL: list?.embeds[0]?.author.iconURL,
  // };

  // switch the schema to array of embeds rather than 1 then use this belwo
   list.embeds = newEmbeds;

    // update the list in the database
    const query = { 
      channelId: interaction.channel.id,
      listTitle: listTitle
    };
    const update = { $set: list };

    try {
      await lists.findOneAndUpdate(query, update, { upsert: true },(err, data) => (err ? console.log(`Ran into 
      some Errors while trying to find and update: `, err) : console.log(`found it and updated it successfully`))
      ).clone()
      console.log(`updated the data to the database w the query: `, query)
    } catch (error) {
        console.log(`an error occurred while trying to update the data to the database: `, error);
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Error: List Not Found`,
              color: scripts.getErrorColor(),
              description: `> \`The list with the title of ${options.getString("list-title")} was not found in this channel.\`\n\`\`\`\n${error}\n\`\`\``,  
            }),
          ],
        });
        return;
    }

    // fetch the message using the message id found in the list

    let msg;
    try {
      msg = await interaction.channel.messages.fetch(list.messageId);
    } catch (error) {
      scripts.logError(error, `error fetching message`);
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error: List Not Found`,
            color: scripts.getErrorColor(),
            description: `> \`The list with the title of ${options.getString("list-title")} was not found in this channel.\`\n\`\`\`\n${error}\n\`\`\``,
          }),
        ],
      });
      return;
    }

// send the new embed in the channel as the list
await msg.edit({ embeds: newEmbeds }).then(async (m) => {
  // send a reply to the user saying the list was created
  await interaction.editReply({
    embeds: [
      createEmb.createEmbed({
       // title: `List Created`,
        description: `:white_check_mark: \`List Updated\``,
        //description: `> **Run the \`/add-list-item\` command to add an item to the list**`,
        color: scripts.getSuccessColor(),
      }),
    ],
  });

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
