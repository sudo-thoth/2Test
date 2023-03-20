const client = require(`../../index.js`);
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require(`../../functions/scripts/scripts_djs.js`);
const scripts_mongoDB = require(`../../functions/scripts/scripts_mongoDB.js`);
const createEmb = require(`../../functions/create/createEmbed.js`);
const createBtn = require(`../../functions/create/createButton.js`);
const createActRow = require(`../../functions/create/createActionRow.js`);
const channelsDB = require(`../../../MongoDB/db/schemas/schema_channels.js`);
const copyrightContentDB = require(`../../../MongoDB/db/schemas/schema_copyrightContent.js`);
const mongoose = require("mongoose");
let filters = {
  attachments: {
    on: `<:Online:1068901648296063047> <:10671434201602907700128:1086967254773678172> \`Attachments filter\``,
    off: `<:Offline:1068901698388623360> <:10671434201602907700128:1086967254773678172> \`Attachments filter\``,
    string: `<:10671434201602907700128:1086967254773678172> Attachments`
  },
  links: {
    on: `<:Online:1068901648296063047> <:IconStatusWebOnline:884924726814867457>\`Links filter\``,
    off: `<:Offline:1068901698388623360> <:IconStatusWebOnline:884924726814867457>\`Links filter\``,
    string: `<:IconStatusWebOnline:884924726814867457> Links`
  },
  copyrightControl: {
    on: `<:Dot3:1075069088969265152> <:No_Copyright_Icon:1086833404227616788> \`Copyright filter\``,
    off: `<:1486moderationvhighest:1086718105042034880> <:No_Copyright_Icon:1086833404227616788> \`Copyright filter\``,
    string: `<:No_Copyright_Icon:1086833404227616788> Copyright`
  }
  }

async function filterOnChannel(channel, guild) {
  try {
    let doc = await channelsDB.findOne({ channelID: channel.id, guildID: guild.id })
    if (doc?.copyright_filterOn || doc?.attachments_filterOn || doc?.links_filterOn || doc?.mentions_filterOn || doc?.profanity_filterOn || doc?.spam_filterOn || doc?.swear_filterOn || doc?.zalgo_filterOn) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    await channel.send({ embeds: [createEmb.createEmbed({ description: `ERROR:\n\`\`\`js\n${err}\`\`\``, color: scripts.getErrorColor() })] })
  }
}

