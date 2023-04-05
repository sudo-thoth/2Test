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



module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("delete-list")
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
            title: `Request to delete a list was Received`,
            description: `<a:LoadingRed:1006206951602008104> \`deleting list \``,
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
    let list  = isList.list;
 // create the buttons and action row full of the buttons for the pagination to function
  let yesButton = await createBtn.createButton({
    label: "yes",
    style: "SUCCESS",
    customID: "list_delete_yes_button",
    disabled: false,
  });
  let noButton = await createBtn.createButton({
    label: "no",
    style: "DANGER",
    customID: "list_delete_no_button",
    disabled: false,
  });
 
  let buttonRow = await createActRow.createActionRow({
    components: [yesButton, noButton],
  });

  // create the embed to be sent 
  let embed = createEmb.createEmbed({
    description: `\`Are You Sure You Want To Delete the <${list.listTitle}> List?\``,
    color: scripts.getErrorColor()
  });

try {
  
    let res;
    try {
      res = await interaction.editReply({embeds: [embed], components: [buttonRow] });
  } catch (error ) {
    console.log(error)
    if(error.message.includes(`DiscordAPIError[50035]: Invalid Form Body`)){
      try {
        return await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error: Deleting List `,
            color: scripts.getErrorColor(),
            description: `> \`The list you chose to delete was not found (according to the database)\`\n\`\`\`\n${error}\n\`\`\``,  
          }),
        ],
      });
      } catch(err) {
        try {
          return await interaction.user.send({
          embeds: [
            createEmb.createEmbed({
              title: `Error: Deleting List`,
              color: scripts.getErrorColor(),
              description: `> \`The list you chose to delete was not found (according to the database)\`\n\`\`\`\n${error}\n\`\`\``,  
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
            title: `An Error Occurred: Deleting List`,
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
if (!res) return;
  const filter = (i) => i.user.id === interaction.user.id;
  const collectorCallback = async (i) => {


    if (i.customId === "list_delete_yes_button") {
      try {
        await i.deferReply({ ephemeral: true });
      } catch (error) {
        scripts.logError(error, `error deferring reply`);
      }
      lists.findOneAndDelete({messageId: msgID}).then(async () => {
        try{
          let listMessage = await i.channel.messages.fetch(msgID)
          await listMessage.delete()
        } catch(err){
          try {
            await i.editReply({embeds: [createEmb.createEmbed({color: scripts.getColor(), description: `\`Error Deleting List\`\n\n\`\`\`js\n${err}\n\`\`\``})]})
            await scripts.delay(5000)
            try {
              return await i.deleteReply();
            } catch (error) {
               return console.log(error)
            }
          } catch (error) {
             return console.log(error)
          }
        }
        await i.editReply({embeds: [createEmb.createEmbed({description: `\`List Deleted\``})]})
        await scripts.delay(5000)
    try {
      await i.deleteReply();
    } catch (error) {
      console.log(error)
    }
  }).catch(async (err) => {
    console.log(err)
    try {
      await i.editReply({embeds: [createEmb.createEmbed({color: scripts.getColor(), description: `\`Error Deleting List\`\n\n\`\`\`js\n${err}\n\`\`\``})]})
      await scripts.delay(5000)
      try {
        await i.deleteReply();
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  })
    } else if (i.customId === "list_delete_no_button") {
      try {
        await i.deferReply({ ephemeral: true });
      } catch (error) {
        scripts.logError(error, `error deferring reply`);
      }
      try {
        await i.deleteReply()
      } catch (error) {
        console.log(error)
      }
    }
  };

  const collector = res.createMessageComponentCollector(filter,{
    time: 10000,
  } );
  
      // Start collector.
      
      collector.on('collect', collectorCallback);
      collector.on('end', async (collected) => {
        // Disable all buttons after the collector has ended.
        buttonRow.components.forEach((button) => {
          button.setDisabled(true);
        });

       try {
         await res.edit({embeds: [], components: [buttonRow] });
         await scripts.delay(3000);
         await res.delete();
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
