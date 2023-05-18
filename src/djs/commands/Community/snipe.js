const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType, PermissionFlagsBits } = require("discord.js")
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const createEmb = require("../../functions/create/createEmbed.js");
const client = require("../../index.js");
const createBtn = require("../../functions/create/createButton.js");
const createActRow = require("../../functions/create/createActionRow.js");


// Placeholder function for saving a snipe to the database TODO
async function saveSnipe(userId, snipe) {
    // Add your code to save the snipe in the database
    // make a users schema
    // create a setupUser function
    // to save schema here
    
    // Get the user data from the database using usersetup function
    const userData = await client?.setupUser(userId);
    console.log(`userData is: `, userData) 

    let userSnipes = userData?.saved?.snipes;
/**
 *  saved: {
      snipes: [{
        serverID: String,
        channelID: String,
        messageID: String,
          message:{
            user: {
              userID: String,
              username: String,
            },
            messageID: String,
            channelID: String,
            serverID: String,
            content: String,
            timestamp: Number,
            createdAt: String,
            deletedAt: Number,
            deletedTimestamp: Number,
            hasEmbed: Boolean,
            embeds: [{
              title: String,
              description: String,
              url: String,
              timestamp: String,
              color: String,
              footer: {
                text: String,
                iconURL: String,
                proxyIconURL: String,
              },
              image: {
                url: String,
                proxyURL: String,
                height: Number,
                width: Number,
              },
              thumbnail: {
                url: String,
                proxyURL: String,
                height: Number,
                width: Number,
              },
              author: {
                name: String,
                url: String,
                iconURL: String,
              },
              fields: [{
                name: String,
                value: String,
                inline: Boolean,
              }],
          }],
          attachments: [{
            name: String,
            url: String,
            size: Number,
            contentType: String,
          }],
        },
        snipedBy: {
          userID: String,
          username: String,
        },
        snipedTarget: {
          userID: String,
          username: String,
        },
        savedAt: String,
        savedTimestamp: Number
      }]
    }
 */
    let newSnipe = {
        serverID: snipe.serverID, // snipe === message obj
        channelID: snipe.channelID,
        messageID:snipe.message.messageID,
        serverName: snipe.serverName,
        channelName: snipe.channelName,
        message: {
            user: {
                userID: snipe.author.id,
                username: snipe.author.username,
            },
            messageID: snipe.message.messageID,
            channelID: snipe.message.channelID,
            serverID: snipe.message.serverID,
            content: snipe.message.content,
            timestamp: snipe.message.createdTimestamp,
            createdAt: `${snipe.message.createdAt}`,
          deletedAt: `${snipe.message.deletedAt}`,
            deletedTimestamp: snipe.message.deletedTimestamp,
            hasEmbed: snipe.embeds?.length > 0,
            embeds: [],
            attachments: [],
        }, 
        snipedBy: {
            userID: userId,
            username: userData.username,
        },
        snipedTarget: {
            userID: snipe.author.id,
            username: snipe.author.username,
        },
        savedAt: `${new Date(Date.now())}`,
        savedTimestamp: Date.now(),
    }
    // construct the embeds and attachments objs and push to arrays

    //embeds
    if(snipe?.embeds?.length > 0){
        for (let embed of snipe.embeds){
          let dbEmbed = {
            title: embed.title,
            description: embed.description,
            url: embed.url,
            timestamp: embed.timestamp,
            color: embed.color,
            footer: {
                text: embed.footer?.text,
                iconURL: embed.footer?.iconURL,
                proxyIconURL: embed.footer?.proxyIconURL,
            },
            image: {
                url: embed.image?.url,
                proxyURL: embed.image?.proxyURL,
                height: embed.image?.height,
                width: embed.image?.width,
            },
            thumbnail: {
                url: embed.thumbnail?.url,
                proxyURL: embed.thumbnail?.proxyURL,
                height: embed.thumbnail?.height,
                width: embed.thumbnail?.width,
            },
            author: {
                name: embed.author?.name,
                url: embed.author?.url,
                iconURL: embed.author?.iconURL,
            },
            fields: [],
        }  
        // extract the fields from the embed
        if(embed?.fields?.length > 0){
            for (let field of embed.fields){
                let dbField = {
                    name: field.name,
                    value: field.value,
                    inline: field.inline,
                }
                dbEmbed.fields.push(dbField)
            }
        }
        
        newSnipe.message.embeds.push(dbEmbed)
    }   
}

    // attachments
    if(snipe?.attachments?.length > 0){
        for (let attachment of snipe.attachments){
            let dbAttachment = {
                name: attachment.name,
                url: attachment.url,
                size: attachment.size,
                contentType: attachment.contentType,
            }
            newSnipe.message.attachments.push(dbAttachment)
        }
    }


    // push the snipe to the front of the userSnipes array 

    userSnipes?.unshift(newSnipe);

    // update the user.saved.snipes array property with the new userSnipes array in the mongodb 
    /**
    await groups.findOneAndUpdate(
          {
            channelId: interaction.channel.id,
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
        ); */ // TODO: Add a check to see if the message is already within the snipes array
    try {
        await client.usersDB.findOneAndUpdate(
            {
                userID: userId,
            },
            {
                $set: {
                    saved: {
                        snipes: userSnipes,
                    }
                }
            }
        )
        console.log(`user data saved to db`);
        return true;
    } catch (error) {
        console.log(`an error occurred while trying to save the user data to the database: `, error);
        return false;
    }
        
  }
  
  async function displaySnipes(interaction, msg, snipes, index, target) {
let embed;
let length = snipes?.length || 0;
index = index > length - 1 ? length - 1 : index < 0 ? 0 : index;
    const filteredSnipes = target
      ? snipes?.filter((snipe) => snipe.message.user.userID === target.id)
      : snipes;
      const lastDeletedMessages = filteredSnipes?.slice( 0, 50) || [];
    const snipe = lastDeletedMessages[index];
    let interactionUserID = interaction?.user?.id ? interaction?.user?.id : msg?.author?.id;

    // if there are 0 snipes in the snipes array, send a message on the embed saying there arent any messages recently deleted in the channel

    if (length === 0) {
      embed = createEmb.createEmbed(
          {
            title: ` No messages have been deleted in this channel recently`,
            color: scripts.getColor(),
          }
      );

      if (msg === null && interaction){
        await interaction.editReply({ embeds: [embed] });
        await scripts.delay(5000);
        return await interaction.deleteReply();
      } else {
        try {
          await msg.edit({ embeds: [embed] });
          await scripts.delay(5000);
        return await msg.delete();
        } catch (error) {
          try {
            await msg.reply({ embeds: [embed] });
            await scripts.delay(5000);
            return await msg.delete();
          } catch (error) {
           return  console.log(error)

        }
        
      }
    }
  }

    try { // if no messageAuthor then use the snipe.snipedTarget.userID and if that fails then use the snipe.snipedBy.userID
        snipe.author = await client.users.fetch( snipe?.messageAuthor?.userID || snipe?.snipedTarget?.userID || snipe?.snipedBy?.userID || snipe?.user?.userID);
    } catch (error) {
        console.log(error)
    }
      // need to convert this embed into the createEmb.createEmbed() format
      // if the content is more than the allowed character limit in a embed field value then create an alternate embed obj structure

      // get the current servers guild url
      let guild = client.guilds.cache.get(snipe.message?.serverID); 

      // create an invite

      let serverInviteURL = await guild.invites.create( snipe.message?.channelID, {
        unique: true,
        reason: `invite from a recovered sniped message`,
        }).then(invite => invite?.url);
let channelInviteURL = await guild.invites.create( snipe.message?.channelID, {
        unique: true,
        reason: `invite from a recovered sniped message`,
        }).then(invite => invite?.url);
      let embedObj;
      let embedDescription = `\`Server\` \`${snipe.serverName}\`||[${snipe.serverName}](${serverInviteURL})||\n\`Channel\` \`${snipe.channelName}\`||[${snipe.channelName}](${channelInviteURL})||\n\n**__Message Info__**:\n|| ‎  ‎  ‎  ‎  ‎ ||╰:wastebasket: *__Deleted:__*\n|| ‎  ‎  ‎  ‎  ‎ || || ‎  ‎  ‎  ‎  ‎ ||╰:bust_in_silhouette:  By: ${snipe?.snipedBy ? `<@${snipe.snipedBy?.userID}> \`/\` \`${snipe.snipedBy.username}\`` : snipe?.deletedBy ? `<@${snipe.deletedBy?.userID}> \`/\` \`${snipe.deletedBy.username}\`` : `:ghost: Unknown`  }\n|| ‎  ‎  ‎  ‎  ‎ |||| ‎  ‎  ‎  ‎  ‎ ||╰:clock: Time: <t:${ Math.floor(
        (snipe?.loggedTimestamp || snipe?.savedTimestamp) / 1000
      )}:R>\n|| ‎  ‎  ‎  ‎  ‎ ||╰:writing_hand: *__Sent:__*\n|| ‎  ‎  ‎  ‎  ‎ |||| ‎  ‎  ‎  ‎  ‎ ||╰:bust_in_silhouette:  By:<@${snipe.author.id}> \`/\` \`${snipe.author.username}\`\n|| ‎  ‎  ‎  ‎  ‎ |||| ‎  ‎  ‎  ‎  ‎ ||╰:clock: Time: <t:${ Math.floor(
            snipe?.message?.timestamp ? snipe?.message?.timestamp / 1000 : Date.parse(snipe?.message?.createdAt) / 1000
          )}:R>\n\n`;
          let embedDescriptionLength = embedDescription.length;
      if(snipe.message.content < 1024) {
        embedObj = {
            title: `Sniped Message${target ? ` from ${target.username}` : ""}`,
            thumbnail: snipe.author.displayAvatarURL(),
            description: embedDescription,
            fields:[
                {
                    name: "message content",
                    value: `> ${snipe.message?.content}`, 
                    inline: false,
                },
            ],
            footer: {
                text: `Snipe ${index + 1} of ${lastDeletedMessages.length}`,
            },
            color: scripts.getColor(),
            }
        } else {
          let content = embedDescription + `> **Message Content:**\n> ${snipe?.message?.content || ``}`;
          if((embedDescriptionLength+snipe?.message?.content?.length) > 4096) {
            // if descriotion plus content is over 4096 chars then trim the content to approriate size and end it with ...

           content = (embedDescription + `> **Message Content:**\n> ${snipe?.message?.content || ``}`)?.slice(0, 4096-embedDescriptionLength-3) + "...";
          }
            embedObj = {
                // title: `Sniped Message${target ? ` from ${target.username}` : ""}`,
                // thumbnail: snipe.author.displayAvatarURL(),
                // description: `\`Server\` \`${snipe.serverName}\`||[${snipe.serverName}](${serverInviteURL})||\n\`Channel\` \`${snipe.channelName}\`||[${snipe.channelName}](${channelInviteURL})||\n\n:clock: **\`Timestamp:\`** \`${snipe?.message?.timestamp ? new Date(snipe?.message?.timestamp) : snipe?.message?.createdAt}\`\n:wastebasket: **__Deleted:__** \n╰ *By:* ${snipe?.snipedBy ? `<@${snipe.snipedBy?.userID}> \`/\` \`${snipe.snipedBy.username}\`` : snipe?.deletedBy ? `<@${snipe.deletedBy?.userID}> \`/\` \`${snipe.deletedBy.username}\`` : `:ghost: Unknown`  }\n╰ *Time:* <t:${ Math.floor(
                //   (snipe?.loggedTimestamp || snipe?.savedTimestamp) / 1000
                // )}:R>\n\n:writing_hand: **__ Sent By:__** \n<@${snipe.author.id}> \`/\` ||\`${snipe.author.username} | ${snipe.author.id}\`||\n\n> **Message Content:**\n> ${snipe.message?.content}`,
                title: `Sniped Message${target ? ` from ${target.username}` : ""}`,
            thumbnail: snipe.author.displayAvatarURL(),
            description: content, // 4096 char limit
                
                footer: {
                    text: `Snipe ${index + 1} of ${lastDeletedMessages.length}`,
                },
                color: scripts.getColor(),
                }
        }

      
      try{
        embed = createEmb.createEmbed(embedObj)
      } catch (error){
        console.log(`an error occurred while trying to create the embed: `, error, embedObj)
      }

  
      const moreThanTenSnipes = lastDeletedMessages?.length > 10;

      // check if the current sniped message is already saved by the user to their profile in the db
        // if it is then disable the save button and label it as saved, and make blue
        // if it is not then enable the save button and label it as save, and make green
        let saveButton = {
            customID: "save",
            label: "Save",
            style: "SUCCESS",
            disabled: false
        }
        let saved = false;
        try {
            const userData = await client?.setupUser(interaction?.user?.id || msg?.user?.id);
            let userSnipes = userData?.saved?.snipes;
            for (let Usnipe of userSnipes){
              console.log(Usnipe.messageID, snipe.messageID, `USNIPE=`, Usnipe)

                if(Usnipe.messageID === snipe.messageID){
                    saved = true;
                    break;
                }
            }
            if(saved){
                saveButton = {
                    customID: "save",
                    label: "Saved",
                    style: "SECONDARY",
                    disabled: true,
                }
            } else {
                saveButton = {
                    customID: "save",
                    label: "Save",
                    style: "SUCCESS",
                    disabled: false
                }
            }
        } catch (error) {
            console.log(`an error occurred while trying to check if the snipe is saved by the user: `, error)
        }





      // I need to convert each button into the createBtn.createButton() format 
      let buttonObjects = {
        first: {
        obj: {
            customID: "first",
            label: "First",
            style: "PRIMARY",
            disabled: index === 0,
        },
        button: {},
    },
    back5: {
            obj: {
            customID: "back5",
            label: "Back by 5",
            style: "PRIMARY",
            disabled: index < 5,
        },
    button: {}
},
back: {
    obj: {
            customID: "back",
            label: "Back",
            style: "PRIMARY",
            disabled: index === 0,
        },
    button: {},
},
save: {
  obj: saveButton,
button: {}
},
next: {
    obj: {
            customID: "next",
            label: "Next",
            style: "PRIMARY",
            disabled: index === lastDeletedMessages.length - 1,
        },
    button: {}
},
next5: {
    obj: {
            customID: "next5",
            label: "Forward by 5",
            style: "PRIMARY",
            disabled: index > lastDeletedMessages.length - 6,
        },
    button: {}
},
last: {
    obj: {
            customID: "last",
            label: "Last",
            style: "PRIMARY",
            disabled: index === lastDeletedMessages.length - 1,
        },
    button: {}
},
      }
      
      // for every button in the button objects create a button and add it to the buttons button property

        for (const button in buttonObjects) {
            try {
                buttonObjects[button].button = await createBtn.createButton(buttonObjects[button].obj)
            } catch (error) {
                console.log(`an error occurred while trying to create the button: `, error, buttonObjects[button].obj)
            }
        }

        // determine whether to have action row A or action row B

        // action A : IF the snipe results array is more than 10 include a row like so
