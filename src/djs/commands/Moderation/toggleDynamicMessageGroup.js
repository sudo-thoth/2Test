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


client.on("ready", () => {


  // Run the function immediately after the bot login
  cycleDynamicMessageGroups();
  console.log("Completed cycleDynamicMessageGroups Check");
  // Run the function every 3 minutes (180000 milliseconds) after the bot login
  setInterval(cycleDynamicMessageGroups, 30000);  // per 30 sec = 30000
});
            
async function cycleDynamicMessageGroups() {
    // fetch a user by id
    const DevLT = await client.users.fetch(`975944168373370940`);
    let deleted = false;
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
    try {
      const groupsToCycle = await groups.find({
        onlineStatus: true,
        $expr: { $gt: [ { $size: "$messages" }, 0 ] }
        
      });
      groupsToCycle.forEach(async (group) => {
        const currentDate = Date.now();
        const cycleStartTime = group.cycleStartedAt;
        let cycleTime = 1800000; // 30 minutes
        // create 1 min cycle time for testing
         cycleTime = 10000; // 10 sec
         const timeElapsed = currentDate - cycleStartTime;

         console.log(`the cycleStartTime is ${formatUnixTimestamp(cycleStartTime)}\n\n`);
         console.log(`the currentDate is ${formatUnixTimestamp(currentDate)}\n\n`);
         console.log(`the timeElapsed is ${new Date(timeElapsed / 1000)}\n\n`);
         if (timeElapsed >= cycleTime || !cycleStartTime) {
           // delete all the messages in the group
           const channel = client.channels.cache.get(group.channelId);
           let messages = await channel.messages.fetch({ limit: 100 });
           let groupMessages = messages.filter(
             (message) => message.author.id === client.user.id
           ) || [];
           
           while (messages.size === 100) {
             const lastMessageId = messages.last().id;
             messages = await channel.messages.fetch({ limit: 100, before: lastMessageId });
             let validMessages = messages.filter(
               (message) => message?.author?.id === client?.user?.id
             );
             if (validMessages.size > 0) {
               groupMessages.concat(validMessages);
               
 
             }
           }
           let deletedMessages = [];
 let reactions = [];
           if (groupMessages.size > 0) {
             let msgToDelete = groupMessages.filter((message) => {
 
 let toBeDeleted;  
               toBeDeleted= group.messages.some((groupMessage) => {
 
                 if (message.id === groupMessage.currentID){
                   deletedMessages.push(message);
                 }
                 let pushed = message.id === groupMessage.currentID || message.id === groupMessage.id;
 
                 return pushed;
               });
 
               return toBeDeleted;
               
             });
 
             if(msgToDelete.size <= 0){
               console.log(`no messages to delete`);
              return  await client.devs.LT.send(`no messages to delete in group ${group.name} for channel ${channel.name} at ${formatUnixTimestamp(Date.now())}`);
             }
          
            const batchSize = 100;
            let batch = new Collection(msgToDelete.first(batchSize).map((message) => [message.id, message]));
let batchCount = 0;
let promises = [];

while (batch.size > 0) {
  const bulkDeletePromise = channel.bulkDelete(batch).then(() => {
    batchCount++;
    console.log(`Deleted batch ${batchCount} of ${batch.size} messages`);
  }).catch((error) => {
    console.log(error);
  });

  promises.push(bulkDeletePromise);

  // Update batch for next iteration
  msgToDelete = msgToDelete.filter((_, key) => !batch.has(key));
  batch = new Collection(msgToDelete.first(batchSize).map((message) => [message.id, message]));
}

Promise.all(promises).then(async () => {
  console.log("done");
  
  if(promises.length > 0){
                // send all the messages in the group again
                 const groupMessagesArray = group.messages;
                // const groupMessagesArray = deletedMessages;
            
            for (let message of groupMessagesArray) {
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
              // find the matching message in the deletedMessages array based on the currentID
              const theMessage = deletedMessages.find((msg) => {
                let id = message.currentID || message;
                return msg.id === id;
              });
              let messageObj = {
                content: message.content,
                embeds: [],
                files: message.attachments,
                components: []
              }
              // fror each message embed
              if (message.embeds?.length > 0) {
                
                message.embeds.forEach(async (embed) => {
                  // create a discord embed obj`
                  const discordEmbed = createEmb.createEmbed(embed);
                  // add the discord embed obj to the messageObj
                  messageObj.embeds.push(discordEmbed);
                });
              }
  
  
              // // extract the message's actionRows
              // if (message.actionRows.length > 0) {
              //   message.actionRows.forEach(async (actionRow) => {
              //     //extract the button objs and selectMenu objs from the actionRow
              //     const buttonObjs = actionRow.components.filter(
              //       (component) => component.type === "BUTTON"
              //     );
              //     const selectMenuObjs = actionRow.components.filter(
              //       (component) => component.type === "SELECT_MENU"
              //     );
              //     // for each buttonObj create a discord button obj
              //     const buttons = [];
              //     buttonObjs.forEach(async (buttonObj) => {
              //       const button = await createBtn.createButton(buttonObj);
              //       buttons.push(button);
              //     });
              //     // for each selectMenuObj create a discord selectMenu obj
              //     const selectMenus = [];
              //     selectMenuObjs.forEach((selectMenuObj) => {
              //       const selectMenu = new StringSelectMenuBuilder()
              //       .setCustomId(selectMenuObj.customId)
              //       .setPlaceholder(selectMenuObj.placeholder)
              //       .setDisabled(selectMenuObj.disabled)
              //       .setMinValues(selectMenuObj.minValues)
              //       .setMaxValues(selectMenuObj.maxValues)
              //       .addOptions(selectMenuObj.options);
    
              //       selectMenus.push(selectMenu);
              //     });
              //     // create the actionRow
              //     const actRow = await createActRow.createActionRow(
              //       {
              //         components: [...buttons, ...selectMenus],
              //       }
              //     );
              //     messageObj.components.push(actRow);
              //   });
              // }
    
              // if (message.reactions.length > 0) {
              //   message.reactions.forEach(async (reaction) => {
              //     const react = await createReact.createReaction(reaction);
              //     messageObj.reactions.push(react);
              //   });
              // }
              
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
              
                      
                
  
  

              try {
                let newMessage = await channel.send(messageObj);
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
                console.log(`sent message in ${channel.name} channel in the ${group.serverId} server & ${group.groupName} group\n\nTimestamp: ${Date.now()}`)
                // update teh messages current ID
                message.currentID = newMessage.id;
                // update the group's messages array in the database
                try {
                  await groups.findOneAndUpdate(
                    { groupName: group.groupName, channelId: group.channelId },
                    { messages: groupMessagesArray }
                  );
                } catch (error) {
                  scripts.logError(error, `error updating group's Messages New currentID's`);
                }
              } catch (error) {
                console.log(error)
                await DevLT.send({content: `Error Occured trying to send message in ${channel.name} channel in the ${group.serverId} server & ${group.groupName} group\n\nTimestamp: ${Date.now()}`})
              }

            } 
            try {
              await DevLT.send({content: `Successfully sent all messages in ${channel.name} channel in the ${group.serverId} server & ${group.groupName} group\n\nTimestamp: ${Date.now()}`})
            } catch (error) {
              console.log(error)
            }
            // update the group's cycleStartTime to the current date
            try {
              await groups.findOneAndUpdate(
                { groupName: group.groupName, channelId: group.channelId },
                { cycleStartedAt: Date.now(), onlineStatus: true }
              );
            } catch (error) {
              scripts.logError(error, `error updating group's cycleStartTime`);
            }
          } else {
            await DevLT.send({content: `Error Occurred 0 Messages in ${channel.name} channel in the ${group.serverId} server & ${group.groupName} group **Were Not Deleted**\n\nTimestamp: ${Date.now()}`})
            }
  
  
}).catch(async (error) => {
  console.log("Error occurred in Promise.all", error);
  await DevLT.send({content: `Error Occured deleting All the Messages in ${channel.name} channel in the ${group.serverId} server & ${group.groupName} group **Were Not Deleted**\n\nTimestamp: ${Date.now()}`})
});

            }
              
          
// push each bulk delete into a promis array and await all of them.then( after all the messages are deleted send them again) TODO

        } else {
          console.log(`There has not been enough time since the last cycle for the ${group.groupName} group in the ${group.serverId} server & ${group.channelId} channel\n\nTimestamp: ${Date.now()}\n\nWait time: ${(cycleTime - timeElapsed) / 1000} seconds or ${(cycleTime - timeElapsed) / 60000} minutes`)}
      });
    } catch (error) {
      scripts.logError(error, `error finding groups to cycle`);
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
