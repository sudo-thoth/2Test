const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, Collection } = require("discord.js");
require("dotenv").config({ path: "../../my.env" });
const createEmb = require("../../functions/create/createEmbed.js");
const createActRow = require("../../functions/create/createActionRow.js");
const createBtn = require("../../functions/create/createButton.js");
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const groups = require("../../../MongoDB/db/schemas/schema_dynamicMessageGroup.js");
const mongoose = require("mongoose");
const client = require(`../../index.js`);
const { findOneAndUpdate } = require("../../../MongoDB/db/schemas/schema_announcement.js");
let gbdb = client.groupbuysDB;
let listsdb = client.listsDB;

let dbs = {
  gb: {
    db: gbdb,
    compromised: false,
  },
  lists: {
    db: listsdb,
    compromised: false,
  },

  }


client.on("ready", async () => {


  // Run the function immediately after the bot login
  await cycleDynamicMessageGroups();
  console.log("Completed cycleDynamicMessageGroups Check");
  // Run the function every 3 minutes (180000 milliseconds) after the bot login
  setInterval(async ()=>{await cycleDynamicMessageGroups()}, 60000);  // per 30 sec = 30000
});
            
async function cycleDynamicMessageGroups() {
    // fetch a user by id
    const DevLT = await client.users.fetch(`975944168373370940`);
let currentTimeIndicator = (new Date(Date.now())).toString();
  // create a function to be called upon bot login that every 3 minutes it checks the groups db and all the groups cycleStartTime and if the current date is 30 minutes or more after the cycleStartTime then it deletes all the messages of the group and sends them again in the same order

  // find all the groups that have onlineStatus === true
  // if the current date is 30 minutes or more after the cycleStartTime then it deletes all the messages of the group and sends them again in the same order
  // if the current date is less than 30 minutes after the cycleStartTime then it does nothing
  // if the current date is 30 minutes or more after the cycleStartTime then it deletes all the messages of the group and sends them again in the same order
if (client.connectedToMongoose) {
  function formatUnixTimestamp(timestamp) {
    // Create a new Date object from the Unix timestamp (in milliseconds)
    const date = new Date(timestamp);
  
    // Get the components of the date and time
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
  
    // Format the date string using the components
    const dateString = `${month} / ${day} / ${year} ${hours}:${minutes}:${seconds}`;
  
    // Return the formatted date string
    return dateString;
  }
let groupsToCycle;
     try {
        groupsToCycle = await groups.find({
         onlineStatus: true,
         $expr: { $gt: [ { $size: "$messages" }, 0 ] }
         
       });
      } catch (error) {
        scripts.logError(error, `error finding groups to cycle`);
      }
       if (groupsToCycle && groupsToCycle?.length > 0) {
       for (let group of groupsToCycle) {
         const currentDate = Date.now();
         const cycleStartTime = group.cycleStartedAt;
         let cycleTime = 1800000; // 30 minutes
         // create 1 min cycle time for testing
         cycleTime = 10000 ; // 2 mins = 120000 ; 10 sec = 10000
         const timeElapsed = currentDate - cycleStartTime;
       
         console.log(`the cycleStartTime is ${formatUnixTimestamp(cycleStartTime)}\n\n`);
         console.log(`the currentDate is ${formatUnixTimestamp(currentDate)}\n\n`);
         console.log(`the timeElapsed is ${new Date(timeElapsed / 1000)}\n\n`);
         if (timeElapsed >= cycleTime || !cycleStartTime) {
           // delete all the messages in the group
           const channel = client.channels.cache.get(group.channelId);
           
           let allMessages = [];

       
           for (let groupMessage of group.messages) {
            let fetchedMessage
             try {
                fetchedMessage = await channel.messages.fetch(groupMessage.currentID);
               if (fetchedMessage && fetchedMessage.author.id === client.user.id) {
                allMessages.push({type: 'fetched', value: fetchedMessage});
               } else {
                 allMessages.push({type: 'lost', value: groupMessage});
               }
             } catch (error) {
               console.log(`Failed to fetch message with ID: ${groupMessage.currentID}`);
               allMessages.push({type: 'lost', value: groupMessage});
             }
           }
       
          
       
           if (allMessages?.length > 0) {
             //... continue with your logic for deletion
             let cnt = 0;
             for (let message of allMessages) {
               
               if (message.type === 'fetched') {
                 // Reconstruct and resend the message as in your code.
                 const theMessage = message.value;
                 let messageObj = {
                   content: message.content,
                   embeds: [],
                   files: message.attachments,
                   components: []
                 }
   
                 // fror each message embed
                 if (theMessage.embeds?.length > 0) {
                   
                   theMessage.embeds.forEach(async (embed) => {
                     // create a discord embed obj`
                     const discordEmbed = createEmb.createEmbed(embed);
                     // add the discord embed obj to the messageObj
                     messageObj.embeds.push(discordEmbed);
                   });
                 }
     
                 
                 // if there are components in the theMessage
                  if (theMessage.components?.length > 0) {
                   for (let actionRow of theMessage.components) {
                     // Iterate over each component in the action row
                     let buttonObjs = [];
                      let selectMenuObjs = [];
                     for (let component of actionRow.components) {
                      // for each 
                       // Extract the button objs and selectMenu objs from the component
                       
                       if (component.data.type === 2) { 
                        component.customID = component?.data?.custom_id;
                        buttonObjs.push(component);
                       } else if (component.data.type === 1) {
                          selectMenuObjs.push(component);
                        }
                   
                       
                     }
                     // For each buttonObj create a discord button obj
                       const buttons = [];
                       for (const buttonObj of buttonObjs) {
                         let button = await createBtn.createButton(buttonObj);
                         buttons.push(button);
                       }
                   
                       // For each selectMenuObj create a discord selectMenu obj
                       const selectMenus = [];
                       for (const selectMenuObj of selectMenuObjs) {
                         const selectMenu = new StringSelectMenuBuilder()
                           .setCustomId(selectMenuObj.customId)
                           .setPlaceholder(selectMenuObj.placeholder)
                           .setDisabled(selectMenuObj.disabled)
                           .setMinValues(selectMenuObj.minValues)
                           .setMaxValues(selectMenuObj.maxValues)
                           .addOptions(selectMenuObj.options);
                   
                         selectMenus.push(selectMenu);
                       }
                   
                       // Create the actionRow
                       const actRow = await createActRow.createActionRow({
                         components: [...buttons, ...selectMenus],
                       });
                       messageObj.components.push(actRow);
                   }
                   
                 }
                 // if there are reactions in the message, save each emoji so it can be later be reused to reaction on the new version of the message
                 let emojis = []
                 if (theMessage?.reactions.cache.size > 0) {
                   // turn theMessage.reactions._cache into an array
                   let reactionObjArray = Array.from(theMessage.reactions.cache);
                   for (let emojiObj of reactionObjArray) {
                     let emoji = emojiObj[1].emoji;
                     emojis.push(emoji);
                   };
                 }
                 let newMessage;
                // search all dbs.db for message with matching message id, if the db contains it, then set compromised to true
                for (const db in dbs) {
                  let dbData
                  let database;
                  switch(db) {
                    case 'lists':
                      database = client.listsDB;
                      break;
                      case 'gb':
                        database = client.groupbuyDB;
                        break;
                        default:
                        database = client.groupbuyDB;

                  }
                  try {
                    dbData = await database.findOne({
                      $or: [
                        { messageID: theMessage.id },
                        { messageId: theMessage.id }
                      ]
                    });
                  } catch (error) {
                    console.log(`Failed to complete search for message in other Dbs, msd with ID: ${theMessage.id}`);
                    console.log(error); 
                  }
                  if (dbData) {
                    dbs[db].compromised = true;

                    // delete the old message
                 try {
                  await theMessage.delete();
                } catch (error) {
                  console.log(`Failed to delete message with ID: ${theMessage.id}`);
                  console.log(error);
                  await DevLT.send(`Failed to delete message with ID: ${theMessage.id}\nIn channel: ${channel.name}\nIn guild: ${channel.guild.name}\nAt: ${new Date(Date.now())}\n\n${error}`);
                }


                    try {
                       newMessage = await channel.send(messageObj);
                      await dbs[db].db.updateOne(
                        { _id: dbData._id },
                        {
                          $set: {
                            messageID: newMessage.id,
                            messageId: newMessage.id
                          }
                        }
                      );
                    } catch (error) {
                      console.log(`Failed to update messageID in db: ${db} for msg with ID: ${theMessage.id}`);
                      console.log(error);
                    }
                  }
                }
                
                // check if any of the dbs are compromised
                let isAnyDbCompromised = Object.values(dbs).some(db => db.compromised);

                if (!isAnyDbCompromised) {
 
                 // delete the old message
                 try {
                   await theMessage.delete();
                 } catch (error) {
                   console.log(`Failed to delete message with ID: ${theMessage.id}`);
                   console.log(error);
                   await DevLT.send(`Failed to delete message with ID: ${theMessage.id}\nIn channel: ${channel.name}\nIn guild: ${channel.guild.name}\nAt: ${new Date(Date.now())}\n\n${error}`);
                 }
                  
    
                  try {
                     newMessage = await channel.send(messageObj);
                   
                  } catch (error) {
                    console.log(error)
                    await DevLT.send({content: `Error Occured trying to send message in ${channel.name} channel in the ${group.serverId} server & ${group.groupName} group\n\nTimestamp: ${new Date(Date.now())}`})
                    // switch the message to a lost message and adjust the value to the message id
                    
                    message.type = 'lost';
                    message.value = group.messages[cnt];
                  }
   }
                 if (newMessage){
                  try {
                    if (emojis.length > 0){
                      for (let emoji of emojis){
                       // const emoji = client.emojis.cache.find(emoji => emoji.id === id);
   
                    if (emoji) {
                      try {
                       await newMessage.react(emoji)
                      } catch (error) {
                       if (error.message.includes("Unknown Emoji")){
                         let guildEmoji;
   for (const guild of client.guilds.cache.values()) {
     guildEmoji = guild.emojis.cache.get(emoji.id);
     if (guildEmoji) {
       // The custom emoji was found in this guild
       console.log(`Found custom emoji "${guildEmoji.name}" in guild "${guild.name}"`);
       break;
     }
   }
   
   if (guildEmoji) {
     // The custom emoji was found in some guild
     console.log(`Custom emoji name: ${guildEmoji.name}`);
     try {
       await newMessage.react(guildEmoji)
      } catch (error) {
       console.log(error)
      }
   } else {
     // The custom emoji was not found in any guild
     console.log(`Custom emoji with ID ${emoji.id} not found in any guild`);
   }
   
                       } else {
                       console.log(error)
                       }
                      }
                    }
                    }}
                  } catch (error) {
                   console.log(error)
                  }
                   console.log(`sent message in ${channel.name} channel in the ${group.serverId} server & ${group.groupName} group\n\nTimestamp: ${new Date(Date.now())}`)
                   // update teh messages current ID
                   group.messages[cnt].currentID = newMessage?.id;
                  
                 }
   
               } 
                if (message.type === 'lost') {
                 // If the message was lost, save the message ID for later.
                 // Note: you should have a mechanism in place to handle these lost messages.
                 message = message.value;
                   // let messageObj = {
                         //   id: theMessage.id,
                         //   currentID: theMessage.id,
                         //   channelID: theMessage.channel.id,
                         //   channelName: theMessage.channel.name,
                         //   author: {
                         //     id: theMessage.author.id,
                         //     username: theMessage.author.username,
                         //     discriminator: theMessage.author.discriminator,
                         //     avatar: theMessage.author.avatar,
                         //   },
                         //   content: theMessage.content,
                         //   actionRows: [],
                         //   embeds: [],
                         //   attachments: [],
                         //   reactions: [],
                         //   pinned: theMessage.pinned,
                         //   createdAt: theMessage.createdAt,
                         // };
           
                         let messageObj = {
                           content: message.content,
                           embeds: [],
                           files: message.attachments,
                           components: []
                         }
                         // for each message embed
                         if (message.embeds?.length > 0) {
                           
                           message.embeds.forEach(async (embed) => {
                             // create a discord embed obj`
                             let embedObj = {
                               title: embed?.title,
                               description: embed?.description,
                               url: embed?.url,
                               author: {
                                 name: embed?.author?.name,
                                 url: embed?.author?.url,
                                 iconURL: embed?.author?.iconURL,
                               },
                               color: embed?.color,
                               fields: [],
                               thumbnail: embed?.thumbnail?.url,
                               image: embed?.image?.url,
                               footer: {
                                 text: embed?.footer?.text,
                                 iconURL: embed?.footer?.iconURL,
                               },
                               
                             }
                             if(embed?.fields?.length > 0){
                               embed.fields.forEach(field => {
                                 embedObj.fields.push({
                                   name: field.name,
                                   value: field.value,
                                   inline: field.inline
                                 })
                               })
                             }
           
           
                             const discordEmbed = createEmb.createEmbed(embedObj);
                             // add the discord embed obj to the messageObj
                             messageObj.embeds.push(discordEmbed);
                           });
                         }
           
                         // if there are components in the message
                         if (message.actionRows?.length > 0) {
                           for (let actionRow of message.actionRows) {
                             // Iterate over each component in the action row
                             for (let component of actionRow.components) {
                               // Extract the button objs and selectMenu objs from the component
                               const buttonObjs = component.buttons; 
                               const selectMenuObjs = component.selectMenus;
                           
                               // For each buttonObj create a discord button obj
                               const buttons = [];
                               for (const buttonObj of buttonObjs) {
                                 let button = await createBtn.createButton(buttonObj);
                                 buttons.push(button);
                               }
                           
                               // For each selectMenuObj create a discord selectMenu obj
                               const selectMenus = [];
                               for (const selectMenuObj of selectMenuObjs) {
                                 const selectMenu = new StringSelectMenuBuilder()
                                   .setCustomId(selectMenuObj.customId)
                                   .setPlaceholder(selectMenuObj.placeholder)
                                   .setDisabled(selectMenuObj.disabled)
                                   .setMinValues(selectMenuObj.minValues)
                                   .setMaxValues(selectMenuObj.maxValues)
                                   .addOptions(selectMenuObj.options);
                           
                                 selectMenus.push(selectMenu);
                               }
                           
                               // Create the actionRow
                               const actRow = await createActRow.createActionRow({
                                 components: [...buttons, ...selectMenus],
                               });
                               messageObj.components.push(actRow);
                             }
                           }
                           
                         }
           
                         // send the message
                          let sentMessage;
                         try {
                            sentMessage = await channel.send(messageObj);
                         } catch (error) {
                           console.log(error)
                           await DevLT.send({content: `Error Occured trying to send message in ${channel.name} channel in the ${group.serverId} server & ${group.groupName} group\n\nTimestamp: ${new Date(Date.now())}`})
                         }
                         // update the message id in the group database
                         // find the message in the group.messages array and replace it with the new message id
                         const index = group.messages.findIndex((msg) => msg.currentID === message.currentID);
                         group.messages[index].currentID = sentMessage?.id || group.messages[index].currentID;
                         
               }
               cnt++;
             }
   
             // After processing all messages, update the group's messages in the database.
               try {
                 await groups.findOneAndUpdate(
                   { groupName: group.groupName, channelId: group.channelId },
                   { messages: group.messages, cycleStartedAt: Date.now(), onlineStatus: true }
                 );
               } catch (error) {
                 scripts.logError(error, `error updating group's Messages New currentID's`);
               }
           } else {
             // no messages to send
             console.log(`no messages to send in group ${group.groupName} for channel ${channel.name} at ${formatUnixTimestamp(Date.now())}\n\nTURNING OFF GROUP`);
             await client.devs.LT.send(`no messages to send in group ${group.groupName} for channel ${channel.name} at ${formatUnixTimestamp(Date.now())}\n\nTURNING OFF GROUP`);
             try {
               await groups.findOneAndUpdate(
                 { groupName: group.groupName, channelId: group.channelId },
                 { onlineStatus: false }
               );
             } catch (error) {
               console.log(error)
               await client.devs.LT.send(`error updating group's onlineStatus`);
             }
           }
 
 
          } else {
            console.log(`There has not been enough time since the last cycle for the ${group.groupName} group in the ${group.serverId} server & ${group.channelId} channel\n\nTimestamp: ${Date.now()}\n\nWait time: ${(cycleTime - timeElapsed) / 1000} seconds or ${(cycleTime - timeElapsed) / 60000} minutes`)
          }

      
       }
       
 
 
             }
            } else {
              await scripts.delay(10)
              cycleDynamicMessageGroups();
            }
          }

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isAutocomplete()) return;
  if (interaction?.commandName === "toggle-dynamic-message-group") {
    
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
  data: new SlashCommandBuilder()
    .setName("toggle-dynamic-message-group")
    .setDescription("Start or Stop A Dynamic Msg Group Cycle")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("group-name")
        .setDescription("The Name of the Dynamic Group")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("Toggle a group's cycle ON or OFF")
        .setRequired(true)
        .addChoices(
          {name: "ON", value: "on"},
          {name: "OFF", value: "off"}
          )
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }
    const { options } = interaction;
    let groupName = options?.getString("group-name");
    let status = options?.getString("status");
    let channel = interaction.channel;

    if (status === "on") {
      // find one and update the current group's onlineStatus to true

      try{
        await groups.findOneAndUpdate(
          { groupName: groupName, channelId: channel.id },
          { onlineStatus: true, cycleStartedAt: Date.now() }
        );
      } catch (error) {
        return await interaction.editReply({embeds: [createEmb.createEmbed({title: 'Error Occurred', description: `There was an error connecting to the database, try again\n__**Error:**__\n\`\`\`js\n${error}\`\`\``, color: scripts.getErrorColor()})]})
      }

     
      await interaction.editReply({embeds: [createEmb.createEmbed({title: 'Success', description: `Successfully started the cycle for the ${groupName} group`, color: scripts.getSuccessColor()})]})

    } else if (status === "off") {
      // find one and update the current group's onlineStatus to false

      try{
        await groups.findOneAndUpdate(
          { groupName: groupName, channelId: channel.id },
          { onlineStatus: false }
        );
      } catch (error) {
        scripts.logError(error, `error updating group's onlineStatus to false`);
      }

      await interaction.editReply({embeds: [createEmb.createEmbed({title: 'Success', description: `Successfully stopped the cycle for the ${groupName} group`, color: scripts.getErrorColor()})]})
    } 
    
   
  }, 

};
