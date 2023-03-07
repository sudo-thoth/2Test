const messagesdb = require("../../../MongoDB/db/schemas/schema_messages_djs.js");
const attachmentsdb = require("../../../MongoDB/db/schemas/schema_attachmentNames.js");
const createEmb = require("../create/createEmbed.js");
const createModal = require("../create/createModal.js");
const scripts_djs = require("../scripts/scripts_djs.js");
const scripts = require("../scripts/scripts.js");
const createBtn = require("../create/createButton.js");
const createActRow = require("../create/createActionRow.js");
const mongoose = require("mongoose");
const {
  Collection,
} = require("discord.js");
let getBatchId = () => {
  let batch_id = "";
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let millisecond = date.getMilliseconds();
  batch_id = `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
  return batch_id;
};
const beforeIds = new Collection();
let b4 = (interaction) => {
  return beforeIds.get(`${interaction.id}`);
};
let setBefore = (id, interaction) => {
  beforeIds.set(`${interaction.id}`, id);
};
const lastMessageIds = new Collection();
let getLastMessageID = (interaction) => {
  return lastMessageIds.get(`${interaction.id}`);
};
let setLastMessageID = (id, interaction) => {
  lastMessageIds.set(`${interaction.id}`, id);
};
const afterIds = new Collection();
let afterCollection = (interaction) => {
  return afterIds.get(`${interaction.id}`);
};
let setAfter = (id, interaction) => {
  afterIds.set(`${interaction.id}`, id);
};
const nums = new Collection();
let getNum = (interaction) => {
  return nums.get(`${interaction.id}`);
};
let setNum = (id, interaction) => {
  nums.set(`${interaction.id}`, id);
};

async function sendLoad1(interaction) {
  content = `File Archiving Initiating`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1500);
  content = `File Archiving Initiating.`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1000);
  content = `File Archiving Initiating..`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(500);
  content = `File Archiving Initiating...`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(500);
  content = `File Downloading In Progress...`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(100);
}
async function sendLoad2(interaction) {
  let content = `Fetching Messages....`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1000);
  content = `Fetching Messages`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1000);
  content = `Fetching Messages.`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1000);
  content = `Fetching Messages..`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1000);
  content = `Fetching Messages...`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
}

async function loadCooldown(interaction) {
  let content = `Archive Cooldown In Progress...`;
  try {
    await interaction.editReply({
      embeds: [createEmb.createEmbed({ title: content })],
      ephemeral: true,
    });
  } catch (error) {}
  await scripts.delay(1000);
}

async function throwErrorReply(obj) {
  // let obj = {
  //   interaction: interaction,
  //   error: error,
  //   action: action,
  //   interaction2: interaction2,
  // }
  let { interaction, error, action, interaction2 } = obj;
  if (!interaction || !error) return;
  console.log("New Error Sent In Server\n\n", error);
  try {
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: "❗️ There was an Error , Share the Error w the Developer",
          description:
            `__**While :**__ **\`${
              action !== null ? action : "? : no action inputted"
            }\`**\n` +
            `${
              interaction.commandName
                ? `Command: \`${interaction.commandName}\`\n`
                : ""
            }` +
            "```js\n" +
            error +
            "\n```\n" +
            `Error Report Summary:` +
            "\n```js\n" +
            `username: ${interaction.member.user.username}\nID: ${
              interaction.member.user.id
            }\nGuild: ${interaction.guild.name}\nGuild ID: ${
              interaction.guild.id
            }\nChannel Name: ${interaction.channel.name}\nChannel ID: ${
              interaction.channel.id
            }\nMessage ID: ${interaction.message.id}\nMessage Content: ${
              interaction.message.content
            }\nCustom ID: ${interaction.customId}\nTimestamp: ${new Date()}` +
            "\n```",
          color: scripts.getErrorColor(),
          footer: {
            text: "Contact STEVE JOBS and Send the Error",
            iconURL: interaction.user
              ? interaction.user.avatarURL()
              : interaction.client.user.avatarURL(),
          },
        }),
      ],
    });
  } catch (err) {
    if (interaction2) {
      try {
        await interaction2.editReply({
          embeds: [
            createEmb.createEmbed({
              title: "❗️ There was an Error , Share the Error w the Developer",
              description:
                `ORIGINAL ERROR\n\n__**While :**__ **\`${
                  action !== null ? action : "? : no action inputted"
                }\`**\n` +
                `${
                  interaction.commandName
                    ? `Command: \`${interaction.commandName}\`\n`
                    : ""
                }` +
                "```js\n" +
                error +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction.member.user.username}\nID: ${
                  interaction.member.user.id
                }\nGuild: ${interaction.guild.name}\nGuild ID: ${
                  interaction.guild.id
                }\nChannel Name: ${interaction.channel.name}\nChannel ID: ${
                  interaction.channel.id
                }\nMessage ID: ${interaction.message.id}\nMessage Content: ${
                  interaction.message.content
                }\nCustom ID: ${
                  interaction.customId
                }\nTimestamp: ${new Date()}` +
                "\n```" +
                `\n\nAdditional ERROR\n\n__**While :**__ **\`sending the original error message\`**\n` +
                "```js\n" +
                err +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction2.member.user.username}\nID: ${
                  interaction2.member.user.id
                }\nGuild: ${interaction2.guild.name}\nGuild ID: ${
                  interaction2.guild.id
                }\nChannel Name: ${interaction2.channel.name}\nChannel ID: ${
                  interaction2.channel.id
                }\nMessage ID: ${interaction2.message.id}\nMessage Content: ${
                  interaction2.message.content
                }\nCustom ID: ${
                  interaction2.customId
                }\nTimestamp: ${new Date()}` +
                "\n```",
              color: scripts.getErrorColor(),
              footer: {
                text: "Contact STEVE JOBS and Send the Error",
                iconURL: interaction.user
                  ? interaction.user.avatarURL()
                  : interaction2.user
                  ? interaction2.user.avatarURL()
                  : interaction.client.user.avatarURL(),
              },
            }),
          ],
        });
      } catch (errr) {
        console.log(
          `error occurred when trying to send the user this-> Error: ${error}\n\n\nThe error that occurred when trying to send the user the 2nd time -> error is: ${err}\n\n\nThe error that occurred when trying to send the user the 3rd time -> error is: ${errr}`,error
        );
      }
    } else {
      try {
        await interaction.channel.send({
          embeds: [
            createEmb.createEmbed({
              title: "❗️ There was an Error , Share the Error w the Developer",
              description:
                `ORIGINAL ERROR\n\n__**While :**__ **\`${
                  action !== null ? action : "? : no action inputted"
                }\`**\n` +
                `${
                  interaction.commandName
                    ? `Command: \`${interaction.commandName}\`\n`
                    : ""
                }` +
                "```js\n" +
                error +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction.member.user.username}\nID: ${
                  interaction.member.user.id
                }\nGuild: ${interaction.guild.name}\nGuild ID: ${
                  interaction.guild.id
                }\nChannel Name: ${interaction.channel.name}\nChannel ID: ${
                  interaction.channel.id
                }\nMessage ID: ${interaction.message.id}\nMessage Content: ${
                  interaction.message.content
                }\nCustom ID: ${
                  interaction.customId
                }\nTimestamp: ${new Date()}` +
                "\n```" +
                `\n\nAdditional ERROR\n\n__**While :**__ **\`sending the original error message\`**\n` +
                "```js\n" +
                err +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction.member.user.username}\nID: ${
                  interaction.member.user.id
                }\nGuild: ${interaction.guild.name}\nGuild ID: ${
                  interaction.guild.id
                }\nChannel Name: ${interaction.channel.name}\nChannel ID: ${
                  interaction.channel.id
                }\nMessage ID: ${interaction.message.id}\nMessage Content: ${
                  interaction.message.content
                }\nCustom ID: ${
                  interaction.customId
                }\nTimestamp: ${new Date()}` +
                "\n```",
              color: scripts.getErrorColor(),
              footer: {
                text: "Contact STEVE JOBS and Send the Error",
                iconURL: interaction.user
                  ? interaction.user.avatarURL()
                  : interaction.client.user.avatarURL(),
              },
            }),
          ],
        });
      } catch (errr) {
        console.log(
          `error occurred when trying to send the user this-> Error: ${error}\n\n\nThe error that occurred when trying to send the user the 2nd time -> error is: ${err}\n\n\nThe error that occurred when trying to send the user the 3rd time -> error is: ${errr}`, error
        );
      }
    }
  }
}


