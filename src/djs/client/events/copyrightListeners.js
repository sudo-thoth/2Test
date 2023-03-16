const client = require(`../../index.js`);
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require(`../../functions/scripts/scripts_djs.js`);
const scripts_mongoDB = require(`../../functions/scripts/scripts_mongoDB.js`);
const createEmb = require(`../../functions/create/createEmbed.js`);
const createBtn = require(`../../functions/create/createButton.js`);
const createActRow = require(`../../functions/create/createActionRow.js`);

async function filterOnChannel(channel, guild) { // TODO: complete database aspect of the function
  await channelsDB.findOne({channelID: channel.id, guildID: guild.id}, (err, doc) => {
    if (err) {
      console.error(err);
    } else {
      if (doc?.copyright_filterOn) {
        return true;
      } else {
        return false;
      }
    }
    });
      
}
// const index = require(`src/djs/index.js`)
// const client = index.getClient();
// console.log(client);
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}
async function fileProcessing(interaction) {
  try {
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: "File Being Processed",
          description: "Please wait...",
          color: 0x00ff00,
        }),
      ],
      components: [],
    });
  } catch (error) {
    await throwNewError("Sending File Processing Update", interaction, error);
  }
}
const roleString = (roles) => {
  // for every role in the array, add it to the string
  let string = ``;
  roles.forEach((role) => {
    string += `${role && role !== null ? `${role}\n` : ``}`;
  });
  return string;
};
let sentEmojis = [
  "📨",
  "📩",
  "📤",
  "📥",
  ":wind_blowing_face:",
  ":satellite_orbital:",
  ":parachute:",
  ":boomerang:",
  ":calling:",
  ":arrow_upper_left:",
  ":mailbox_with_mail:",
  ":white_check_mark:",
  ":vibration_mode:",
  ":mailbox:",
  ":inbox_tray:",
];
let emoji = sentEmojis[Math.floor(Math.random() * sentEmojis.length)];
let labelText = [
  "Sent!",
  "Delivered!",
  "In ur Mailbox!",
  "In ur Inbox!",
  "In ur DMs!",
  "Transferred",
  "Forwarded!",
  "Mailed!",
];
let labelT = `${emoji} ${
  labelText[Math.floor(Math.random() * labelText.length)]
}`;
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
              `${
                interaction.commandName
                  ? `Command: \`${interaction.commandName}\`\n`
                  : ""
              }` +
              "```js\n" +
              err +
              "\n```\n" +
              `Error occurred for admin user:` +
              "\n```js\n" +
              `username: ${interaction.member.user.username}\nID: ${
                interaction.member.user.id
              }\nGuild: ${interaction.guild.name}\nGuild ID: ${
                interaction.guild.id
              }\nChannel: ${interaction.channel.name}\nChannel ID: ${
                interaction.channel.id
              }${
                interaction.message
                  ? `\nMessage ID: ${interaction.message.id}`
                  : ""
              }${
                interaction.customID
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

if (client) {

  // we are going to any message in a channel if that channel is listed in the database as having the feature turned on
  // After checking the data base to see if the feature is on, If it is on we will filter
  // Filter meaning, for every message thats sent by any user except a bot user's message, the message will go through a filter proccess
  // The message will be checked to see if any active internet links were included in the content & check if any audio or video file is attached to the message
  // IF the message passes the filter and does not contain a link or an audio/video attachment, then nothing happens the message and the filter keeps listening for more messages
  // IF the message includes a link(s) -> First the message is saved to a variable then is deleted from the channel,then the link(s) will be extracted from the message content, the link(s) & original message data will be saved to the database under a unique id to access later, A button will be created with a title `DM Content`, secondary type, and a custom id that ends in the same unique id form the link, when this button is pressed it triggers an event that dm's the user who pressed it the link associated with the custom ID ending along with the original message content, author, etc., The original message content minus the link(s) that was extracted will be placed into an embed's description with a title of `Copyright Control` with an author being the original message's user info and avatarURL and with a footer being the og channel name, server name, & time stamp of the original messages time sent into the channel, then a message is sent into the same channel where the original message was pulled from, this message object is composed of the `Copyright Control` embed and the `DM Content` button, then the filter continues to listen for more messages
  // IF the message inlcudes an audio or video file(s) attachment -> First the message is saved to a variable then is deleted from the channel,then the File(s) will be extracted from the message object, the file(s) & original message data will be saved to the database under a unique id to access later, A button will be created with a title `DM Content`, secondary type, and a custom id that ends in the same unique id from the file, when this button is pressed it triggers an event that dm's the user who pressed it the file associated with the custom ID ending along with the original message content, author, etc., The original message content  will be placed into an embed's description with a title of `Copyright Control` with an author being the original message's user info and avatarURL and with a footer being the og channel name, server name, & time stamp of the original messages time sent into the channel, then a message is sent into the same channel where the original message was pulled from, this message object is composed of the `Copyright Control` embed and the `DM Content` button, then the filter continues to listen for more messages
  // IF the message inlcudes BOTH an audio or video file(s) attachment && a link(s) -> First the message is saved to a variable then is deleted from the channel,then the File(s) && Link(s) will be extracted from the message object and message content respectively, the file(s), link(s), & original message data will be saved to the database under a unique id to access later, A button will be created with a title `DM Content`, secondary type, and a custom id that ends in the same unique id from the file, when this button is pressed it triggers an event that dm's the user who pressed it the file(s) & link(s) associated with the custom ID ending along with the original message content, author, etc., The original message content  will be placed into an embed's description with a title of `Copyright Control` with an author being the original message's user info and avatarURL and with a footer being the og channel name, server name, & time stamp of the original messages time sent into the channel, then a message is sent into the same channel where the original message was pulled from, this message object is composed of the `Copyright Control` embed and the `DM Content` button, then the filter continues to listen for more messages

  client.on("messageCreate", async (m) => {
    
    // run checks to see if the feature is on in the database for the messages channel & server
    const channel = m.channel;
    const guild = m.guild;
    // run function that takes in the channel and guild as parameters and returns a boolean
    const filterOn = await filterOnChannel(channel, guild); 

    if (filterOn) {
      // pass the message to the filter function that checks if the message contains a link or an audio/video file attachment and returns an object with the properties being {media: boolean, links: array, files: array, message: object}
      const filter = filterMessage(m); // this is a temp uncomplete function // TODO: complete this function
      function filterMessage(m) {
        let obj = {
          media: false,
          links: [],
          files: [],
          message: m,
          link: false,
          file: false,
          filteredMessage: ``,
        };
        // check message content for links
        if (m.content.includes("https://") || m.content.includes("http://")) {
          const regex = /https?:\/\/[^\s]+/g;  // regular expression to match URLs
          const links = [];  // array to store the found links
          const newStr = str.replace(regex, (match) => {
            links.push(match);  // push the matched link to the array
            return '`[*]`';  // replace the link in the string with `[*]`
          });
          obj.filteredMessage = newStr;
          obj.media = true;
          obj.links = links;
          obj.link = true;
        }
        // check message object for files
        if (m.attachments.size > 0) {
          obj.media = true;
          // for every file attachment in the message object, push the file to the files array
          for (const file of m.attachments.values()) {
            obj.files.push(file);
          }
          obj.file = true;
        }
        return obj;
        // check message object for files
      }
      if (filter.media) {
        // if the message contains a link or an audio/video file attachment, then the message is deleted from the channel, the link(s) or file(s) are extracted from the message content and the message object, then the data is saved to the database under a unique id to access later, A button will be created with a title `DM Content`, secondary type, and a custom id that ends in the same unique id from the link or file, when this button is pressed it triggers an event that dm's the user who pressed it the link or file associated with the custom ID ending along with the original message content, author, etc., The original message content minus the link(s) or file(s) that was extracted will be placed into an embed's description with a title of `Copyright Control` with an author being the original message's user info and avatarURL and with a footer being the og channel name, server name, & time stamp of the original messages time sent into the channel, then a message is sent into the same channel where the original message was pulled from, this message object is composed of the `Copyright Control` embed and the `DM Content` button, then the filter continues to listen for more messages
let author = m.author;
let randID = scripts_djs.getRandID();
        // delete the message from the channel
        m.delete();

        // save the message & links & files to the db
        await saveCopyrightContent(filter, randID); // this is a temp uncomplete function // TODO: complete this function

        // send a replacement message with the `Copyright Control` embed and the `DM Content` button
        const message = await scripts_djs.sendCopyrightControlMessage(m, randID); // this is a temp uncomplete function // TODO: complete this function
       } else {
        // if the message does not contain a link or an audio/video file attachment, then nothing happens the message and the filter keeps listening for more messages
        return;
      }
    } else {
      // if the feature is not on in the database for the messages channel & server, then nothing happens the message and the filter keeps listening for more messages
      return;
    }
        
        



  });



  client.on("interactionCreate", async (interaction) => {
    // BUTTONS
    if (interaction.isButton()) {
      console.log(`Button Clicked`);

      if (customID.includes("copyright_content")) {
        await interaction.deferReply({ ephemeral: true });
        // when this button is clicked extract the data from the database and dm the user who pressed it the link or file associated with the custom ID ending along with the original message content, author, etc.
        let randID = scripts_djs.extractID(interaction.customID);
        let data = await getCopyrightContent(randID); // this is a temp uncomplete function // TODO: complete this function
        // if theres not data found then send a reply message to the user with an embed saying `No data found`
        if (data) {
          
          await interaction.editReply({ embeds: [createEmb.createEmbed({
            title: " loading data... ",
          })] });
          sendCopyrightContent(interaction, data) // this is a temp uncomplete function // TODO: complete this function
          .then(() => {
            return interaction.editReply({ embeds: [createEmb.createEmbed({
              title: labelT,
            })] });
          })
          .catch(async (error) => {
            await scripts_djs.throwErrorReply({interaction, error});
          });
        
        } else {
          await interaction.editReply({embeds: [createEmb.createEmbed({
            title: "No data found",
          })]})
        }
        // client.emit("GroupBuyButton", interaction);
      } 
    }

  });
}
