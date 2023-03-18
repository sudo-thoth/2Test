const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const scripts = require("../../functions/scripts/scripts.js");
const channelsDB = require("../../../MongoDB/db/schemas/schema_channels.js");
const createEmb = require("../../functions/create/createEmbed.js")
const mongoose = require("mongoose");
const client = require("../../index.js");
async function throwNewError(
  action = action && typeof action === "string" ? action : null,
  interaction,
  err,
  i
) {
  console.log(`the action is`, action);
  console.log(`the interaction is`, interaction);
  console.log(`the error is`, err);
  console.log(`the index is`, i);
  try {
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: "There was an Error , Share the Error w the Developer",
          description:
            `__While :__ \`${action !== null ? action : "?"}\`\n` +
            "```js\n" +
            err +
            "\n```\n" +
            `Error Report Summary:` +
            "\n```js\n" +
            `username: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}` +
            "\n```",
          color: scripts.getErrorColor(),
          footer: {
            text: "Contact STEVE JOBS and Send the Error",
            iconURL: interaction.user.avatarURL(),
          },
        }),
      ],
    });
  } catch (error) {
    if (i) {
      try {
        await i.editReply({
          embeds: [
            createEmb.createEmbed({
              title: "There was an Error , Share the Error w the Developer",
              description:
                "```js\n" +
                err +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${i.member.user.username}\nID: ${i.member.user.id}\nGuild: ${i.guild.name}\nGuild ID: ${i.guild.id}\nChannel: ${i.channel.name}\nChannel ID: ${i.channel.id}\nMessage ID: ${i.message.id}\nButton ID: ${i.customID}` +
                "\n```",
              color: scripts.getErrorColor(),
              footer: {
                text: "Contact STEVE JOBS and Send the Error",
                iconURL: i.user.avatarURL(),
              },
            }),
          ],
        });
      } catch (errr) {
        console.log(
          `error occurred when trying to send the user this-> Error: ${err}\n\n\nThe error that occurred when trying to send the user the 2nd time -> error is: ${error}\n\n\nThe error that occurred when trying to send the user the 3rd time -> error is: ${errr}`
        );
      }
    } else {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: "There was an Error, Share the Error w the Developer",
            description:
              `${interaction.commandName
                ? `Command: \`${interaction.commandName}\`\n`
                : ""
              }` +
              "```js\n" +
              err +
              "\n```\n" +
              `Error occurred for admin user:` +
              "\n```js\n" +
              `username: ${interaction.member.user.username}\nID: ${interaction.member.user.id
              }\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id
              }\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id
              }${interaction.message
                ? `\nMessage ID: ${interaction.message.id}`
                : ""
              }${interaction.customID
                ? `\nCustom ID: ${interaction.customID}`
                : ""
              }` +
              "\n```",
            color: scripts.getErrorColor(),
            footer: {
              text: "Contact STEVE JOBS and Send the Error",
              iconURL: interaction.user.avatarURL(),
            },
          }),
        ],
      });
    }
  }
}
async function getChannel(channel) {
  
  let data;
  // searching channels db for the channel
  try {
    data = await channelsDB.findOne({ channelID: `${channel.id}`, serverID: `${channel.guild.id}` })
  } catch (error) {
    console.log(`an error occurred while trying to get the data from the database: `, error);
  }
  if (data == null) {
    // console.log(data)
    console.log(`[ data ] NOT found in query`)

    return null;

  } else {
    // console.log(data)
    console.log(`[ data ] found in query: `)
    return data;
  }

}
async function setupChannel(channel) {
  // save the message & links & files to the db
  let data;

  try {
    data = await getChannel(channel);
  } catch (error) {
    console.log(`an error occurred while trying to get the data from the database: `, error);
  }
  if (data == null) {
    // console.log(data)
    console.log(`[ data ] NOT found in query`)

    let obj = {
      _id: `${new mongoose.Types.ObjectId()}`,
      channelID: `${channel.id}`,
      channelName: `${channel.name}`,
      createdAt: `${channel.createdAt}`,
      serverName: `${channel.guild.name}`,
      serverID: `${channel.guild.id}`,
      manageable: channel.manageable,
      viewable: channel.viewable,
      parentCategoryName: `${channel.parent.name}`,
      parentCategoryID: `${channel.parentId}`,
      url: `${channel.url}`,
      copyright_filterOn: false,
      attachments_filterOn: false,
      links_filterOn: false,
    }
    try {
      await channelsDB.create(obj);
      console.log(`created & saved to db`);
    } catch (error) {
      scripts.logError(error)
      await throwNewError({ action: `copyright content not saved`, interaction: interaction, error: error });
    }

    try {
    data = await getChannel(channel);
  } catch (error) {
    console.log(`an error occurred while trying to get the data from the database: `, error);
  }
    return data;
  } else {
    // console.log(data)
    console.log(`[ data ] found in query: `)
    return data;
  }

}