const getMessages = async (interaction, channel, obj, batchID, num) => {
  let before = obj.before;
  let after = obj.after;
  try {
    await sendLoad2(interaction);
  } catch (error) {
    console.log(`sendLoad2 Error:`,error)
    
  }
  setBefore(before, interaction);
  setAfter(after, interaction);
  let messages;
  try {
    messages = await channel.messages.fetch({
      before: before ? before : null,
      after: after ? after : null,
      limit: 100,
    });
  } catch (error) {
    console.log(
      `error occurred when trying to fetch messages\nBefore: ${before}\nAfter: ${after}\n`,
      error
    );
  }

  if (messages.size !== 0) {
    // convert the collection to an array
    messages = Array.from(messages);
    let x = false;
    for (let message of messages) {
      message = message[1];
      
      if (message.attachments ? message.attachments.size > 0 : false) {
        x = true;
      } else if (
        message.content ? containsLink(message.content.toString()) : false
      ) {
        x = true;
      } else if (hasEmbed(message)) {
        x = true;
      }
      // if x is true, then save the message to the database
      if (x) {
        num++;
        setNum(num, interaction);
        let metaData = {
          requestedBy: interaction.user.username,
          requestedByID: interaction.user.id,
          dateRequested: new Date(),
          originServer: message.guild.name,
          originServerID: message.guild.id,
          originChannelID: message.channel.id,
          originChannel: message.channel.name,
        }
        await save(message, batchID, num, metaData)
      }
    }
    let lastMessage = messages[messages.length - 1];
    let lastMessageID = lastMessage[1].id;
    let firstMessage = messages[0];
    let firstMessageID = firstMessage[1].id;
    setBefore(lastMessageID, interaction);
    setLastMessageID(lastMessageID, interaction);

    setAfter(after !== null && after ? firstMessageID : null, interaction);
    // after going through 100 messages, see if there are more
    if ((!before && !after) || !after) {
      // check for messages before the last messages that was found
      // if there are messages, call the funciton again with the updated before
      await loadCooldown(interaction);
      return await getMessages(interaction, channel, {before:`${await b4(interaction)}`}, batchID, num);
    } else if (after) {
      // check for messages after the first message found
      // if there are messages, call the funciton again with the updated after
      await loadCooldown(interaction);
      return  await getMessages(interaction, channel, {after:`${ await afterCollection(interaction)}`}, batchID, num);
    }
  }

  return;
};

function containsLink(str) {
  const linkRegex = /https?:\/\/[^\s]+/gi;
  return linkRegex.test(str);
}

function hasEmbed(message){
if (message.embeds) {
    if(message.embeds.length > 0){
      return true
    } else {
      return false
    }
} else {
  return false
}
   
}

