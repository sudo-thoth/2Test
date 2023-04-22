const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require("dotenv").config({ path: "../../my.env" });
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const groups = require("../../../MongoDB/db/schemas/schema_group.js");
const mongoose = require("mongoose");


async function cycleDynamicMessageGroups() {
    
  // create a function to be called upon bot login that every 3 minutes it checks the groups db and all the groups cycleStartTime and if the current date is 30 minutes or more after the cycleStartTime then it deletes all the messages of the group and sends them again in the same order

  // find all the groups that have onlineStatus === true
  // if the current date is 30 minutes or more after the cycleStartTime then it deletes all the messages of the group and sends them again in the same order
  // if the current date is less than 30 minutes after the cycleStartTime then it does nothing
  // if the current date is 30 minutes or more after the cycleStartTime then it deletes all the messages of the group and sends them again in the same order
if (client.connectedToMongoose) {
  
    try {
      const groupsToCycle = await groups.find({
        onlineStatus: true,
      });
      groupsToCycle.forEach(async (group) => {
        const currentDate = Date.now();
        const cycleStartTime = group.cycleStartedAt;
        const cycleTime = 1800000;
        const timeElapsed = currentDate - cycleStartTime;
        if (timeElapsed >= cycleTime) {
          // delete all the messages in the group
          const channel = client.channels.cache.get(group.channelId);
          const messages = await channel.messages.fetch();
          const groupMessages = messages.filter(
            (message) => message.author.id === client.user.id
          );
          groupMessages.forEach(async (message) => {
            try {
              await message.delete();
            } catch (error) {
              scripts.logError(error, `error deleting group message`);
            }
          });
          // send all the messages in the group again
          const groupMessagesArray = group.messages;
          
          groupMessagesArray.forEach(async (message) => {
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
              embeds: message.embeds,
              files: message.attachments,
              components: []
            }
            // extract the message's actionRows
            if (message.actionRows.length > 0) {
              message.actionRows.forEach((actionRow) => {
                //extract the button objs and selectMenu objs from the actionRow
                const buttonObjs = actionRow.components.filter(
                  (component) => component.type === "BUTTON"
                );
                const selectMenuObjs = actionRow.components.filter(
                  (component) => component.type === "SELECT_MENU"
                );
                // for each buttonObj create a discord button obj
                const buttons = [];
                buttonObjs.forEach((buttonObj) => {
                  const button = await createBtn.createButton(buttonObj);
                  buttons.push(button);
                });
                // for each selectMenuObj create a discord selectMenu obj
                const selectMenus = [];
                selectMenuObjs.forEach((selectMenuObj) => {
                  const selectMenu = new StringSelectMenuBuilder()
                  .setCustomId(selectMenuObj.customId)
                  .setPlaceholder(selectMenuObj.placeholder)
                  .setDisabled(selectMenuObj.disabled)
                  .setMinValues(selectMenuObj.minValues)
                  .setMaxValues(selectMenuObj.maxValues)
                  .addOptions(selectMenuObj.options);
  
                  selectMenus.push(selectMenu);
                });
                // create the actionRow
                const actionRow = await createActRow.createActionRow(
                  {
                    components: [...buttons, ...selectMenus],
                  }
                );
                messageObj.components.push(actionRow);
              });
            }
  
            // fetch a user by id
             const DevLT = await client.users.fetch(`975944168373370940`);
            try {
              await channel.send(messageObj);
            } catch (error) {
              console.log(error)
              await DevLT.send({content: `Error Occured trying to send message in ${channel.name} channel in the ${group.serverId} server & ${group.groupName} group\n\nTimestamp: ${Date.now()}`})
            }
          }); 
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
        }
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
  if (interaction?.commandName === "manage-dynamic-message-group") {
    
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

client.on("ready", () => {


  // Run the function immediately after the bot login
  cycleDynamicMessageGroups();
  console.log("Completed cycleDynamicMessageGroups Check");
  // Run the function every 3 minutes (180000 milliseconds) after the bot login
  setInterval(cycleDynamicMessageGroups, 180000);
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("manage-dynamic-message-group")
    .setDescription("Start or Stop A Dynamic Msg Group Cycle")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("group-name")
        .setDescription("The Name of the Dynamic Group")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addChannelOption((option) =>
      option
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
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
    let status = options?.getChannel("status");

    if (status === "on") {
      // find one and update the current group's onlineStatus to true

      try{
        await groups.findOneAndUpdate(
          { groupName: groupName, channelId: channel.id },
          { onlineStatus: true, cycleStartedAt: Date.now() }
        );
      } catch (error) {
        return await interaction.editReply({embeds: [createEmb.createEmbed(title: 'Error Occurred', description: `There was an error connecting to the database, try again\n__**Error:**__\n\`\`\`js\n${error}\`\`\``, color: scripts.getErrorColor())]})
      }

     
      

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
    } 
    
   
  }, 

};