let buttonEmojis = ["<a:suslook:929525675721895976>", "<a:loading:999005098153877616>", "<a:Dance:1027086599646871622>", "<a:ablobwave:607305059482468400>", "<a:999:1086670800704249919>", "<a:heartpoof:825065061617893376>", "<:chase_tele:1084267460930314341>", "<a:hmmthonk:812320213701754940>", "<a:hmm:962804016667050014>", "<a:neonthink:831210917772394546>", "<:musicfolder:1082336013201965137>", "<a:dumbpepetyping:1058900589225975898>", "<a:cuteblink:825285228112904192>", "<a:Skype_Thinking:870179836151337001>", "<a:emoji_500:988061635446997024>", "<a:happydance:1083256426249601084>", "<a:blobdance:1082904217586520144>", "<a:gonewhendemoted:1085693296996794398>", "<a:BlobBongoSpam:893861113861644328>", "<a:youtried:893859967470280734>", "<a:gx_Gunhands:817821051731443792>", "<a:announcements:1052611391858684015>", "<a:Notifbell:1052611366688669746>", "<a:Giveaways:1052611718519459850>", "<a:DiscordLoading:1075796965515853955>", "<:upscale_1:940147353879478324>", "<a:gx_MulticolorDustbin:747403256832983123>", "<a:KkirbyChillin:1033609090477334580>", "<a:YESSS:954133570010624030> ", "<a:schemein:958492006634618890>", "<a:lostwrld:1074769198670155806>", "<a:dance_monke:859562058097754133>", "<a:ahhh_vcy:1005725140274913291>", "<a:giftblob:960372456026165338>", "<a:M_OhShit:772700613670469642>", "<a:T_Google_AI:932060562668544000>", "<a:bananadance:837036207967436830>", "<a:thinkfast:811123249722818560>", "<a:blue_ribbon:1076384301232431115>", "<a:a_tada:740559067591737364>", "<a:tryitandsee:917474057048432680>", "<a:exiting:1022977820055580723>", "<a:egirls:961281622735487006>"]
function getButtonEmoji() {
  let emoji = buttonEmojis[Math.floor(Math.random() * buttonEmojis.length)];
  return emoji
}
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
let labelT = `${emoji} ${labelText[Math.floor(Math.random() * labelText.length)]
  }`;
      
  function getComponent(user, str, randID, filter) {
    let obj = null;
    let components = {
      copyright: {
        button: {
          emoji: getButtonEmoji(),
          style: 'secondary'
        },
        embed: {
          color: 'FFB700',
          // title: ` message filtered`,
          footer: {
            text: `copyright control`, iconURL: `https://cdn.discordapp.com/attachments/1070594771699118191/1086890520770510938/1086833404227616788.webp`
          },
          author: {
            name: user.username,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          },
          description: `:warning: \`Redacted Message\`\n> ${filter.filteredMessage !== `` ? filter.filteredMessage : `${filter.files.length} Attachment(s)`}`
        }
      },
      attachment: {
        button: {
          emoji: getButtonEmoji(),
          style: 'secondary'
        },
        embed: {
          color: 'FFB700',
          // title: ` message filtered`,
          footer: {
            text: `attachment filter`, iconURL: `https://cdn.discordapp.com/attachments/1070594771699118191/1086890520770510938/1086833404227616788.webp`
          },
          author: {
            name: user.username,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          },
          description: `:warning: \`Redacted Message\`\n> ${filter.filteredMessage !== `` ? `${filter.filteredMessage}\n╰ <a:Arrow_right:1022976841444769823> ${filter.files.length} Attachment(s)` : `${filter.files.length} Attachment(s)`}`
        }
      },
      link: {
        button: {
          emoji: getButtonEmoji(),
          style: 'secondary'
        },
        embed: {
          color: 'FFB700',
          // title: ` message filtered`,
          footer: {
            text: `link filter`, iconURL: `https://cdn.discordapp.com/attachments/1070594771699118191/1086890520770510938/1086833404227616788.webp`
          },
          author: {
            name: user.username,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          },
          description: `:warning: \`Redacted Message\`\n> ${filter.filteredMessage !== `` ? filter.filteredMessage : ``}`
        }
      }
    }      
    switch (str) {
      case 'copyright':
        obj = components['copyright'];
        break;
      case 'attachment':
        obj = components['attachment'];
        break;
      case 'link':
        obj = components['link'];
        break;
      default:
        console.log('Invalid input string');
    }
  
    if (obj !== null) {
      obj.button.customID = `${str}_content_${randID}`;
      obj.embed.author.name = user.username;
      obj.embed.author.iconURL = user.displayAvatarURL({ dynamic: true });
      return obj;
    } else {
      return null;
    }
  }
  
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
function filterMessage(m) {
  let obj = {
    media: false,
    links: [],
    files: [],
    message: m,
    link: false,
    file: false,
    filteredMessage: m.content,
  };
  // check message content for links
  if (m.content.includes("https://") || m.content.includes("http://")) {
    const regex = /https?:\/\/[^\s]+/g;  // regular expression to match URLs
    const links = [];  // array to store the found links
    const newStr = m.content.replace(regex, (match) => {
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
    let hasMedia = false;

    for (const file of m.attachments.values()) {
      if (file.contentType.startsWith('audio/') || file.contentType.startsWith('video/')) {
        // if the file is of type audio/mpeg or video, add it to the files array and mark the obj.media as true
        obj.files.push(file);
        hasMedia = true;
      }
    }

    obj.media = obj.media === true ? true : hasMedia;
    obj.file = obj.files.length > 0;
  }
  return obj;
  // check message object for files
}
async function saveCopyrightContent(data, randID) {
  // save the message & links & files to the db
  const author = data.message.author;
  const user = await client.users.fetch(author.id)
  let obj = {
    _id: `${new mongoose.Types.ObjectId()}`,
    randID: randID,
    channelID: data.message.channel.id,
    hasLink: data.link,
    hasFile: data.file,
    links: data.links,
    files: data.files,
    message: {
      ogContent: data.message.content,
      filteredContent: data.filteredMessage,
      id: data.message.id,
      createdAt: data.message.createdAt,
      createdTimestamp: data.message.createdTimestamp,
    },
    author: {
      id: author.id,
      username: author.username,
      discriminator: author.discriminator,
      avatarURL: user.displayAvatarURL(),
    },
  }
  try {
    await copyrightContentDB.create(obj);
    console.log(`saved to db`);
  } catch (error) {

    scripts.logError(error)
    console.log(`copyright content not saved`);
  }
  return obj;

}
async function getCopyrightContent(randID) {
  let data;

  try {
    data = await copyrightContentDB.findOne({ randID: randID })
  } catch (error) {
    console.log(`an error occurred while trying to get the data from the database: `, error);
  }
  if (data == null) {
    // console.log(data)
    console.log(`[ data ] NOT found in query`)

    return false;

  } else {
    // console.log(data)
    console.log(`[ data ] found in query: `)
    return data;
  }

}
async function sendCopyrightContent(interaction, data, string) {
  let user = interaction.user;
  let embed;
  let files, overSize, buttons, rows = [];
  const channel = client.channels.cache.get(data.warningMessage.channelID);
  const author = data.author;
  const guild = channel.guild;
  if (data.hasFile) {
    // send a dm to the user with the original content and files attached(only if the file is under 8mb), and an embed saying from server name, channel name, og author username & timestamp
   if(string === `copyright`) { embed = createEmb.createEmbed({
      title: `<:No_Copyright_Icon:1086833404227616788> copyright control`,
      description: data.message.ogContent ? `> ${data.message.ogContent}` : ``,
      color: scripts.getColor(),
      author: {
        name: author.username,
        iconURL: author.avatarURL,
      },
      footer: {
        text: `From ${channel.name} in ${guild.name} ${data.message.createdAt}`,
        iconURL: channel.guild.iconURL()
      }
    })}

    if(string === `attachment`) { embed = createEmb.createEmbed({
      title: filters.attachments.string,
      description: data.message.ogContent ? `> ${data.message.ogContent}` : ``,
      color: scripts.getColor(),
      author: {
        name: author.username,
        iconURL: author.avatarURL,
      },
      footer: {
        text: `From ${channel.name} in ${guild.name} ${data.message.createdAt}`,
        iconURL: channel.guild.iconURL()
      }
    })}
    if(string === `link`) { embed = createEmb.createEmbed({
      title: filters.links.string,
      description: data.message.ogContent ? `> ${data.message.ogContent}` : ``,
      color: scripts.getColor(),
      author: {
        name: author.username,
        iconURL: author.avatarURL,
      },
      footer: {
        text: `From ${channel.name} in ${guild.name} ${data.message.createdAt}`,
        iconURL: channel.guild.iconURL()
      }
    })}
    // for every file in the data.files check the size, if its under 8mb add it to the files array other wise add it to the over size array 
    files = data.files.filter(file => file.size < 8000000);
    overSize = data.files.filter(file => file.size >= 8000000);
    // await all the buttons by using a promise.all() notation
    // create a new button for each file in the overSize array and ad the button to the buttons array
    buttons = await Promise.all(overSize.map(async file => await createBtn.createButton({
      style: `link`,
      link: file.url,
      label: `🛰️ ${file.name}`
    })));

    // for every button, no more than 5 though at a time, in buttons arary, create a new row, then after going thorugh every button and making all possinble rows, MAX 5 buttons each, add each row to the rows array

    const maxButtonsPerRow = 5;

    let currentRowButtons = [];

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      // If we've reached the maximum number of buttons per row, start a new row
      if (currentRowButtons.length >= maxButtonsPerRow) {
        const actionRow = await createActRow.createActionRow({ components: currentRowButtons });
        rows.push(actionRow);
        currentRowButtons = [];
      }

      // Add the current button to the current row
      currentRowButtons.push(button);
    }

    // Add any remaining buttons to the last row
    if (currentRowButtons.length > 0) {
      const actionRow = await createActRow.createActionRow({ components: currentRowButtons });
      rows.push(actionRow);
    }
    if (rows.length > 5) {
      rows = rows.slice(0, 5);
    }


    try {
      await user.send({ embeds: [embed], files: files, components: rows })
    } catch (error){
      console.log(error);
      }
  } else {

    if(string === `copyright`) { embed = createEmb.createEmbed({
      title: filters.copyrightControl.string,
      description: `> ${data.message.ogContent}`,
      color: scripts.getColor(),
      author: {
        name: author.username,
        iconURL: author.avatarURL,
      },
      footer: {
        text: `From ${channel.name} in ${guild.name} ${data.message.createdAt}`,
        iconURL: channel.guild.iconURL()
      }
    })}

    if(string === `attachment`) { embed = createEmb.createEmbed({
      title: filters.attachments.string,
      description: `> ${data.message.ogContent}`,
      color: scripts.getColor(),
      author: {
        name: author.username,
        iconURL: author.avatarURL,
      },
      footer: {
        text: `From ${channel.name} in ${guild.name} ${data.message.createdAt}`,
        iconURL: channel.guild.iconURL()
      }
    })}
    if(string === `link`) { embed = createEmb.createEmbed({
      title: filters.links.string,
      description: `> ${data.message.ogContent}`,
      color: scripts.getColor(),
      author: {
        name: author.username,
        iconURL: author.avatarURL,
      },
      footer: {
        text: `From ${channel.name} in ${guild.name} ${data.message.createdAt}`,
        iconURL: channel.guild.iconURL()
      }
    })}
    try {
      await user.send({ embeds: [embed] })
    } catch (error){
      console.log(error);
      }
  }

}
async function sendCopyrightContentBackup(interaction, data) {
  let user = interaction.user;
  let embed;
  let files, overSize, buttons, rows = [];
  const channel = client.channels.cache.get(data.warningMessage.channelID);
  const author = data.author;
  const guild = channel.guild;
  if (data.hasFile) {
    // send a dm to the user with the original content and files attached(only if the file is under 8mb), and an embed saying from server name, channel name, og author username & timestamp
    embed = createEmb.createEmbed({
      title: `<:No_Copyright_Icon:1086833404227616788>* copyright control*`,
      description: data.message.ogContent ? `> ${data.message.ogContent}` : ``,
      color: scripts.getColor(),
      author: {
        name: author.name,
        iconURL: author.avatar,
      },
      footer: {
        text: `From ${channel.name} in ${guild.name} ${data.message.createdAt}`
      }
    })
    // for every file in the data.files check the size, if its under 8mb add it to the files array other wise add it to the over size array 
    files = []
    overSize = data.files
    // create a new button for each file in the overSize array and ad the button to the buttons array
    buttons = overSize.map(async file => await createBtn.createButton({
      style: `link`,
      link: file.url,
      label: `🛰️ ${file.name}`
    }));
    // for every button, no more than 5 though at a time, in buttons arary, create a new row, then after going thorugh every button and making all possinble rows, MAX 5 buttons each, add each row to the rows array
    const maxButtonsPerRow = 5;

    let currentRowButtons = [];

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      // If we've reached the maximum number of buttons per row, start a new row
      if (currentRowButtons.length >= maxButtonsPerRow) {
        const actionRow = await createActRow.createActionRow({ components: currentRowButtons });
        rows.push(actionRow);
        currentRowButtons = [];
      }

      // Add the current button to the current row
      currentRowButtons.push(button);
    }

    // Add any remaining buttons to the last row
    if (currentRowButtons.length > 0) {
      const actionRow = await createActRow.createActionRow({ components: currentRowButtons });
      rows.push(actionRow);
    }
    if (rows.length > 5) {
      rows = rows.slice(0, 5);
    }


    await user.send({ embeds: [embed], components: rows })
  } else {
    embed = createEmb.createEmbed({
      title: `<:No_Copyright_Icon:1086833404227616788>* copyright control*`,
      description: `> ${data.message.ogContent}`,
      color: scripts.getColor(),
      author: {
        name: author.name,
        iconURL: author.avatar,
      },
      footer: {
        text: `From ${channel.name} in ${guild.name} ${data.message.createdAt}`
      }
    })
    await user.send({ embeds: [embed] })
  }

}