function createNameLists(namesArray) {
  let list = [];
  let count = 0;
  let currList = [];
  for (let names of namesArray) {
    for (let name of names) {
      currList.push(name);
      count++;
      if (count === 20) {
        list.push(currList.join('\n').replace(/\n{2,}/g, '\n'));
        count = 0;
        currList = [];
      }
    }
  }
  if (currList.length > 0) {
    list.push(currList.join('\n').replace(/\n{2,}/g, '\n'));
  }
  return list;
}


let addAttachmentName = async (attachmentName, batchID) => {
  let names = await attachmentsdb.findOne({ batchID: batchID }).exec();
  names.attachments.push(attachmentName);
  await attachmentsdb.updateOne(
    { batchID: batchID },
    { $set: { attachments: names.attachments } }
  );
}

function getMessageDateTime(message) {
  const timestamp = message.createdTimestamp;
  const date = new Date(timestamp);
  return date.toLocaleString();
}

async function save(message, batchID, num, metaData){
  // for every attachment save the name to the batch's attachment array  along with the relavent message id
  // save every message content, author name, original date, date of retrieval, embed if present
  let embeds = []
  let attachments = []
  let datePosted = getMessageDateTime(message);
  if (hasEmbed(message)){
    let fields = []
    for (const embed of message.embeds) {
if (embed.fields.length > 0) {
        for (const field of embed.fields) {
          fields.push({
            name: field.name,
            value: field.value,
            inline: field.inline,
          })
        }
}
      embeds.push({
        title: embed.title ? embed.title : '',
        description: embed.description ? embed.description : '',
        url: embed.url ? embed.url : '',
        color: embed.color ? embed.color : '',
        author: {
        name: embed.author ? embed.author.name : '',
        icon_url: embed.author ? embed.author.icon_url : '',
        },
        fields: fields ? fields : [],
        timestamp: embed.timestamp ? embed.timestamp : '',
        image: embed.image ? embed.image : '',
        thumbnail: embed.thumbnail ? embed.thumbnail : '',
        footer: {
        text: embed.footer ? embed.footer.text : '',
        icon_url: embed.footer ? embed.footer.icon_url : '',
        },
        })
  }
}
let numOfEmbeds = embeds.length;
// check for attachments
if(message.attachments.size > 0){
  for(let attachment of message.attachments){
    attachment = attachment[1];
    
    let obj = {
      name: attachment.name,
      url: attachment.url,
      id: attachment.id,
      proxy_url: attachment.proxy_url,
      size: attachment.size,
      messageID: message.id,
      batchID: batchID,
      messageAuthor: message.author.username,
      timestamp: datePosted,
      metaData: metaData
    }
    attachments.push(obj)
try {
      await addAttachmentName(obj.name, batchID)
} catch (error) {
  scripts.logError(error)
  console.log(`attachment name  not saved`);
  
}
    }
}

let numOfAttachments = attachments.length;
let obj = {
  _id: `${new mongoose.Types.ObjectId()}`,
  attachments: attachments,
  embeds: embeds,
  content: message.content,
  messageAuthor: message.author.username,
  messageID: message.id,
  batchID: batchID,
 numOfAttachments: numOfAttachments,
  numOfEmbeds: numOfEmbeds,
  timestamp: datePosted,
  index: num
};

if (hasEmbed(message) || containsLink(message.content) || message.attachments.size > 0) {
  try {
    await messagesdb.create(obj);
    console.log(`saved to db`);
  } catch (error) {
    
    scripts.logError(error)
    console.log(`not saved`);
  }
  }
}

async function getMessageCreatedAt(messageId, channel) {
  try {
    const message = await channel.messages.fetch(messageId);
    const createdAt = message.createdAt;
    const date = createdAt.toLocaleDateString('en-US', { timeZone: 'UTC' });
    const time = createdAt.toLocaleTimeString('en-US', { timeZone: 'UTC' });
    const formattedDateTime = `${date} at ${time}`;
    return formattedDateTime;
  } catch (error) {
    console.error(error);
  }
}


