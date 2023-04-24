const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
} = require("discord.js");
require("dotenv").config({ path: "../../my.env" });
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const createBtn = require("../../functions/create/createButton.js");
const createActRow = require("../../functions/create/createActionRow.js");
const groups = require("../../../MongoDB/db/schemas/schema_dynamicMessageGroup.js");
const client = require("../../index.js");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// group choice auto complete listener

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isAutocomplete()) return;
  if (interaction?.commandName === "add-dynamic-message-app") {
    
  console.log(`interaction.isAutocomplete()`, interaction, `Done logging interaction`)
    const channel = interaction.channel;
    if(!channel) return;
    let channelGroups;
    try {
      channelGroups = await groups.find({
      channelId: channel.id,
    }); } catch (error) {
     // scripts.logError(error, `error finding lists in channel`);
     console.log(`user searching for groups in ${channel.name} channel`, `error finding groups in channel`, error)
    }
    const choices = channelGroups.map((group) => {
      return { name: group.groupName, value: group.groupName.toString() };
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
        ); 
        return;
      } else {
        return console.log(error);
      }
    }
  }
});



module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("add-dynamic-message-app")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    ,
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }
    let theMessage = interaction.targetMessage;
    let messageID = interaction.targetId;

   // fetch message

   if(!theMessage || theMessage?.author.id !== client.user.id) return await interaction.editReply({ embeds: [createEmb.createEmbed({title: `Error Occurred`, description: `The Message ID Given \`${messageID}\` Is Not Attached To Any Messages Created by <@${client.user.id}> in #${interaction.channel.id}`, color: scripts.getErrorColor()})]})
 // check if message is in group
    let groupsFound;
    try {
      groupsFound = await groups.find({
        channelId: interaction.channel.id,
      });
    } catch (error) {
      scripts.logError(error, `error finding group`);
    }
    if (!groupsFound || groupsFound.length === 0) {
      return await interaction.editReply({
        embeds: [
          createEmb.createEmbed({ 
            title: `Error Occurred`,
            description: `There are No Groups in <#${interaction.channel.id}>`,
            color: scripts.getErrorColor()
          })
        ],
      });
    }

    // create options for select menu with the names of the groups found
    let options = [];
    groupsFound.forEach((group) => {
      options.push({
        label: group.groupName,
        value: group.groupName,
      });
    });
    if (options.length > 25) {
      options = options.slice(0, 25);
    }
    console.log(options, `options`)
    // create select menu
   let selectMenu = new StringSelectMenuBuilder()
.setCustomId('selectmenu_add_dynamic_message')
.setPlaceholder('Nothing selected')
.setMinValues(1)
.addOptions(options)