async function toggleCopyrightFilter(channel, state) {
  await channelsDB.updateOne({ channelID: `${channel.id}`, serverID: `${channel.guild.id}` }, { $set: { copyright_filterOn: state } }).exec();
  await toggleAttachmentsFilter(interaction.channel, state)
  await toggleLinksFilter(interaction.channel, state)
}
async function toggleAttachmentsFilter(channel, state) {
  await channelsDB.updateOne({ channelID: `${channel.id}`, serverID: `${channel.guild.id}` }, { $set: { attachments_filterOn: state } }).exec();
}
async function toggleLinksFilter(channel, state) {
  await channelsDB.updateOne({ channelID: `${channel.id}`, serverID: `${channel.guild.id}` }, { $set: { links_filterOn: state } }).exec();
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("TOGGLE What You Want To Filter?")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption((option) =>
      option.setName("type").setDescription("type of filter to apply.")
        .addChoices(
          { name: "© Copyright Control", value: "copyright" },
          { name: "💽 Attachments", value: "attachment" },
          { name: "🔗 Links", value: "link" },
        )
    ),

  async execute(interaction) {
    const { options } = interaction;
    const type = options.getString("type")
      ? options.getString("type")
      : "No type provided.";
    await interaction.deferReply({ ephemeral: true });

    let filters = {
      attachments: {
        on: `🟢 \`💽 Attachments filter\``,
        off: `🔴 \`💽 Attachments filter\``,
        string: `💽 Attachments`
      },
      links: {
        on: `🟢 \`🔗 Links filter\``,
        off: `🔴 \`🔗 Links filter\``,
        string: `🔗 Links`
      },
      copyrightControl: {
        on: `🟢 \`© Copyright filter\``,
        off: `🔴 \`© Copyright filter\``,
        string: `© Copyright`
      }
      }

  if (client.connectedToMongoose) {
      //first see if the current channel is in teh db or not, if it is not creata an obj and upload it to the db
      let data =  await setupChannel(interaction.channel)
  
      // use a switch tree to dtermine the type (options being `type` ) 
      switch (type) {
        case `copyright`:

          if (data) {
            let state = data?.copyright_filterOn;
            if (state == true) {
              // toggle the filter to OFF and send a message saying filters been turned OFF
  
                toggleCopyrightFilter(interaction.channel, false).then(async () => {
                  await interaction.editReply({embeds: [createEmb.createEmbed({description: `${filters.copyrightControl.off} has been turned \`OFF\``})]})
                  await scripts.delay(3000)
                  await interaction.deleteReply()
                }).catch(async (error) => {            
                await throwNewError({interaction:interaction, error:error, action: `toggle copyright filter`})
              })
              
              } else {
                toggleCopyrightFilter(interaction.channel, true).then(async () => {
                  await interaction.editReply({embeds: [createEmb.createEmbed({description: `${filters.copyrightControl.on} has been turned \`ON\``})]})
                  await scripts.delay(3000)
                  await interaction.deleteReply()
                }).catch(async (error) => {            
                await throwNewError({interaction:interaction, error:error, action: `toggle copyright filter`})
              })
              }
  
            } else{
              await interaction.editReply({embeds:[createEmb.createEmbed({color: scripts.getErrorColor(),
                description: `An Error Occurred when Finding out if the Channel is already filtered or not - case: \`${type}\nContact Steve Jobs`})]})
            }
            break;
  
        case `attachment`:
        if (data) {
          let state = data?.attachments_filterOn;
          if (state == true) {
            // toggle the filter to OFF and send a message saying filters been turned OFF

              toggleAttachmentsFilter(interaction.channel, false).then(async () => {
                await interaction.editReply({embeds: [createEmb.createEmbed({description: `${filters.attachments.off} has been turned \`OFF\``})]})
                await scripts.delay(3000)
                await interaction.deleteReply()
              }).catch(async (error) => {            
              await throwNewError({interaction:interaction, error:error, action: `toggle attachments filter`})
            })
            
            } else {
              toggleAttachmentsFilter(interaction.channel, true).then(async () => {
                await interaction.editReply({embeds: [createEmb.createEmbed({description: `${filters.attachments.on} has been turned \`ON\``})]})
                await scripts.delay(3000)
                await interaction.deleteReply()
              }).catch(async (error) => {            
              await throwNewError({interaction:interaction, error:error, action: `toggle attachments filter`})
            })
            }

          } else{
            await interaction.editReply({embeds:[createEmb.createEmbed({color: scripts.getErrorColor(),
            description: `An Error Occurred when Finding out if the Channel is already filtered or not - case: \`${type}\nContact Steve Jobs`})]})
          }

        break;

        case `link`:
        if (data) {
          let state = data?.links_filterOn;
          if (state == true) {
            // toggle the filter to OFF and send a message saying filters been turned OFF

              toggleLinksFilter(interaction.channel, false).then(async () => {
                await interaction.editReply({embeds: [createEmb.createEmbed({description: `${filters.links.off} has been turned \`OFF\``})]})
                await scripts.delay(3000)
                await interaction.deleteReply()
              }).catch(async (error) => {            
              await throwNewError({interaction:interaction, error:error, action: `toggle links filter`})
            })
            
            } else {
              toggleLinksFilter(interaction.channel, true).then(async () => {
                await interaction.editReply({embeds: [createEmb.createEmbed({description: `${filters.links.on} has been turned \`ON\``})]})
                await scripts.delay(3000)
                await interaction.deleteReply()
              }).catch(async (error) => {            
              await throwNewError({interaction:interaction, error:error, action: `toggle links filter`})
            })
            }

          } else{
            await interaction.editReply({embeds:[createEmb.createEmbed({color: scripts.getErrorColor(),
            description: `An Error Occurred when Finding out if the Channel is already filtered or not - case: \`${type}\nContact Steve Jobs`})]})
          }

        break;

        default:
          await interaction.editReply({embeds: [createEmb.createEmbed({color: scripts.getErrorColor(), description: `🔴 an error occurred, please finish specifying the \`type\` of filter to apply\n\`type\` active options: \`copyright\``})]})
        break;
  
      }
  } else {
    await interaction.editReply({embeds: [createEmb.createEmbed({description: `Filters have been turned \`OFF\` Due to a disconnect with the Database Server\n\n${filters.attachments.off}\n${filters.links.off}\n${filters.copyrightControl.off}\n\n\nRequest Steve Jobs Restart the Bot for filtration abilities`})]})
  }

    console.log(`Filter Command Complete: ✅`);
  }


  }
  🔴 \`💽 Attachments filter\`\n
  🔴 \`🔗 Links filter\`\n
  🔴 \`© Copyright filter\`\n
};