async function uploadMessageBatch(interaction, target, beforeID, afterID) {

  setAfter(afterID, interaction);
  await sendLoad1(interaction);
  // create unique batch id
  // // batch_id will be a unique id compiled from the current date and time
  let batch_id = getBatchId();
  const originChannelID = interaction.channel.id;
  const targetChannel = target
    ? target
    : await interaction.guild.channels.fetch(originChannelID);
  console.log(`the target `, target);
  console.log(`the target channel`, targetChannel);
  // create a function that goes through and fetches every message in the channel and only returns the messages that have attachments
  await attachmentsdb.create({
    _id: `${new mongoose.Types.ObjectId()}`,
    attachments: [],
    batchID: batch_id,
  });

  try {
    setNum(0, interaction);
    await getMessages(interaction, targetChannel, {before: beforeID, after: afterID} , batch_id,0);
  } catch (error) {
    console.log(error);
    await throwErrorReply({interaction: interaction, error: error, action: "getting all the channels messages "});
  }

  let names = await attachmentsdb.findOne({ batchID: batch_id }).exec();
  // if (names === []) {

  //   await interaction.editReply({
  //     embeds: [
  //       createEmb.createEmbed({
  //         title: `:no: No Files Saved!`,
  //       })]}); return;
  // }
  let numSaved = getNum(interaction)
  if (numSaved <= 0) {

    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: `❌ No Files or Messages with Content Found!`,
        })]}); return;
  }
   names = names.attachments

  let numOfAttachments = names.length;
  let lists = createNameLists(names);
  const lmid = getLastMessageID(interaction);
  let dateOfMessage = await getMessageCreatedAt(lmid, targetChannel);
  dateOfMessage = !dateOfMessage ? 'unknown' : dateOfMessage;
  for (let i = 0; i < lists.length; i++) {

    if (i == 0) {

      try {

        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `✅ Save Complete!`,
              description: `\`${numOfAttachments}\` \`${
                numOfAttachments === 1 ? `File Saved out from ${numSaved ===1 ? `the 1 Message Saved`:`the ${numSaved} Total Messages Saved`}` : `files saved from the ${numSaved} Total Messages Saved`
              }\`-----\`batch id: ${batch_id}\`\n\nUse \`/downloadfiles\` command and enter the \`batch id\` to retrieve your results\n\nFiles Saved:\n${lists[i]}`,
              color: scripts.getSuccessColor(),
            }),
          ],
          content: `||\`batch id:\` \`${batch_id}\`||\n\nThe Last Message ID is : ${lmid}\ndate : ${dateOfMessage}`,
        });
      } catch (error) {
       if (error.message ==='Invalid Webhook Token') {
         let timeoutMessage;
         try {
          timeoutMessage = await targetChannel.send({content:`<@${interaction.user.id}>`,embeds: [
           createEmb.createEmbed({
               title: `${numSaved} Results Were Sent To Your DMs`,
               description: `Due to: ❌ Invalid Webhook Token\nThere were so many messages to be saved, the original Results Message Timed Out`,
               color: scripts.getErrorColor(),
             }),
           ]})
           await scripts.delay(10000)
           // delte the timeoutmessage that was just sent
           await timeoutMessage.delete()
         } catch (error) {
          console.log(`error sending ❌ Invalid Webhook Token message with batch id ${batch_id}`, error);
         }
        } else {
        await throwErrorReply({error:error,interaction:interaction, action: `sending save complete message with batch id ${batch_id}`})
       }

      }
      try {

        await interaction.user.send({
          embeds: [
            createEmb.createEmbed({
              title: `✅ Save Complete!`,
              description: `\`${numOfAttachments}\` \`${
                numOfAttachments === 1 ? `File Saved out from ${numSaved ===1 ? `the 1 Message Saved`:`the ${numSaved} Total Messages Saved`}` : `files saved from the ${numSaved} Total Messages Saved`
              }\`-----\`batch id: ${batch_id}\`\n\nUse \`/downloadfiles\` command and enter the \`batch id\` to retrieve your results\n\nFiles Saved:\n${lists[i]}`,
              color: scripts.getSuccessColor(),
            }),
          ],
          content: ` <@${interaction.user.id}>\nFrom:\nServer:${interaction.guild.name}\nChannel:${targetChannel.name}\n||\`batch id:\` \`${batch_id}\`||\n\nThe Last Message ID is : ${lmid}\ndate : ${dateOfMessage}`,
        });
      } catch (error) {
        console.log(`error sending follow up file saved results to user via [ DM ]`, error);

      }
    } else {
      try {
        await interaction.followUp({
          embeds: [
            createEmb.createEmbed({
              title: `More Results`,
              description: `Files Saved:\n${lists[i]}`,
              color: scripts.getSuccessColor(),
            }),
          ],
          content: `||\`batch id:\` \`${batch_id}\`||\n\nThe Last Message ID is : ${lmid}\ndate : ${dateOfMessage}`,
        });
      } catch (error) {
        await throwErrorReply({error:error,interaction:interaction,action:'sending follow up file saved results'})

      }
      try {
        await interaction.user.send({
          embeds: [
            createEmb.createEmbed({
              title: `More Results`,
              description: `Files Saved:\n${lists[i]}`,
              color: scripts.getSuccessColor(),
            }),
          ],
          content: ` <@${interaction.user.id}>\nFrom:\nServer:${interaction.guild.name}\nChannel:${targetChannel.name}\n||\`batch id:\` \`${batch_id}\`||\n\nThe Last Message ID is : ${lmid}\ndate : ${dateOfMessage}`,
        });
      } catch (error) {
        console.log(`error sending follow up file saved results to user via [ DM ]`, error);

      }
    }
  }
  }
  function generatePossibleNames(fileName) {
    const nameWithoutUnderscores = fileName.replace(/_/g, ' ');
    const trueTitle = nameWithoutUnderscores.replace(/v\d+/i, '').trim();
    const possibleNames = [
      trueTitle,
      nameWithoutUnderscores,
      fileName,
    ];
    const output = `Name: \`${trueTitle}\`\nPossible Names: \`${possibleNames.join(', ')}\``;
    return output;
  }
  

  function formatFileList(fileNames) {
    const formattedNames = fileNames.map((name) => `- ${name}\n`).join('');
    const filteredNames = formattedNames.replace(/\n{2,}/g, '\n');
    const output = `${filteredNames}`;
    return output;
  }
  function getValidAttachments(attachments, limit) {
    let newAttachments = attachments.filter(builder => builder.attachment.size  <= Math.pow(1024, 2) * limit)
    return newAttachments;
  }
  function getInvalidAttachments(attachments, limit) {
    let newAttachments = attachments.filter(builder => builder.attachment.size> Math.pow(1024, 2) * limit)
    return newAttachments;
  }
  const linkButton = (label, url) => {
    let button = createBtn.createButton({
      link: url,
      label: label,
      style: "link",
    });
    return button;
  };

  
  async function downloadMessageBatch(batch_id, targetChannel, interaction) {
  

    let messages = await getMessagesByBatchID(batch_id);
    // let message = messages[x]._doc;
    // let {attachments, batchID, content, embeds, index, messageAuthor, messageID, numOfAttachments, numOfEmbeds, timestamp} = message;
    // let attachment = attachments[x];
    // let { name, url, batchID, id, messageAuthor, messageID, metaData, size, timestamp} = attachment;
    // let embed = embeds[x];
    // let { title, description, url, color, author, fields, timestamp, image, thumbnail, footer } = embed;

    // let { name, icon_url } = author;
    // let { text, icon_url } = footer;
    // let { requestedBy, dateRequested, originChannel, originServer, originChannelID, originServerID, requestedByID } = metaData;
    if (messages.length === 0) {
      try {
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `❌ No Files Found!`,
              content: `\`no files found for batch id: ${batch_id}\``,
              color: scripts.getErrorColor(),
            }),
          ],
        });
      } catch (error) {
        scripts.logError(error, `error editing last reply`);
      }
      return;
    }
    let totalFilesFound = [];
  messages.forEach(async message => {
    message = message._doc
   let foundEmbeds = message.embeds;
    let embeds = [];
    for(let embed of foundEmbeds){
      let { title, description, url, color, author, fields, timestamp, image, thumbnail, footer } = embed;
      let newEmbed = createEmb.createEmbed({
        title: title,
        description: description,
        url: url,
        color: color,
        author: author,
        fields: fields,
        timestamp: timestamp,
        image: image !== ``?image.url:null,
        thumbnail: thumbnail !== ``?thumbnail.url:null,
        footer: footer
      })
      if(!newEmbed.description && !newEmbed.title)newEmbed.title = `[ Brought to u by Steve Jobs ]`;
      if(!newEmbed.description)newEmbed.description = `. . . `;
      embeds.push(newEmbed)
    }
    let attachments = [];
    let foundAttachments = message.attachments;
    let toggle = false;
    if (embeds.length ===0){
      toggle = true;
      }
    for(let attachment of foundAttachments){
      let newAttachment = scripts_djs.createAttachment({
        filename: attachment.name, url: attachment.url, description: `From ${attachment.messageAuthor} in the ${attachment.metaData.originChannel} Channel in ${attachment.metaData.originServer} ${message.timestamp? `| sent at ${message.timestamp}` : ``}`
      })
      attachments.push(newAttachment)
      if (toggle){
        embeds.push(createEmb.createEmbed({
          title: attachment.name,
          description: ``,
          color: scripts.getColor(),
          footer:{
            text: `From ${attachment.messageAuthor} in the ${attachment.metaData.originChannel} Channel in ${attachment.metaData.originServer} ${message.timestamp? `| sent at ${message.timestamp}` : ``}`
          }
        }))
      }
    }

    
    let foundContent = message.content;
    let hasLink = containsLink(foundContent)
    console.log(`>>>>>> Message has link [ ${hasLink} ] <<<<<<<<<`)
    let end = (embeds.length === 0 && attachments.length === 0&& hasLink === false);
    console.log(`>>>>>> END [ ${end} ] <<<<<<<<<`)
    if(end)  return;
    let attachmentNames = []
    let fileNames;
    for(let attachment of foundAttachments){
      let name = generatePossibleNames(attachment.name)
      attachmentNames.push(name)
      }
      totalFilesFound.push(attachmentNames)
      fileNames = attachmentNames.length>0?formatFileList(attachmentNames):fileNames;
      let limit = 8;

      let level = interaction.guild.premiumTier;
      if (level === "TIER_1" || level === 1) {
        limit = 8;
      } else if (level === "TIER_2" || level === 2) {
        limit = 50;
      } else if (level === "TIER_3" || level === 3) {
        limit = 100;
      }
      let newAttachments = getValidAttachments(attachments, limit)

      let convertAttachments = getInvalidAttachments(attachments, limit)
      let buttons = [];
      for(let attach of convertAttachments){
        console.log(`the attach-->`, attach);
        let button = await linkButton(`Download ${attach.attachment.name}`, attach.attachment.url)
        buttons.push(button)
      }
      let components = [];
      // for each button allow up to 5 buttons per action row, then make new action rows for any additional 5+ buttons, then return an array of the first 5 or less action rows
      for (let i = 0; i < buttons.length; i += 5) {
        components.push(await createActRow.createActionRow(buttons.slice(i, i + 5)));
      }
    try {
      console.log(`the channel ${targetChannel.name} ==>`, targetChannel)
      await targetChannel.send({content:`${foundContent?`> __Original Message Content__\n> ${foundContent}`:``}\n${foundAttachments.length>0?`Files:${fileNames}`:``}`, embeds: embeds, files: newAttachments, components: components})
      await scripts.delay(1333);
    } catch(error){
      console.log(`error message--->`, error.message)
      console.log(`the erroir)`,error);

      if(error.message ===`fetch failed`){
        let limit = 8;

        let level = interaction.guild.premiumTier;
        if (level === "TIER_1" || level === 1) {
          limit = 8;
        } else if (level === "TIER_2" || level === 2) {
          limit = 50;
        } else if (level === "TIER_3" || level === 3) {
          limit = 100;
        }
        let newAttachments = getValidAttachments(attachments, limit)

        let convertAttachments = getInvalidAttachments(attachments, limit)
        let buttons = [];
        for(let attach of convertAttachments){
          console.log(`the attach-->`, attach);
          let button = await linkButton(`Download ${attach.attachment.name}`, attach.attachment.url)
          buttons.push(button)
        }
        let components = [];
        // for each button allow up to 5 buttons per action row, then make new action rows for any additional 5+ buttons, then return an array of the first 5 or less action rows
        for (let i = 0; i < buttons.length; i += 5) {
          components.push(await createActRow.createActionRow(buttons.slice(i, i + 5)));
        }
        try {
          console.log(`the channel ${targetChannel.name} ==>`, targetChannel)
          await targetChannel.send({content:`${foundContent?`> __Original Message Content__\n> ${foundContent}`:``}\n${foundAttachments.length>0?`Files:${fileNames}`:``}`, embeds: embeds, files: newAttachments, components: components})
          await scripts.delay(1333);
        } catch(errorr){
          
          console.log(`the erroir)`,error);
          console.log(`the errorr)`,errorr);
          
          await throwErrorReply({error:error,interaction:interaction, action: `Sending the Message result that contained ${fileNames?`Files:${fileNames}`:foundContent!==``?foundContent:embeds.length>0?`an embed`:``}`})
        }
      }
      console.log(`the embeds`, embeds); // TODO HERE
      console.log(`Embed 1 ===`, embeds[0]);
      await throwErrorReply({error:error,interaction:interaction, action: `Sending the Message result that contained ${fileNames?`Files:${fileNames}`:foundContent!==``?foundContent:embeds.length>0?`an embed`:``}`})
    }
  
    });
  let lists = totalFilesFound.length>0?createNameLists(totalFilesFound):[`No Files, but links or embeds`];
  for (let i = 0; i < lists.length; i++) {

    if (i == 0) {

      try {

        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `✅ Download Complete!`,
              description: `\`${totalFilesFound.length}\` \`${
                totalFilesFound.length === 1 ? `File Downloaded from ${messages.length ===1 ? `the 1 Message Downloaded`:`the ${messages.length} Total Messages Downloaded`}` : `files downloaded from the ${messages.length} Total Messages Downloaded`
              }\`-----\`batch id: ${batch_id}\`\n\nFiles Downloaded:\n${lists[i]}`,
              color: scripts.getSuccessColor(),
            }),
          ],
          content: ` <@${interaction.user.id}>\nTo:\nServer:${interaction.guild.name}\nChannel:${targetChannel.name}\n||\`batch id:\` \`${batch_id}\`||`,
        });
      } catch (error) {
       if (error.message ==='Invalid Webhook Token'  ||  error.message ==='DiscordAPIError[50027]: Invalid Webhook Token') {
         let timeoutMessage;
         try {
          timeoutMessage = await targetChannel.send({content:`<@${interaction.user.id}>`,embeds: [
           createEmb.createEmbed({
               title: `${numSaved} Results Were Sent To Your DMs`,
               description: `Due to: ❌ Invalid Webhook Token\nThere were so many messages to be saved, the original Results Message Timed Out`,
               color: scripts.getErrorColor(),
             }),
           ]})
           await scripts.delay(10000)
           // delte the timeoutmessage that was just sent
           await timeoutMessage.delete()
         } catch (error) {
          console.log(`error sending ❌ Invalid Webhook Token message with batch id ${batch_id}`, error);
         }
        } else {
        await throwErrorReply({error:error,interaction:interaction, action: `sending save complete message with batch id ${batch_id}`})
       }

      }
      try {

        await interaction.user.send({
          embeds: [
            createEmb.createEmbed({
              title: `✅ Download Complete!`,
              description: `\`${totalFilesFound.length}\` \`${
                totalFilesFound.length === 1 ? `File Downloaded from ${messages.length ===1 ? `the 1 Message Downloaded`:`the ${messages.length} Total Messages Downloaded`}` : `files downloaded from the ${messages.length} Total Messages Downloaded`
              }\`-----\`batch id: ${batch_id}\`\n\nFiles Downloaded:\n${lists[i]}`,
              color: scripts.getSuccessColor(),
            }),
          ],
          content: ` <@${interaction.user.id}>\nTo:\nServer:${interaction.guild.name}\nChannel:${targetChannel.name}\n||\`batch id:\` \`${batch_id}\`||`,
        });
      } catch (error) {
        console.log(`error sending follow up file downloaded results to user via [ DM ]`, error);

      }
    } else {
      try {
        await interaction.followUp({
          embeds: [
            createEmb.createEmbed({
              title: `More Results`,
              description: `Files Downloaded:\n${lists[i]}`,
              color: scripts.getSuccessColor(),
            }),
          ],
          content: `||\`batch id:\` \`${batch_id}\`||`,
          ephemeral: true,
        });
      } catch (error) {
        await throwErrorReply({error:error,interaction:interaction,action:'sending follow up file downloaded results'})

      }
      try {
        await interaction.user.send({
          embeds: [
            createEmb.createEmbed({
              title: `More Results`,
              description: `Files Downloaded:\n${lists[i]}`,
              color: scripts.getSuccessColor(),
            }),
          ],
          content: `||\`batch id:\` \`${batch_id}\`||`,
        });
      } catch (error) {
        console.log(`error sending follow up file downloaded results to user via [ DM ]`, error);

      }
    }
  }
  
    try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `✅ Download 100% Complete!`,
            color: scripts.getSuccessColor(),
          }),
        ],
      });
    } catch (error) {
      scripts.logError(error, `error editing last reply`);
    }
  
  
    return;
  }