let menuRow = await createActRow.createActionRow({
  components: [selectMenu]
 })


 let menuResponse;
    try {
      menuResponse = await interaction.editReply({ components: [menuRow] });
  } catch (error ) {
    console.log(`the menu row`, menuRow, `\n\n`, `the menu response`, menuResponse, `\n\n`, `the select menu`, selectMenu, `\n\n`,)
    return console.log(error)
  }

  console.log(menuResponse, `menu response`)

  let collectObj = {
    collector: null,
    collectorFilter: (i) => {
      return i.customId === 'selectmenu_add_dynamic_message' && i.user.id === interaction.user.id;
    },
    collectorOptions: {
      time: 60000,
    max: 1
    },
    collectorCallback: async (i) => {
      try {
        await i.deferReply({ ephemeral: true });
      } catch (error) {
        scripts.logError(error, `error deferring reply`);
      }
      
      let groupName = i.values[0];
    let group;
    try {
      group = await groups.findOne({
        groupName: groupName,
        channelId: i.channel.id,
      });
    } catch (error) {
      scripts.logError(error, `error finding group`);
    }
    if (!group) {
      return await i.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error Occurred`,
            description: `The Group \`${groupName}\` Was Not Found in #${i.channel.id}`,
            color: scripts.getErrorColor()
          })
        ],
      });
    }
    
    // add the theMessage To the group.messages array
   

    // check if message is already in group
    // for every message obj in groups.messages
    for (let messageObject of group.messages) {
      // if the message obj has the same id as theMessage
      if (messageObject.id === theMessage.id) {
        // return an error
        return await i.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error Occurred`,
            description: `The Message ID Given \`${theMessage.id}\` Is Already Attached To The Group \`${groupName}\``,
            color: scripts.getErrorColor()
          })
        ],
      });
    }
  }

    // create message object
    let messageObj = {
      id: theMessage.id,
      currentID: theMessage.id,
      channelID: theMessage.channel.id,
      channelName: theMessage.channel.name,
      author: {
        id: theMessage.author.id,
        username: theMessage.author.username,
        discriminator: theMessage.author.discriminator,
        avatar: theMessage.author.avatar,
      },
      content: theMessage.content,
      actionRows: [],
      embeds: [],
      attachments: [],
      reactions: [],
      pinned: theMessage.pinned,
      createdAt: theMessage.createdAt,

    };
    // extract embeds
    if (theMessage.embeds.length > 0) {
      theMessage.embeds.forEach((embed) => {
        let embedObj = {
          title: embed.title,
          description: embed.description,
          url: embed.url,
          color: embed.color,
          thumbnail: embed.thumbnail,
          image: embed.image,
          author: {
            name: embed.author?.name,
            iconURL: embed.author?.iconURL,
            url: embed.author?.url,
          },
          footer: {
            text: embed.footer?.text,
            iconURL: embed.footer?.iconURL,
          },
        }
        // extract the fields
        if (embed.fields.length > 0) {
          embedObj.fields = [];
          embed.fields.forEach((field) => {
            embedObj.fields.push({
              name: field.name,
              value: field.value,
              inline: field.inline,
            });
          });
        }
        messageObj.embeds.push(embedObj);
      });
    }
    // extract attachments
    if (theMessage.attachments.size > 0) {
      theMessage.attachments.forEach((attachment) => {
        messageObj.attachments.push({
          id: attachment.id,
          url: attachment.url,
          name: attachment.name,
          size: attachment.size,
          height: attachment.height,
          width: attachment.width,
          proxyURL: attachment.proxyURL,  
        });
      });
    }
    // extract reactions
    if (theMessage.reactions.cache.size > 0) {
      theMessage.reactions.cache.forEach((reaction) => {
        messageObj.reactions.push({
          id: reaction.emoji.id,
          name: reaction.emoji.name,
          count: reaction.count,
        });
      });
    }
    // extract components into actionrow objects
    if (theMessage.components.length > 0) {
      let actionRowObj = {
          components: [],
        };
      theMessage.components.forEach((actRow) => {
        
                let buttons = [];
          let selectMenus = [];
        actRow.components.forEach((component) => {
        


          // let componentObj = {
          //   type: component.type,
          //   style: component.style,
          //   label: component.label,
          //   emoji: component.emoji,
          //   url: component.url,
          //   customID: component.customID,
          //   disabled: component.disabled,
          // };
          
          if (component.type === 2) { // button
            let buttonObj = {
              type: component.type,
              style: component.style,
              label: component.label,
              emoji: component.emoji,
              url: component.url,
              customID: component.customId,
              disabled: component.disabled,
            };
            buttons.push(buttonObj);
            }
          if (component.type === 3) { // Select Menu
            let selectMenuObj = {
              type: component.type,
              customID: component.customId,
              options: [],
              placeholder: component.placeholder,
              minValues: component.minValues,
              maxValues: component.maxValues,
              disabled: component.disabled,
            };
            component.options.forEach((option) => {
              selectMenuObj.options.push({
                label: option.label,
                value: option.value,
                description: option.description,
                emoji: option.emoji,
                default: option.default,
              });
            });
            selectMenus.push(selectMenuObj);
          }
          

        
        
      });
      actionRowObj.components.push({
          buttons: buttons,
          selectMenus: selectMenus,
          numOfButtons: buttons.length,
          numOfSelectMenus: selectMenus.length,
        });
      
    });
    messageObj.actionRows.push(actionRowObj);
    }



    // add message to group
    try {
      // if group.messages is undefined or length is 0, set onlinestatus to true
      if (!group.messages || group.messages.length === 0) {
        await groups.findOneAndUpdate(
          {
            channelId: i.channel.id,
            groupName: groupName,
            $or: [
              { messages: { $exists: false } },
              { messages: { $size: 0 } }
            ]
          },
          {
            $set: {
              onlinestatus: true,
            },
            $push: {
              messages: messageObj
            }
          }
        );
      } else {
        await groups.findOneAndUpdate(
          {
            channelId: i.channel.id,
            groupName: groupName,
          },
          {
            $push: {
              messages: messageObj,
            },
          }
        );
      }

    } catch (error) {
      return await i.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error Occurred`,
            description: `There Was An Error Adding The Message ID Given \`${theMessage.id}\` To The Group \`${groupName}\`\n\`\`\`js\n${error}\`\`\``,
            color: scripts.getErrorColor()
          })
        ],
      });
    }
    // send message to user
    try {
     return await i.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Success`,
            description: `The Message ID Given \`${theMessage.id}\` Has Been Added To The Group \`${groupName}\``,
            color: scripts.getSuccessColor()
          })
        ],
      });
    } catch (error) {
      scripts.logError(error, `error sending message to user`);
    }
     }
   ,
  };

  collectObj.collector = menuResponse.createMessageComponentCollector({filter: collectObj.collectorFilter, time: collectObj.collectorOptions.time, max: collectObj.collectorOptions.max, });
      collectObj.collector.on('collect', collectObj.collectorCallback);
      collectObj.collector.on('end', async (collected, reason) => {
        if (reason === "time") {
          return await interaction.editReply({
            components: [],
            embeds: [
              createEmb.createEmbed({
                title: `Error Occurred`,
                description: `You Did Not Select A Group Name In Time, Try Again`,
                color: scripts.getErrorColor()
              })
            ],
          });
        }
    
        if (reason === "cancel") {
          return await interaction.editReply({
            components: [],
            embeds: [
              createEmb.createEmbed({
                title: `Cancelled`,
                description: `You Have Cancelled The Command`,
                color: scripts.getWarningColor()
              })
            ],
          });
        }
    
        if (reason === "selection_made") {
          return await interaction.editReply({
            components: [],
            embeds: [
              createEmb.createEmbed({
                title: `Message Added To Group`,
                description: ``,
                color: scripts.getWarningColor()
              })
            ],
          });
        }
      });

  // // wait for user to select a group
  // let menuCollector = menuResponse.createMessageComponentCollector({
  //   componentType: 'SELECT_MENU',
    
  // })
  // menuCollector.on('collect', async i => {
  //   let groupName = i.values[0];
  //   let group;
  //   try {
  //     group = await groups.findOne({
  //       groupName: groupName,
  //       channelId: interaction.channel.id,
  //     });
  //   } catch (error) {
  //     scripts.logError(error, `error finding group`);
  //   }
  //   if (!group) {
  //     return await interaction.editReply({
  //       embeds: [
  //         createEmb.createEmbed({
  //           title: `Error Occurred`,
  //           description: `The Group \`${groupName}\` Was Not Found in #${interaction.channel.id}`,
  //           color: scripts.getErrorColor()
  //         })
  //       ],
  //     });
  //   }
    
  //   // add the theMessage To the group.messages array
   

  //   // check if message is already in group
  //   if (group.messages.includes(theMessage.id)) {
  //     return await interaction.editReply({
  //       embeds: [
  //         createEmb.createEmbed({
  //           title: `Error Occurred`,
  //           description: `The Message ID Given \`${theMessage.id}\` Is Already Attached To The Group \`${groupName}\``,
  //           color: scripts.getErrorColor()
  //         })
  //       ],
  //     });
  //   }
  //   // create message object
  //   let messageObj = {
  //     id: theMessage.id,
  //     currentID: theMessage.id,
  //     channelID: theMessage.channel.id,
  //     channelName: theMessage.channel.name,
  //     author: {
  //       id: theMessage.author.id,
  //       username: theMessage.author.username,
  //       discriminator: theMessage.author.discriminator,
  //       avatar: theMessage.author.avatar,
  //     },
  //     content: theMessage.content,
  //     actionRows: [],
  //     embeds: [],
  //     attachments: [],
  //     reactions: [],
  //     pinned: theMessage.pinned,
  //     createdAt: theMessage.createdAt,

  //   };
  //   // extract embeds
  //   if (theMessage.embeds.length > 0) {
  //     theMessage.embeds.forEach((embed) => {
  //       let embedObj = {
  //         title: embed.title,
  //         description: embed.description,
  //         url: embed.url,
  //         color: embed.color,
  //         thumbnail: embed.thumbnail,
  //         image: embed.image,
  //         author: {
  //           name: embed.author.name,
  //           iconURL: embed.author.iconURL,
  //           url: embed.author.url,
  //         },
  //         footer: {
  //           text: embed.footer.text,
  //           iconURL: embed.footer.iconURL,
  //         },
  //       }
  //       // extract the fields
  //       if (embed.fields.length > 0) {
  //         embedObj.fields = [];
  //         embed.fields.forEach((field) => {
  //           embedObj.fields.push({
  //             name: field.name,
  //             value: field.value,
  //             inline: field.inline,
  //           });
  //         });
  //       }
  //       messageObj.embeds.push(embedObj);
  //     });
  //   }
  //   // extract attachments
  //   if (theMessage.attachments.size > 0) {
  //     theMessage.attachments.forEach((attachment) => {
  //       messageObj.attachments.push({
  //         id: attachment.id,
  //         url: attachment.url,
  //         name: attachment.name,
  //         size: attachment.size,
  //         height: attachment.height,
  //         width: attachment.width,
  //         proxyURL: attachment.proxyURL,  
  //       });
  //     });
  //   }
  //   // extract reactions
  //   if (theMessage.reactions.cache.size > 0) {
  //     theMessage.reactions.cache.forEach((reaction) => {
  //       messageObj.reactions.push({
  //         id: reaction.emoji.id,
  //         name: reaction.emoji.name,
  //         count: reaction.count,
  //       });
  //     });
  //   }
  //   // extract components into actionrow objects
  //   if (theMessage.components.length > 0) {
  //     theMessage.components.forEach((component) => {
  //       let actionRowObj = {
  //         components: [],
  //       };
  //       component.components.forEach((component) => {
  //         // let componentObj = {
  //         //   type: component.type,
  //         //   style: component.style,
  //         //   label: component.label,
  //         //   emoji: component.emoji,
  //         //   url: component.url,
  //         //   customID: component.customID,
  //         //   disabled: component.disabled,
  //         // };
  //         let buttons = [];
  //         let selectMenus = [];
  //         if (component.type === "BUTTON") {
  //           let buttonObj = {
  //             type: component.type,
  //             style: component.style,
  //             label: component.label,
  //             emoji: component.emoji,
  //             url: component.url,
  //             customID: component.customID,
  //             disabled: component.disabled,
  //           };
  //           buttons.push(buttonObj);
  //           }
  //         if (component.type === "SELECT_MENU") {
  //           let selectMenuObj = {
  //             type: component.type,
  //             customID: component.customID,
  //             options: [],
  //             placeholder: component.placeholder,
  //             minValues: component.minValues,
  //             maxValues: component.maxValues,
  //             disabled: component.disabled,
  //           };
  //           component.options.forEach((option) => {
  //             selectMenuObj.options.push({
  //               label: option.label,
  //               value: option.value,
  //               description: option.description,
  //               emoji: option.emoji,
  //               default: option.default,
  //             });
  //           });
  //           selectMenus.push(selectMenuObj);
  //         }
  //         actionRowObj.components.push({
  //           buttons: buttons,
  //           selectMenus: selectMenus,
  //           numOfButtons: buttons.length,
  //           numOfSelectMenus: selectMenus.length,
  //         });
  //       });
  //       messageObj.actionRows.push(actionRowObj);
  //     });
  //   }



  //   // add message to group
  //   try {
  //     await groups.findOneAndUpdate(
  //       {
  //         channelId: interaction.channel.id,
  //         groupName: groupName,
  //       },
  //       {
  //         $push: {
  //           messages: messageObj,
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     return await interaction.editReply({
  //       embeds: [
  //         createEmb.createEmbed({
  //           title: `Error Occurred`,
  //           description: `There Was An Error Adding The Message ID Given \`${theMessage.id}\` To The Group \`${groupName}\`\n\`\`\`js\n${error}\`\`\``,
  //           color: scripts.getErrorColor()
  //         })
  //       ],
  //     });
  //   }
  //   // send message to user
  //   try {
  //    return await interaction.editReply({
  //       embeds: [
  //         createEmb.createEmbed({
  //           title: `Success`,
  //           description: `The Message ID Given \`${theMessage.id}\` Has Been Added To The Group \`${groupName}\``,
  //           color: scripts.getSuccessColor()
  //         })
  //       ],
  //     });
  //   } catch (error) {
  //     scripts.logError(error, `error sending message to user`);
  //   }

  //     // End menu collector
  // menuCollector.stop('selection_made');

  
  // });
  // // on collector end
  // menuCollector.on("end", async (collected, reason) => {
   
  // });
  },
};



