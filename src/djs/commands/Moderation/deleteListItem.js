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
const createList = require("./createList.js"); 

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

    // function formatListString(list) {
    //   let listString = ''; 
    //   list?.listItems?.forEach((item, index) => {
    //     if (index === 0) {
    //       listString += `> ${item}`;
    //     } else {
    //       listString += `\n> ${item}`;
    //     }
    //   });
    //   return listString;
    // }

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
 for (let i = 0; i < itemGroups.length; i++) {
  let itemGroup = itemGroups[i];
  let options = [];
  for (let j = 0; j < itemGroup.length; j++) {
    let item = itemGroup[j];
    if(item.length > 100){
      item = item.slice(0,96) + "..."
    }
    options.push({
      label: item,
      value: `${i}_${j}`
    });
  }


let selectMenu = new StringSelectMenuBuilder()
.setCustomId('selectmenu_list_delete')
.setPlaceholder('Nothing selected')
.setMinValues(1)
.addOptions(options)

menus.push(selectMenu)

}

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
    // Get the interaction type.
    let interactionType = i.componentType;
    // Handle the interaction based on its type.
    if (interactionType === 3) {

      // Testing
      // try {
      //   await i.reply({ ephemeral: true, content: 'hi' });
      // } catch (error) {
      //   scripts.logError(error, `error deferring reply`);
      // }
      // Testing
      
      try {
        await i.deferReply({ ephemeral: true });
      } catch (error) {
        scripts.logError(error, `error deferring reply`);
      }
      // Get the values from the Select Menu.
      let values = i.values;
  let itemGroups = []
  for (let i = 0; i < list.listItems.length; i += 25) {
  itemGroups.push(list.listItems.slice(i, i + 25));
}

  
      // Handle user's selection.
      let selectedItems = [];
      // let itemGroups = pagination.menus[pagination.currentPage].options.map((option) =>{
        
      //   return option?.data?.label
      // });
      let selectedIndexes = values.map((value) => {
        let [groupsIndex, groupIndex] = value.split('_');
        return [groupsIndex, groupIndex];
      });
  
      selectedIndexes.forEach(([groupsIndex, groupIndex]) => {
        selectedItems.push(itemGroups[groupsIndex][groupIndex]);
      });
  
      // Store the selected items in a variable to use later.
      let itemsToDelete = selectedItems;

      // need to update the list message embed with the new listItems array
      // first get the listItems array from the database
      let listItems = list.listItems;
      // then remove the itemsToDelete from the listItems array
      listItems = listItems.filter((item) => !itemsToDelete.includes(item));
      // then update the listItems array in the database
      list.listItems = listItems


      // Create the Embeds w function here

      let newEmbeds = createList.createEmbeds(i, list)
        // update the first embed with the author properties
  // newEmbeds[0].author = {
  //   name: list?.embeds[0]?.data?.author.name,
  //   iconURL: list?.embeds[0]?.data?.author.iconURL,
  // };
      list.embeds = newEmbeds;


      //

      // let listString = createList.formatListString(list, listItems);
      // // edit the message with the new listItems array in the embed
      // let listEmbed = list.embedObj;
      // listEmbed.description = `\`\`\`\n${listString}\n\`\`\``
      // listEmbed.footer = {
      //   text: `#${i.channel.name} | Last Updated By: ${i.user.username}`,
      //   iconURL: i.user.avatarURL(),
      // }    
      // list.embedObj = listEmbed;
      // // new embed color
      // list.embedObj.color = scripts.getColor();



          // update the list in the database
    const query = { 
      messageId: list.messageId   
    };
    const update = { $set: list };

    try {
      await lists.findOneAndUpdate(query, update, { upsert: true },(err, data) => (err ? console.log(`Ran into 
      some Errors while trying to find and update: `, err) : console.log(`found it and updated it successfully`))
      ).clone()
      console.log(`updated the data to the database w the query: `, query)
    } catch (error) {
        console.log(`an error occurred while trying to update the data to the database: `, error);
        await i.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Error: Deleting List Item`,
              color: scripts.getErrorColor(),
              description: `> \`The list with the title of ${list.listTitle} was not found in this channel.\`\n\`\`\`\n${error}\n\`\`\``,  
            }),
          ],
        });
        return;
    }

    // get the message using the list message id
    let listMsg = await i.channel.messages.fetch(list.messageId);

