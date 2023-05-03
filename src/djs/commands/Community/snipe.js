const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType, MessageButton } = require("discord.js")
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
        serverID: snipe.guild.id, // snipe === message obj
        channelID: snipe.channel.id,
        messageID: snipe.id,
        message: {
            user: {
                userID: snipe.author.id,
                username: snipe.author.username,
            },
            messageID: snipe.id,
            channelID: snipe.channel.id,
            serverID: snipe.guild.id,
            content: snipe.content,
            timestamp: snipe.createdTimestamp,
            createdAt: `${snipe.createdAt}`,
          deletedAt: `${snipe.deletedAt}`,
            deletedTimestamp: snipe.deletedTimestamp,
            hasEmbed: snipe.embeds.length > 0,
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

    userSnipes.unshift(newSnipe);

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
        ); */
    try {
        await userData.findOneAndUpdate(
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
  
  async function displaySnipes(interaction, snipes, index, target) {
    const filteredSnipes = target
      ? snipes.filter((snipe) => snipe.author.id === target.id)
      : snipes;
    const snipe = filteredSnipes[index];

    try {
        snipe.author = await client.users.fetch(snipe.messageAuthor?.userID);
    } catch (error) {
        console.log(error)
    }
      // need to convert this embed into the createEmb.createEmbed() format
      // if the content is more than the allowed character limit in a embed field value then create an alternate embed obj structure

      // get the current servers guild url
      let guild = client.guilds.cache.get(snipe.message?.serverID); 
      let serverInviteURL = await guild?.fetchInvites()?.then(invites => invites.find(invite => invite?.channel?.type === "GUILD_TEXT"))?.then(invite => invite?.url);

      // do the same to get the channel url
      let channel = guild?.channels.cache.get(snipe.message?.channelID);
      let channelInviteURL = await channel?.fetchInvites()?.then(invites => invites.find(invite => invite?.channel?.type === "GUILD_TEXT"))?.then(invite => invite?.url);
      let embedObj;
      if(snipe.content < 1024) {
        embedObj = {
            title: `Sniped Message${target ? ` from ${target.username}` : ""}`,
            thumbnail: snipe?.author.displayAvatarURL(),
            description: `***Deleted*** <t:${snipe?.message?.deletedAt}:R>\n**\`Author:\`** \n\`${snipe.author.username}/\`||\`<@${snipe.author.id}>\`||\n**\`Originally Sent:\`** \`${new Date(snipe?.message?.createdTimestamp)}\`\n\n\`Server\` \`${snipe.serverName}\`||[${snipe.serverName}](${serverInviteURL})||\n\`Channel\` \`${snipe.channelName}\`||[${snipe.channelName}](${channelInviteURL})||`,
            fields:[
                {
                    name: "message content",
                    value: `> ${snipe.content}`, 
                    inline: false,
                },
            ],
            footer: {
                text: `Snipe ${index + 1} of ${filteredSnipes.length}`,
            },
            }
        } else {
            embedObj = {
                title: `Sniped Message${target ? ` from ${target.username}` : ""}`,
                thumbnail: snipe.author.displayAvatarURL(),
                description: `***Deleted*** <t:${snipe.deletedAt}:R>\n**\`Author:\`** \n\`${snipe.author.username}/\`||\`<@${snipe.author.id}>\`||\n**\`Originally Sent:\`** \`${new Date(snipe?.message?.createdTimestamp)}\`\n\n\`Server\` \`${snipe.serverName}\`||[${snipe.serverName}](${serverInviteURL})||\n\`Channel\` \`${snipe.channelName}\`||[${snipe.channelName}](${channelInviteURL})||\n\n> **Message Content:**\n> ${snipe.content}`,
                footer: {
                    text: `Snipe ${index + 1} of ${filteredSnipes.length}`,
                },
                }
        }

      let embed;
      try{
        embed = createEmb.createEmbed(embedObj)
      } catch (error){
        console.log(`an error occurred while trying to create the embed: `, error, embedObj)
      }

  
      const moreThanTenSnipes = filteredSnipes?.length > 10;

      // check if the current sniped message is already saved by the user to their profile in the db
        // if it is then disable the save button and label it as saved, and make blue
        // if it is not then enable the save button and label it as save, and make green
        let saveButton = {
            customId: "save",
            label: "Save",
            style: "SUCCESS",
            disabled: false
        }
        let saved = false;
        try {
            const userData = await client?.setupUser(interaction.user.id);
            let userSnipes = userData?.saved?.snipes;
            for (let snipe of userSnipes){
                if(snipe.messageID === snipe.id){
                    saved = true;
                    break;
                }
            }
            if(saved){
                saveButton = {
                    customId: "save",
                    label: "Saved",
                    style: "PRIMARY",
                    disabled: true,
                }
            } else {
                saveButton = {
                    customId: "save",
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
            customId: "first",
            label: "First",
            style: "PRIMARY",
            disabled: index === 0,
        },
        button: {},
    },
    back5: {
            obj: {
            customId: "back5",
            label: "Back by 5",
            style: "PRIMARY",
            disabled: index < 5,
        },
    button: {}
},
back: {
    obj: {
            customId: "back",
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
            customId: "next",
            label: "Next",
            style: "PRIMARY",
            disabled: index === filteredSnipes.length - 1,
        },
    button: {}
},
next5: {
    obj: {
            customId: "next5",
            label: "Forward by 5",
            style: "PRIMARY",
            disabled: index > filteredSnipes.length - 6,
        },
    button: {}
},
last: {
    obj: {
            customId: "last",
            label: "Last",
            style: "PRIMARY",
            disabled: index === filteredSnipes.length - 1,
        },
    button: {}
},
      }
      
      // for every button in the button objects create a button and add it to the buttons button property

        for (const button in buttonObjects) {
            try {
                buttonObjects[button].button = createBtn.createButton(buttonObjects[button].obj)
            } catch (error) {
                console.log(`an error occurred while trying to create the button: `, error, buttonObjects[button].obj)
            }
        }

        // determine whether to have action row A or action row B

        // action A : IF the snipe results array is more than 10 include a row like so
// modify the row to have 7 buttons in total 4 on one row 3 on another. top row 1st results button, save button, last results button. next row has Go back by 5 results button, back button, next button, Go forward by 5 results button.

// action B : IF there are 10 or less results The button row should have 5 buttons a 1st results button, back button, a save button in the middle that is disabled when clicked, next button, last results button.


const actionRowA = [buttonObjects.first.button, buttonObjects.back5.button, buttonObjects.back.button, buttonObjects.save.button, buttonObjects.next.button, buttonObjects.next5.button, buttonObjects.last.button]

const actionRowB = [buttonObjects.first.button, buttonObjects.back.button, buttonObjects.save.button, buttonObjects.next.button, buttonObjects.last.button]


const actionRow = await createActRow.createActionRow(moreThanTenSnipes ? actionRowA : actionRowB)

  
    const message = await interaction.editReply({
      embeds: [embed],
      components: [actionRow],
    });
  
    const filter = (buttonInteraction) =>{
        if (buttonInteraction.user.id === interaction.user.id){
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
      
  
    const collector = message.createMessageComponentCollector({
      filter,
      time: 60000,
    });
  
    collector.on("collect", async (buttonInteraction) => {
      await buttonInteraction.deferUpdate();
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
          if (res){
            await buttonInteraction.reply({
                embeds: [
                  createEmb.createEmbed({
                    title: `Snipe Saved`,
                    description: `The sniped message has been saved to your snipes.`,
                  }),
                ],
                ephemeral: true,
              });
          } else {
            await buttonInteraction.reply({
                embeds: [
                  createEmb.createEmbed({
                    title: `Error`,
                    description: `An error occurred while trying to save the sniped message, try again`,
                  }),
                ],
                ephemeral: true,
              });
              await scripts.delay(3000);
              await buttonInteraction.deleteReply();
            }

          break;
        case "next":
          index += 1;
          break;
        case "last":
          index = filteredSnipes.length - 1;
          break;
          case "back5":
        index = moreThanTenSnipes ? index - 5 : Math.max(0, index - 1);
        break;
      case "next5":
        index = moreThanTenSnipes
          ? index + 5
          : Math.min(filteredSnipes.length - 1, index + 1);
        break;
      }
  
      await displaySnipes(interaction, snipes, index, target);
    });
  
    collector.on("end", () => {
      interaction.editReply({
        components: [],
      });
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
        .setName("saved")
        .setDescription("View snipes you have saved.")
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
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
    const getAllSnipesHistory = options?.getBoolean("saved");
    const user = interaction?.user;

    // get the channel data from db in order to get the snipe data

    try {
        const channelData = await client.setupChannel(channel)
        if (!channelData) {
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

    const snipes = channelData.snipes;


    // If snipe history
    if (getAllSnipesHistory) {
        
      // Retrieve snipes based on user id from the database
      // Replace the following line with your database logic to retrieve snipes

      // search the user in the user db and get their saved snipes array
      const userData = await client.setupUser(user.id);
      const userSnipes = userData?.saved?.snipes;

      // filter the snipes to only being snipes from within the current server
      const s = userSnipes.filter((snipe) => snipe.guildId === interaction.guild.id);
      const snipesHistory = s;

      // Display snipes history in the same way as above; 
      
      return displaySnipes(interaction, snipesHistory, 0, target);
    }

    // If snipe
    // Get the last 50 deleted messages in the channel from the database
    // Replace the following line with your database logic to retrieve the last 50 deleted messages

    // so snipes is an array of objects, we need to get the first 50 aka the most recent 50 that were added to the array and spit it into a new array variable

    const lastDeletedMessages = snipes.slice( 0, 50)

    // Display them via embed and slideshow button style to cycle
    return displaySnipes(interaction, lastDeletedMessages, 0, target);
  },
  };
  