const {
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Collection,
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
  if (!interaction.isMessageContextMenuCommand()) return;
  if (interaction?.commandName === "delete-list-item") {
    
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

    function formatListString(list) {
      let listString = ''; 
      list?.listItems?.forEach((item, index) => {
        if (index === 0) {
          listString += `> ${item}`;
        } else {
          listString += `\n> ${item}`;
        }
      });
      return listString;
    }

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("delete-list-item")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    ,
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }
    // bullet point -   <:star_list_point:1092610932938657902>
   // initial response to user
    try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Request to delete a list item from a List was Received`,
            description: `<a:LoadingRed:1006206951602008104> \`loading list \``,
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
              title: `Error: Request to delete a list item to the List was Received`,
              description: `Error Log: \n\`\`\`js\n${error}\n\`\`\``,
              color: scripts.getErrorColor(),
            }),
          ],
        });
      } catch (err) {
        console.log(err)
      }
    }
    // get the message id of the message that the user right clicked on, then search the database for it, if its not there tell the user that message is not a elgible list, otherwise get the items of the list and show them as options to be deleted within a select menu with pagination for lists with more than 25 items and therefore more than 1 select menu of choices to cylce through
    let targetMsg = interaction.targetMessage;
    let msgID = targetMsg.id;

    async function isMsgList(msgID){
      let list;
      try {
        list = await lists.findOne({
          messageId: msgID,
        });
      } catch (error) {
        scripts.logError(error, `error finding list`);
      }
      if (list) {
        return { found: true, list };
      } else {
        return { found: false };
      }
    }

    let isList = await isMsgList(msgID);
    if(!isList.found) {
      return await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Message Ineligible`,
            description: `The [Message](${targetMsg.url}) is not a valid list\n\`Use /create-list to start a new list\``,
            color: scripts.getErrorColor(),
          }),
        ]
      })
    } 
    let list = isList.list;
    
// now send the user a message with pagination of select menus showing all the available listItems from the list 

// for every group of 25 listItems create a new array. so an array of arrays
let itemGroups = [];

for (let i = 0; i < list.listItems.length; i += 25) {
  itemGroups.push(list.listItems.slice(i, i + 25));
}
// for each itemGroup within itemGroups, create one selectMenu and push it to the menus array
 // For each itemGroup within itemGroups, create one Select Menu and push it to the menus array.
 let menus = [];
 itemGroups.forEach((itemGroup, index) => {
   // Convert the items from the itemGroup to an array of options.
   let options = [];
   itemGroup.forEach((item, index2) => {
     if (item.length > 100) {
       item = item.slice(0, 96) + "...";
     }
     options.push({
       label: item,
       value: `${index}_${index2}`,
     });
   });

   let selectMenu = new StringSelectMenuBuilder()
     .setCustomId('selectmenu_list_delete')
     .setPlaceholder('Nothing selected')
     .setMinValues(1)
     .addOptions(options);

   menus.push(selectMenu);
 });

 // For pagination, always have 1 Select Menu action row displaying at a time.
 // There will be 3 buttons: one to go to the next page/Select Menu, one to go back,
 // and one that is in between the other two and is disabled, gray, and with a label
 // showing the current index of pages out of the current total of pages.
 // Use a collector that times out after 30 seconds of inactivity to collect interactions.
 // Create the pagination object.
 let pagination = {
   currentPage: 0,
   totalPages: menus.length,
   menus: menus,
   collector: null,
   collectorFilter: (i) => {
     return i.customId === 'selectmenu_list_delete' && i.user.id === interaction.user.id;
   },
   collectorOptions: {
     time: 30000,
   },
   collectorCallback: async (i) => {
     // Get the values from the Select Menu.
     let values = i.values;

     // Handle user's selection.
     let selectedItems = [];
     let itemGroups = pagination.menus[pagination.currentPage].options.map((option) => option.label);
     let selectedIndexes = values.map((value) => {
       let [groupsIndex, groupIndex] = value.split('_');
       return [groupsIndex, groupIndex];
     });

     selectedIndexes.forEach(([groupsIndex, groupIndex]) => {
       selectedItems.push(itemGroups[groupsIndex][groupIndex]);
     });

     // Delete selected items.
     list.listItems = list.listItems.filter((item) => !selectedItems.includes(item));

    // update the list in the database
    const query = { 
      messageId: interaction?.message?.id,

    };
    const update = { $set: list };

    try {
      await lists.findOneAndUpdate(query, update, { upsert: true },(err, data) => (err ? console.log(`Ran into 
      some Errors while trying to find and update: `, err) : console.log(`found it and updated it successfully`))
      ).clone()
      console.log(`updated the data to the database w the query: `, query)
    } catch (error) {
        console.log(`an error occurred while trying to update the data to the database: `, error);
        return await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Error: List Not Found`,
              color: scripts.getErrorColor(),
              description: `> \`The list was not found in this channel.\`\n\`\`\`\n${error}\n\`\`\``,  
            }),
          ],
        });
        
    }   



     // Send response message to user.
     let responseText = `The following list items have been deleted from the list:\n- ${selectedItems.join('\n- ')}`;
     await interaction.editReply({
       embeds: [
         createEmb.createEmbed({
           title: `List Items Deleted Successfully`,
           description: "```\n"+responseText+"\n```",
           color: scripts.getSuccessColor(),
         }),
       ],
       components: []
     });

     // Update current page of pagination object and edit the message.
     let currentPage = pagination.currentPage;
     let menus = pagination.menus;
     let actionRow = new MessageActionRow().addComponents(menus[currentPage]);
     await i.update({ components: [actionRow] });
   },
 };

 // Create initial action row with first Select Menu.
 let initialMenu = menus[0];
 let actionRow = new MessageActionRow().addComponents(initialMenu);
 await interaction.editReply({ components: [actionRow] });

    



    // if the list exists, add the new item to the list
    list.listItems.push(newItem);

    // format the list string to be sent in the embed
    
   let listString = formatListString(list);
   let { author } = list?.embedObj


   // configure the new embed
    let newListEmbedObj = {
      // title: list.listTitle,
      description: `\`\`\`\n${listString}\n\`\`\``,
      color: scripts.getColor(),
      author: {
        name: author.name,
        iconURL: author.iconURL,
      },
      footer: {
        text: `#${interaction.channel.name} | Last Updated By: ${interaction.user.username}`,
        iconURL: interaction.user.avatarURL(),
      },
      timestamp: true,
    };

    // update the embedObj in the db list
    list.embedObj = newListEmbedObj;
    // create the new embed from the obj

    let newListEmbed = createEmb.createEmbed(newListEmbedObj);



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
await msg.edit({ embeds: [newListEmbed] }).then(async (m) => {
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