// here I will create function variables to retrieve current groupbuy statistics from the database

// function to retrieve the current number of groupbuys in the database
async function getGroupbuyCount() {
  let count = await groupbuys.countDocuments();
  return count;
}
// function to retrieve all groupbuys created by a specific user
async function getMessagesByBatchID(batchID) {
  let messages = await messagesdb.find({ "batchID": batchID });
  return messages;
}
// function to retrieve all groupbuys created by a specific user in a specific guild
async function getGroupbuysByUserAndGuild(userID, guildID) {
  let groupbuys = await groupbuys.find({
    "user.id": userID,
    "guild.id": guildID,
  });
  return groupbuys;
}
// function to retrieve all groupbuys created in a specific guild
async function getGroupbuysByGuild(guildID) {
  let groupbuys = await groupbuys.find({ "guild.id": guildID });
  return groupbuys;
}
// function to get the amount paid for a specific groupbuy
async function getAmountPaid(MessageID) {
  let groupbuy = await groupbuys.findById(MessageID);
  return groupbuy.amountPaid;
}

// function to add to the amount paid for a specific groupbuy
async function addAmountPaid(groupbuyID, amount) {
  let groupbuy = await groupbuys.findById(groupbuyID);
  groupbuy.amountPaid += amount;
  await groupbuys.updateOne(
    { _id: groupbuyID },
    { $set: { amountPaid: groupbuy.amountPaid } }
  );
  await refreshUpdate(groupbuyID);
}
// function to get all the current groupbuy stats and then update the message with the new stats