async function sendWarningMessage(filter, user, buttonObj, embedObj) {

  let button = await createBtn.createButton(buttonObj)
  let row = await createActRow.createActionRow({ components: [button] })
  let embed = createEmb.createEmbed(embedObj)
  let warningMessage;
  try {
    warningMessage = await filter.message.channel.send({ embeds: [embed], components: [row] })
    return warningMessage;
  } catch (error) {
    await user.send({ embeds: [createEmb.createEmbed({ description: `I had trouble sending **[This Message](${m.url})** in a redacted form\n**Please Go Back And Delete The Potentially Copyrighted Message**\n\`\`\`js\n${error}\`\`\`` })] })
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
    if (client.connectedToMongoose) {
      if (m.author.bot !== true) {
        // run function that takes in the channel and guild as parameters and returns a boolean
        const filterOn = await filterOnChannel(channel, guild);

        if (filterOn) {
          // pass the message to the filter function that checks if the message contains a link or an audio/video file attachment and returns an object with the properties being {media: boolean, links: array, files: array, message: object}
          console.log(`filterOn is true and here is the message: ${m.content}`, m.attachments)
          const filter = filterMessage(m); // this is a temp uncomplete function 

          if (filter.media) {
            // if the message contains a link or an audio/video file attachment, then the message is deleted from the channel, the link(s) or file(s) are extracted from the message content and the message object, then the data is saved to the database under a unique id to access later, A button will be created with a title `DM Content`, secondary type, and a custom id that ends in the same unique id from the link or file, when this button is pressed it triggers an event that dm's the user who pressed it the link or file associated with the custom ID ending along with the original message content, author, etc., The original message content minus the link(s) or file(s) that was extracted will be placed into an embed's description with a title of `Copyright Control` with an author being the original message's user info and avatarURL and with a footer being the og channel name, server name, & time stamp of the original messages time sent into the channel, then a message is sent into the same channel where the original message was pulled from, this message object is composed of the `Copyright Control` embed and the `DM Content` button, then the filter continues to listen for more messages
            let author = m.author;
            const user = await client.users.fetch(author.id)
            let randID = scripts_djs.getRandID();
            // delete the message from the channel
            try {
              await m.delete();
            } catch (error) {

              try {
                user.send({ embeds: [createEmb.createEmbed({ description: `I had trouble deleting **[This Message](${m.url})**\n**Please Go Back And Delete The Potentially Copyrighted Message**\n\`\`\`js\n${error}\`\`\`` })] })
              } catch (errr) {
                console.log(error, errr)
              }
            }

            // save the message & links & files to the db
            let obj = await saveCopyrightContent(filter, randID);
            let string;
            if(filter.file && filter.link){
              string = `copyright`
            } else if (filter.link){
              string = `link`
            } else if(filter.file){
              string = `attachment`
            }

            let newObj = getComponent(user, string, randID, filter)
            // send a replacement message with the `Copyright Control` embed and the `DM Content` button

            
            
                        
            let warningMessage = await sendWarningMessage(filter, user, newObj.button, newObj.embed)
            // does not work as of now, mess's up the database
            if (warningMessage) {
              obj.warningMessage = {
                embed: newObj.embed,
                url: warningMessage.url,
                button: newObj.button,
                id: warningMessage.id,
                channelID: warningMessage.channel.id
              };
              // save the warning message to the copyright content data in db
              const query = { randID: randID };
              const update = {
                $set: {
                  warningMessage: obj.warningMessage
                }
              };
              try {
                const result = await copyrightContentDB.findOneAndUpdate(query, update, { upsert: true });
                console.log(`found it and updated it successfully: `, result);
              } catch (error) {
                console.log(`an error occurred while trying to update the data to the database: `, error);
              }

            }
          } else {
            // if the message does not contain a link or an audio/video file attachment, then nothing happens the message and the filter keeps listening for more messages
            return;
          }
        } else {
          // if the feature is not on in the database for the messages channel & server, then nothing happens the message and the filter keeps listening for more messages
          return;
        }
      }
    } else {
      // if the bot is not connected to the database, then nothing happens the message and the filter keeps listening for more messages
      return;
    }





  });



  client.on("interactionCreate", async (interaction) => {
    // BUTTONS
    if (interaction.isButton()) {
      console.log(`Button Clicked`);
      const interactionObj = scripts_djs.getInteractionObj(interaction);
      const { customID } = interactionObj;

      if (customID.includes("copyright_content_") || customID.includes("attachment_content_") ||customID.includes("link_content_")) {
        try {
          await interaction.deferReply({ ephemeral: true });
        } catch (error) {
          console.log(error.message);
          interaction.user.send({ embeds: [createEmb.createEmbed({ description: `I had trouble deferring the reply to **[This Message](${interaction.message.url})**\n**Let Steve Jobs know**\n\`\`\`js\n${error}\`\`\`` })] })
        }
        let string;
            if(customID.includes(`copyright`)){
              string = `copyright`
            } else if (customID.includes(`link`)){
              string = `link`
            } else if(customID.includes(`attachment`)){
              string = `attachment`
            }
        // when this button is clicked extract the data from the database and dm the user who pressed it the link or file associated with the custom ID ending along with the original message content, author, etc.
        let randID = scripts_djs.extractID(customID);
        let data = await getCopyrightContent(randID);

        // if theres not data found then send a reply message to the user with an embed saying `No data found`
        if (data) {

          try {
            await interaction.editReply({
              embeds: [createEmb.createEmbed({
                title: " loading data... ",
              })]
            });
          } catch (error) {
            if (error.message.includes(`The reply to this interaction has not been sent or deferred`)) {
              try {
                await interaction.reply({
                  ephemeral: true,
                  embeds: [createEmb.createEmbed({
                    title: " loading data... ",
                  })]
                });
              } catch (error) {
                await scripts_djs.throwErrorReply({ interaction, error });
              }
            } else {
              await scripts_djs.throwErrorReply({ interaction, error });
            }

          }
          sendCopyrightContent(interaction, data, string)
            .then(async () => {

              try {
                return interaction.editReply({
                  embeds: [createEmb.createEmbed({
                    title: labelT,
                  })]
                })
              } catch (error) {
                if (error.message.includes(`The reply to this interaction has not been sent or deferred`)) {
                  try {
                    return interaction.reply({
                      embeds: [createEmb.createEmbed({
                        title: labelT,
                      })]
                    })
                  } catch (error) {
                    console.log(error)
                    // await scripts_djs.throwErrorReply({ interaction, error }); // this is where multiple embeds got sent into channel
                  }
                } else {
                  // await scripts_djs.throwErrorReply({ interaction, error });
                  console.log(error)
                }
              }
            })
            .catch(async (error) => {
              if (error.message.includes(`Request aborted`)) {
                sendCopyrightContentBackup(interaction, data)
                  .then(() => {
                    return interaction.editReply({
                      embeds: [createEmb.createEmbed({
                        title: labelT,
                      })]
                    });
                  })
                  .catch(async (error) => {
                    await scripts_djs.throwErrorReply({ interaction, error });
                  });
              } else {
                await scripts_djs.throwErrorReply({ interaction, error });
              }
            });

        } else {
          await interaction.editReply({
            embeds: [createEmb.createEmbed({
              title: "No data found",
            })]
          })
        }
        // client.emit("GroupBuyButton", interaction);
      }
    }

  });
}