try {
  await listMsg.edit({ embeds: newEmbeds });
} catch(err){
  console.log(err)
  try {
    await i.user.send({
      embeds: [
        createEmb.createEmbed({
          title: `Error Occurred!`,
          description: `Error Report:\n*send to steve jobs if problem persists*\n\`\`\`js\n${err}\n\`\`\``,
          color: scripts.getErrorColor()
        })      
      ]
    })
  } catch (errr) {
    console.log(`og error-->>>`, err)
    
  }
}
  
      let responseText = `You have successfully deleted the following list items from the list\`\`\`\n\`\`\`- ${itemsToDelete.join('\n- ')}`;
      await i.followUp({
        embeds: [
          createEmb.createEmbed({
            title: `Completed List Item Deletion`,
            description: "```\n"+responseText+"\n```",
            color: scripts.getSuccessColor(),
          }),
        ],
      });

      try {
        await scripts.delay(10000);
      // Delete the select menu.
      return await i.deleteReply()
    } catch(error){
      return console.log(error)
    }
    } else if (interactionType === 2) {
      // Handle pagination button.
      if (i.customId.includes("back")) {
        if (pagination.currentPage > 0) {
          pagination.currentPage--;
        }
      } else if (i.customId.includes("next")) {
        
        if (pagination.currentPage < pagination.totalPages - 1) {
          pagination.currentPage++;
        }
      }
  
      // Update the pagination page button.
      let newPageButton = await createBtn.createButton({
        label: `Page ${pagination.currentPage + 1} of ${pagination.totalPages}`,
        style: "SECONDARY",
        customID: "list_delete_page_button",
        disabled: true,
      });
  
      // Update the action row with the new page button.
      let buttonRow = await createActRow.createActionRow({
        components: [backButton, newPageButton, nextButton],
      });
  
      // Edit the message with the updated action row and menu.
      let actionRow = await createActRow.createActionRow({
        components: [pagination.menus[pagination.currentPage]],
      });
      try {
        await i.update({ components: [actionRow, buttonRow] });
      } catch (error) {
        console.log(error)
        if(error.message.includes(`Unknown interaction`)){
         try {
           await i.reply({embeds: [createEmb.createEmbed({
             title: `An Error Occured`,
             description: `> \`The interaction has expired.\`\n\n\`\`\`js\n${error}\`\`\``,
           })]})
         } catch (error) {
          console.log(error)
         }
        }
      }
    }
    }
  ,
 };

 // Create initial action row with first Select Menu.
 let initialMenu = menus[0];

 let menuRow = await createActRow.createActionRow({
  components: [initialMenu]
 })
 // create the buttons and action row full of the buttons for the pagination to function
  let backButton = await createBtn.createButton({
    label: "Back",
    style: "PRIMARY",
    customID: "list_delete_back_button",
    disabled: false,
  });
  let nextButton = await createBtn.createButton({
    label: "Next",
    style: "PRIMARY",
    customID: "list_delete_next_button",
    disabled: false,
  });
  let pageButton = await createBtn.createButton({
    label: `Page ${pagination.currentPage + 1} of ${pagination.totalPages}`,
    style: "SECONDARY",
    customID: "list_delete_page_button",
    disabled: true,
  });
  let buttonRow = await createActRow.createActionRow({
    components: [backButton, pageButton, nextButton],
  });

  // create the embed to be sent
  let embed = createEmb.createEmbed({
    description: `\`select the item(s) to delete from the list\``,
  });

try {
  
    let menuResponse;
    try {
      menuResponse = await interaction.editReply({embeds: [embed], components: [menuRow, buttonRow] });
  } catch (error ) {
    console.log(error)
    if(error.message.includes(`DiscordAPIError[50035]: Invalid Form Body`)){
      try {
        return await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error: Deleting List Item`,
            color: scripts.getErrorColor(),
            description: `> \`The item you chose to delete was not found in the list (according to the database)\`\n\`\`\`\n${error}\n\`\`\``,  
          }),
        ],
      });
      } catch(err) {
        try {
          return await interaction.user.send({
          embeds: [
            createEmb.createEmbed({
              title: `Error: Deleting List Item`,
              color: scripts.getErrorColor(),
              description: `> \`The item you chose to delete was not found in the list (according to the database)\`\n\`\`\`\n${error}\n\`\`\``,  
            }),
          ],
        });
        } catch(er) {
          console.log(err, `\n\n---\n\nOG Error:`, error)
        }
      }
    } else {
      try {
        return await interaction.user.send({
        embeds: [
          createEmb.createEmbed({
            title: `An Error Occurred: Deleting List Item`,
            color: scripts.getErrorColor(),
            description: `> \`SS & Send the Error to Steve Jobs\`\n\`\`\`\n${error}\n\`\`\``,  
          }),
        ],
      });
      } catch(er) {
        console.log(er, `\n\n---\n\nOG Error:`, error)
      }
    }
  }
  
      // Start collector.
      pagination.collector = menuResponse.createMessageComponentCollector(pagination.collectorFilter, pagination.collectorOptions);
      pagination.collector.on('collect', pagination.collectorCallback);
      pagination.collector.on('end', async (collected) => {
        // Disable all buttons after the collector has ended.
        buttonRow.components.forEach((button) => {
          button.setDisabled(true);
        });
       try {
         await menuResponse.edit({ components: [actionRow, buttonRow] });
         await scripts.delay(3000);
         await menuResponse.delete();
       } catch (error) {
        console.log(error)
        
       }
      });
} catch (err3) {
  console.log(err3)
  try {
    await interaction.user.send({
      embeds: [
        createEmb.createEmbed({
          title: `Error Occurred!`,
          description: `Error Report:\n*send to steve jobs if problem persists*\n\`\`\`js\n${err3}\n\`\`\``,
          color: scripts.getErrorColor()
        })      
      ]
    })
  } catch (errr) {
    console.log(`og error-->>>`, err3)
    
  }
}
},
};