function getMessageObj(interaction) {
  const message = interaction.message;
  const messageId = message.id;
  const messageType = message.type;
  const messageChannelId = message.channelId;
  const messageTimeStamp = message.createdTimestamp;
  const messageDate = new Date(messageTimeStamp); // a string  "Day Month Date Hours:Minutes:Seconds GMT Year". For example, "Sun Aug 04 15:30:00 GMT 2019"
  const messageContent = message.content;
  const messageDeletable = message.deletable;
  const messageEditable = message.editable;
  const messageEditedAt = message.editedAt;
  const messageURL = message.url;
  const messageTimestamp = message.createdTimestamp;
  const messageAuthorId = message.author.id;
  const messageAuthorAvatar = message.author.avatar;
  const messageAuthorUsername = message.author.username;
  const messageAuthorDiscriminator = message.author.discriminator;
  const messageAuthorflags = message.author.flags;
  const messageGuildId = message.guildId;
  const messageGuildName = message.guild.name;
  const messageGuildIcon = message.guild.icon;
  const messageGuildURL = message.guild.url;
  if (message.components) {
    const messageComponents = message.components;
    for (const component of messageComponents) {
      const componentType = component.type;
      switch (componentType) {
        case "ActionRow":
          const componentActionRow = component;
          const componentActionRowComponents = component.components;
          for (const componentActionRowComponent of componentActionRowComponents) {
            const componentActionRowComponentType =
              componentActionRowComponent.type;
            switch (componentActionRowComponentType) {
              case "Button":
                const componentActionRowComponentButton =
                  componentActionRowComponent;
                buttons.push({
                  customId: componentActionRowComponentButton.customId,
                  label: componentActionRowComponentButton.label,
                  style: componentActionRowComponentButton.style,
                  emoji: componentActionRowComponentButton.emoji,
                  disabled: componentActionRowComponentButton.disabled,
                  url: componentActionRowComponentButton.url,
                  type: componentActionRowComponentButton.type,
                });

                break;
              case "SelectMenu":
                const componentActionRowComponentSelectMenu =
                  componentActionRowComponent;
                selectMenus.push({
                  customId: componentActionRowComponentSelectMenu.customId,
                  placeholder:
                    componentActionRowComponentSelectMenu.placeholder,
                  minValues: componentActionRowComponentSelectMenu.minValues,
                  maxValues: componentActionRowComponentSelectMenu.maxValues,
                  disabled: componentActionRowComponentSelectMenu.disabled,
                  type: componentActionRowComponentSelectMenu.type,
                  options: {
                    label: componentActionRowComponentSelectMenu.options.label,
                    value: componentActionRowComponentSelectMenu.options.value,
                    description:
                      componentActionRowComponentSelectMenu.options.description,
                    emoji: componentActionRowComponentSelectMenu.options.emoji,
                    default:
                      componentActionRowComponentSelectMenu.options.default,
                  },
                });

                break;
              default:
                break;
            }
          }
          break;
        case "Button":
          const componentButton = component;

          buttons.push({
            customId: componentButton.customId,
            label: componentButton.label,
            style: componentButton.style,
            emoji: componentButton.emoji,
            disabled: componentButton.disabled,
            url: componentButton.url,
            type: componentButton.type,
          });
          break;
        case "SelectMenu":
          const componentSelectMenu = component;
          selectMenus.push({
            customId: componentSelectMenu.customId,
            placeholder: componentSelectMenu.placeholder,
            minValues: componentSelectMenu.minValues,
            maxValues: componentSelectMenu.maxValues,
            disabled: componentSelectMenu.disabled,
            type: componentSelectMenu.type,
            options: {
              label: componentSelectMenu.options.label,
              value: componentSelectMenu.options.value,
              description: componentSelectMenu.options.description,
              emoji: componentSelectMenu.options.emoji,
              default: componentSelectMenu.options.default,
            },
          });

          break;

        default:
          break;
      }
    }
  }
  const messageAttachments = [];
  if (message.attachments) {
    const messageAttachmentsCollection = message.attachments;
    const messageAttachmentsArray = [...messageAttachmentsCollection.values()];
    for (const messageAttachment of messageAttachmentsArray) {
      messageAttachments.push({
        name: messageAttachment.name,
        id: messageAttachment.id,
        url: messageAttachment.url,
        type: messageAttachment.contentType,
        size: messageAttachment.size,
        height: messageAttachment.height,
        width: messageAttachment.width,
        proxyURL: messageAttachment.proxyURL,
        spoiler: messageAttachment.spoiler,
        description: messageAttachment.description,
        ephemeral: messageAttachment.ephemeral,
      });
    }
  }
  const messageEmbeds = [];
  if (message.embeds) {
    const messageEmbedsArray = message.embeds;
    for (const messageEmbed of messageEmbedsArray) {
      const embedObj = {
        title: messageEmbed.title,
        description: messageEmbed.description,
        url: messageEmbed.url,
        timestamp: messageEmbed.timestamp,
        color: messageEmbed.color,
        hexColor: messageEmbed.hexColor,
        footer: {
          text: messageEmbed.footer ? messageEmbed.footer.text : "",
          iconURL: messageEmbed.footer ? messageEmbed.footer.iconURL : "",
          proxyIconURL: messageEmbed.footer
            ? messageEmbed.footer.proxyIconURL
            : "",
        },
        image: {
          url: messageEmbed.image ? messageEmbed.image.url : "",
          proxyURL: messageEmbed.image ? messageEmbed.image.proxyURL : "",
          height: messageEmbed.image ? messageEmbed.image.height : "",
          width: messageEmbed.image ? messageEmbed.image.width : "",
        },
        thumbnail: {
          url: messageEmbed.thumbnail ? messageEmbed.thumbnail.url : "",
          proxyURL: messageEmbed.thumbnail
            ? messageEmbed.thumbnail.proxyURL
            : "",
          height: messageEmbed.thumbnail ? messageEmbed.thumbnail.height : "",
          width: messageEmbed.thumbnail ? messageEmbed.thumbnail.width : "",
        },
        video: {
          url: messageEmbed.video ? messageEmbed.video.url : "",
          height: messageEmbed.video ? messageEmbed.video.height : "",
          width: messageEmbed.video ? messageEmbed.video.width : "",
        },
        provider: {
          name: messageEmbed.provider ? messageEmbed.provider.name : "",
          url: messageEmbed.provider ? messageEmbed.provider.url : "",
          iconURL: messageEmbed.provider ? messageEmbed.provider.iconURL : "",
          proxyIconURL: messageEmbed.provider
            ? messageEmbed.provider.proxyIconURL
            : "",
        },
        author: {
          name: messageAuthorUsername,
          icon_url: messageAuthorAvatar,
          discriminator: messageAuthorDiscriminator,
          id: messageAuthorId,
          flags: messageAuthorflags,
          bot: false,
        },
      };
      const messageEmbedFields = [];
      if (messageEmbed.fields) {
        const messageEmbedFieldsArray = messageEmbed.fields;
        for (const messageEmbedField of messageEmbedFieldsArray) {
          messageEmbedFields.push({
            name: messageEmbedField.name,
            value: messageEmbedField.value,
            inline: messageEmbedField.inline,
          });
        }
      }
      if (messageEmbedFields.length > 0) {
        embedObj.fields = messageEmbedFields;
      }

      messageEmbeds.push(embedObj);
    }
  }
  const messageReactions = [];
  if (message.reactions.cache) {
    const messageReactionsCollection = message.reactions.cache;
    const messageReactionsArray = [...messageReactionsCollection.values()];
    for (const messageReaction of messageReactionsArray) {
      const messageReactionUsers = [];
      const messageReactionUsersCollection = messageReaction.users.cache;
      const messageReactionUsersArray = [
        ...messageReactionUsersCollection.values(),
      ];
      for (const messageReactionUser of messageReactionUsersArray) {
        messageReactionUsers.push({
          id: messageReactionUser.id,
          username: messageReactionUser.username,
          discriminator: messageReactionUser.discriminator,
          avatar: messageReactionUser.avatar,
          bot: messageReactionUser.bot,
          system: messageReactionUser.system,
          dmChannel: messageReactionUser.dmChannel,
          tag: messageReactionUser.tag,
        });
      }
      messageReactions.push({
        count: messageReaction.count,
        name: messageReaction.emoji.name,
        id: messageReaction.emoji.id,
        identifier: messageReaction.emoji.identifier,
        me: messageReaction.me, // whether the client reacted to this emoji
        users: messageReactionUsers,
      });
    }
  }
  const messageComponents = [];
  if (message.components) {
    const messageComponentsArray = message.components;
    for (const message of messageComponentsArray) {
      messageComponents.push({
        type: message.type,
        components: message.components,
      });
    }
  }
  const messageFlags = [];
  if (message.flags) {
    const messageFlagsArray = message.flags;
    for (const messageFlag of messageFlagsArray) {
      messageFlags.push({
        bitfield: messageFlag.bitfield,
      });
    }
  }
  const messageStickers = [];
  if (message.stickers) {
    const messageStickersArray = message.stickers;
    for (const messageSticker of messageStickersArray) {
      messageStickers.push({
        id: messageSticker.id,
        packID: messageSticker.packID,
        name: messageSticker.name,
        description: messageSticker.description,
        tags: messageSticker.tags,
        asset: messageSticker.asset,
        previewAsset: messageSticker.previewAsset,
        formatType: messageSticker.formatType,
      });
    }
  }
  const messageReference = {
    messageID: message.reference.messageID,
    channelID: message.reference.channelID,
    guildID: message.reference.guildID,
  };

  let messageObject = {
    id: messageId,
    type: messageType,
    content: messageContent,
    channelID: messageChannelId,
    timestamp: messageTimestamp,
    date: messageDate,
    guild: {
      id: messageGuildId,
      name: messageGuildName,
      icon: messageGuildIcon,
      url: messageGuildURL,
    },
    deletable: messageDeletable,
    editable: messageEditable,
    editedAt: messageEditedAt,
    url: messageURL,
    embeds: messageEmbeds,
    reactions: messageReactions,
    stickers: messageStickers,
    author: {
      id: messageAuthorId,
      username: messageAuthorUsername,
      discriminator: messageAuthorDiscriminator,
      avatar: messageAuthorAvatar,
    },
    reference: {
      messageID: messageReference.messageID,
      channelID: messageReference.channelID,
      guildID: messageReference.guildID,
    },
  };

  console.log(messageObject);

  return messageObject;
}

module.exports = {
  uploadMessageBatch,
  downloadMessageBatch,
  throwErrorReply,
  getMessageObj,
};