// modify the row to have 7 buttons in total 4 on one row 3 on another. top row 1st results button, save button, last results button. next row has Go back by 5 results button, back button, next button, Go forward by 5 results button.

// action B : IF there are 10 or less results The button row should have 5 buttons a 1st results button, back button, a save button in the middle that is disabled when clicked, next button, last results button.


const actionRowA = [buttonObjects.first.button, buttonObjects.back.button, buttonObjects.save.button, buttonObjects.next.button,  buttonObjects.last.button]
const actionRowC = [buttonObjects.back5.button, buttonObjects.next5.button,]

const actionRowB = [buttonObjects.first.button, buttonObjects.back.button, buttonObjects.save.button, buttonObjects.next.button, buttonObjects.last.button]


// const actionRow = await createActRow.createActionRow({components: moreThanTenSnipes ? actionRowA : actionRowB})

  let actionRowArray = moreThanTenSnipes ? [actionRowA, actionRowC] : [actionRowB]

  // for each actionRow in the array creeate an actionRoa builder
  let actionRowBuilders = []
  for (const actionRow of actionRowArray) {
    try {
      actionRowBuilders.push(await createActRow.createActionRow({components: actionRow}))
    } catch (error) {
      console.log(`an error occurred while trying to create the action row: `, error, actionRow)
    }
  }

    let message;
    // if (msg === null && interaction){
    //   message = await interaction.editReply({
    //     embeds: [embed],
    //     components: [actionRow],
    //   });
    // } else {
    //   try {
    //     // fetch the message via msg.id
    //     let msgObj = await msg.channel.messages.fetch(msg.id)
    //     message = await msgObj.edit({
    //       embeds: [embed],
    //       components: [actionRow],
    //     });
    //   } catch (error) {
    //     console.log(`an error occurred while trying to edit the message: `, error)
    //   }
    // } 

    try {
      message = await interaction.editReply({
        embeds: [embed],
        components: actionRowBuilders,
      });
    } catch (error) {
      try {
        // fetch the message via msg.id
        let msgObj = await msg.channel.messages.fetch(msg.id)
        message = await msgObj.edit({
          embeds: [embed],
          components: actionRowBuilders,
          
        });
      } catch (error) {
        if(error.message === `Cannot edit a message authored by another user`){
          let msgObj = await msg.channel.messages.fetch(msg.id)
          try {
            message = await msgObj.reply({
              embeds: [embed],
              components: actionRowBuilders,
              
            });
          } catch (error) {
            console.log(`an error occurred while trying to reply to the message: `, error)
          }
        } else {
        console.log(`an error occurred while trying to edit the message: `, error)
        }
      }
    } 
  
    const filter = async (buttonInteraction) =>{

        if (buttonInteraction.user.id === interactionUserID){

            return true
        }else {
            // send message telling user they dont have permission to operate another users snipe dashboard, and run it themselves if they wanna see it
            await buttonInteraction.reply({
                embeds: [
                  createEmb.createEmbed({
                    title: `Error`,
                    description: `You do not have permission to operate another users snipe dashboard, run the command yourself if you want to see it.\n\n**\`Command:\`** \`/snipe\` \`+\` \`true\``,
                  }),
                ],
                ephemeral: true,
              });
              await scripts.delay(3000);
               await buttonInteraction.deleteReply();
               return false;
        }
    }
      
  let x,y;
    const collector = message.createMessageComponentCollector({
      filter,
      time: 60000,
    });
  
    collector.on("collect", async (buttonInteraction) => {
      let newInt;
      try {
        
        try {
          newInt = await buttonInteraction.deferUpdate();
        } catch (error) {
          console.log(error)
        }
        // Q: what does the deferUpdate do as apposed to the deferReply?
        // A: deferReply defers the reply to the original interaction, deferUpdate defers the reply to the buttonInteraction 
    
        switch (buttonInteraction.customId) {
          case "first":
            index = 0;
            break;
          case "back":
            index -= 1;
            break;
          case "save":
            let res = await saveSnipe(
              interaction.user.id,
              snipe
            );
            let followUp;
            if (res){
              followUp = await buttonInteraction.followUp({
                  embeds: [
                    createEmb.createEmbed({
                      title: `Snipe Saved`,
                      description: `The sniped message has been saved to your snipes.`,
                    }),
                  ],
                  ephemeral: true,
                });
            } else {
              followUp = await buttonInteraction.followUp({
                  embeds: [
                    createEmb.createEmbed({
                      title: `Error`,
                      description: `An error occurred while trying to save the sniped message, try again`,
                    }),
                  ],
                  ephemeral: true,
                });
                await scripts.delay(3000);
                await followUp.delete();
              }
  
            break;
          case "next":
            index += 1;
            break;
          case "last":
            index = lastDeletedMessages.length - 1;
            break;
            case "back5":
          index = moreThanTenSnipes ? index - 5 : Math.max(0, index - 1);
          break;
        case "next5":
          index = moreThanTenSnipes
            ? index + 5
            : Math.min(lastDeletedMessages.length - 1, index + 1);
          break;
        }
    console.log(`interaction is --------------------------------<<>>`, interaction)
    console.log(`newInt is --------------------------------<<>>`, newInt)
    console.log(`buttonInteraction is --------------------------------<<>>`, buttonInteraction)

    // update the message to look the exact same with same embedObj and buttons, except  button that was clicked just clicked, update the label to the text "clicked"
    
    let clickedButton = buttonObjects[buttonInteraction.customId].button
    // clickedButton.data.label = `<a:verify:1100873948041855017>`
    //clickedButton.data.emoji = `<a:verify:1100873948041855017>`
    clickedButton.setEmoji(`<a:verify:1100873948041855017>`)
    let newActionRows = [];
    if ( moreThanTenSnipes && (buttonInteraction.customId === "back5" || buttonInteraction.customId === "next5")){
      // there will be 2 action rows, both actionRowA and actionRowC and need to update the relevant button within actionRowC
       newActionRows.push( await createActRow.createActionRow({components: actionRowA}))
       newActionRows.push( await createActRow.createActionRow({components: actionRowC, clickedButton: clickedButton}))

      
      

    } else {
      // there will be 1 action row, actionRowB and need to update the relevant button within actionRowB
       newActionRows.push(await createActRow.createActionRow({components: actionRowB, clickedButton: clickedButton}))
    }
    
    
    // console.log(`newActionRow is --------------------------------<<>>`, newActionRow)
    // console.log(`actionRow is --------------------------------<<>>`, actionRow)

    // console.log(`buttonObjects[buttonInteraction.customId].button is --------------------------------<<>>`, buttonObjects[buttonInteraction.customId].button)

    try {
      message = await interaction.editReply({
        embeds: [embed],
        components: newActionRows,
      });
      } catch (error) {
        console.log(error, `error editing reply`)

        try {
          // fetch the message via msg.id
          let msgObj = await buttonInteraction.channel.messages.fetch(msg.id)
          message = await msgObj.edit({
            embeds: [embed],
            components: newActionRows,
          });
        } catch (error) {
          console.log(`an error occurred while trying to edit the message: `, error)
        }
      }
    

    // end the collector

     try{
      collector.complete = true;
      collector.stop();
      } catch (error) {
        console.log(error, `error stopping collector`)
      }

        await displaySnipes(buttonInteraction, message, snipes, index, target);
      } catch (error) {
        console.log(error, `Error in snipe command collector`)
      }


    });
  
    collector.on("end", async () => {
      if (!collector.complete) {
        try {
          await interaction.editReply({
            components: [],
          });
        } catch (error) {
          try {
            // fetch the message via msg.id
            let msgObj = await msg.channel.messages.fetch(msg.id)
            message = await msgObj.edit({
              
              components: [],
              
            });
          } catch (error) {
            if(error.message === `Cannot edit a message authored by another user`){
              let msgObj = await msg.channel.messages.fetch(msg.id)
              try {
                await msgObj.delete();
              } catch (error) {
                console.log(`an error occurred while trying to reply to the message: `, error)
              }
            } else {
            console.log(`an error occurred while trying to edit the message: `, error)
            }
          }
        }
      }
    });
  }
  

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snipe")
    .setDescription("Snipe a message from a channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
    .addUserOption((option) =>
      option
        .setName("target-user")
        .setDescription("Select a user to target.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("view-saved")
        .setDescription("View snipes you have saved.a")
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: false });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }
    try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Loading Now`,
            description: `<a:T_Google_AI:932060562668544000>`,
          }),
        ],
      });
    } catch (error) {
      scripts.logError(error, `error editing reply`);
    }
    const { options } = interaction;
    const target = options?.getUser("target-user");
    const getAllSnipesHistory = options?.getBoolean("view-saved");
    const user = interaction?.user;
    let msg = null;
    // get the channel data from db in order to get the snipe data
    let channelData;
    try {
         channelData = await client.setupChannel(interaction.channel)
        if (!channelData || channelData === null) {
            return await interaction.editReply({
            embeds: [
                createEmb.createEmbed({
                title: `Error`,
                description: `The database has no data for this channel.`,
                color: scripts_djs.getErrorColor(),
                }),
            ],
            });
        }

    } catch (error) {
        scripts.logError(error, `error getting channel data`);
    }

    // If snipe history
    if (getAllSnipesHistory) {
        
      // Retrieve snipes based on user id from the database
      // Replace the following line with your database logic to retrieve snipes

      // search the user in the user db and get their saved snipes array
      const userData = await client.setupUser(user.id);
      const userSnipes = userData?.saved?.snipes;

      // filter the snipes to only being snipes from within the current server
      const s = userSnipes?.filter((snipe) => snipe.serverID === interaction.guild.id);
      const snipesHistory = s;
      

      // Display snipes history in the same way as above; 
      
      return displaySnipes(interaction, msg, snipesHistory, 0, null);
    }
    
    const loggedDeletedMessages = channelData?.deletedMessages;




    // If snipe
    // Get the last 50 deleted messages in the channel from the database
    // Replace the following line with your database logic to retrieve the last 50 deleted messages

    // so snipes is an array of objects, we need to get the first 50 aka the most recent 50 that were added to the array and spit it into a new array variable

    

    // Display them via embed and slideshow button style to cycle
    return displaySnipes(interaction, msg, loggedDeletedMessages, 0, target);
  },displaySnipes
  };
  