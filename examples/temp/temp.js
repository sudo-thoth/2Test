const beforeIds = new Collection();
let b4 = (interaction) => {
  return beforeIds.get(`${interaction.id}`);
};
let setBefore = (id, interaction) => {
  beforeIds.set(`${interaction.id}`, id);
};

let fileNameArray = (interaction) => {
  return fileNames.get(`${interaction.id}`)
    ? fileNames.get(`${interaction.id}`)
    : [];
};
let setFileNameArray = (array, interaction) => {
  fileNames.set(`${interaction.id}`, array);
};


const filesFound = new Collection();
let filesFoundArray = (interaction) => {
  console.log(`files found: ${filesFound.get(interaction.id)}`);

  return filesFound.get(`${interaction.id}`);
};
let setFilesFoundArray = (interaction, newFile) => {
  // if there is nothing in the collection, create a new array and add the file to it
  let files = filesFound.get(`${interaction.id}`)
    ? filesFound.get(`${interaction.id}`)
    : [];
  files.push(newFile);
  filesFound.set(`${interaction.id}`, files);
};
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
async function saveMessageBatch(message, batch_id, interaction) {
  if (!message || !interaction || !batch_id) return;
  // create the attachments array and metadata object
  console.log(`the message is`, message);
  console.log(`the message.attachments`, message.attachments);
  console.log(`the message attachments`, message.attachments.name);
  let attachments = [];
  let metadata = {};
  console.log(
    `saving the message with [ ${message.attachments.name} ] to the database`
  );
  console.log(`the message attachments`, message.attachments.name);
  // for every attachment create an attachment object and push it to the attachments array
  let attachment_array = [...message.attachments.values()];
  for (let attachment_ of attachment_array) {
    console.log(`the attachment_`, attachment_);
    let attachment = {
      file_name: attachment_.name,
      file_size: `${attachment_.size / 1000000} Mb`,
      file_url: attachment_.url,
      file_type: attachment_.contentType,
      file_extension: attachment_.name.split(".").pop(),
      file_id: attachment_.id,
      file_batch_id: batch_id,
    };
    attachments.push(attachment);
  }
  // create the metadata object
  metadata = {
    from_user_name: message.author.username,
    from_user_id: message.author.id,
    from_channel_name: message.channel.name,
    from_channel_id: message.channel.id,
    from_guild_name: message.guild.name,
    from_guild_id: message.guild.id,
    from_guild_icon: message.guild.iconURL(),
    posted_at: message.createdAt,
    message_id: message.id,
    message_content: message.content,
    message_batch_id: batch_id,
    who_ran_command: interaction.user.username,
    who_ran_command_id: interaction.user.id,
    who_ran_command_avatar: interaction.user.avatarURL(),
  };
  let obj = {
    _id: `${new mongoose.Types.ObjectId()}`,
    attachments: attachments,
    metadata: metadata,
    batch_id: batch_id,
  };
  console.log(`The obj:`, obj);
  await fetchedFiles.create(obj);
  console.log(`--------------------------`);
  for (i = 0; i < obj.attachments.length; i++) {
    console.log(obj.attachments[i].file_name);
  }
  console.log(`^saved to the database^`);
}

function batchArray(arr, size) {
  let batchedArray = [];
  for (let i = 0; i < arr.length; i += size) {
    batchedArray.push(arr.slice(i, i + size));
  }
  return batchedArray;
}
let fileList = (arrayOfFiles) => {
  let list = "";
  console.log(`the arrayOfFiles`, arrayOfFiles);
  console.log(`the file 1`, arrayOfFiles[0]);
  // if array is 24 or greater set the array to the first 24 and replace the 25th with a string
  if (arrayOfFiles.length >= 24) {
    arrayOfFiles = arrayOfFiles.slice(0, 24);
    if (typeof arrayOfFiles[0] === "string") {
      arrayOfFiles.push(`...and more but they could not fit here`);
    } else {
      arrayOfFiles.push({ name: `...and more but they could not fit here` });
    }
  }
  for (let file of arrayOfFiles) {
    if (typeof file === "string") {
      list += `- ${file}\n`;
    } else {
      list += `- ${file.name}\n`;
    }
  }
  return list;
};

const attachments_ = new Collection();
let batchAttachments = (batch_id) => {
  return attachments_.get(batch_id);
};
let addAttachment_ = (attachmentObj, batch_id) => {
  let array = batchAttachments(batch_id) ? batchAttachments(batch_id) : [];
  array.push(attachmentObj);
  attachments_.set(batch_id, array);
  console.log(
    `added an attachment to the batch array --the attachments_ :`,
    attachments_
  );
};

let getMessageAttachments = async (targetChannel, interaction, batch_id) => {
  await sendLoad2(interaction);
  let before = b4(interaction);
  let messages = await targetChannel.messages.fetch({
    before: before ? before : null,
  }); // collection of messages
  console.log(`the messages`, messages);
  let lastMessage = messages.last();
  console.log(`the last message`, lastMessage);

  // if there are no results from the fetch, return the filesFound array
  if (messages.size === 0) {
    console.log(`messages found in channel is 0`);

    return filesFoundArray(interaction);
  }
  let lastMessageID = messages.last().id;
  console.log(`the last message id`, lastMessageID);
  // get the last message id from the messages collection and send it to the b4 function
  setBefore(lastMessageID, interaction);
  console.log(`the before was reset`);

  // filter out all the messages that do not have attachments
  let messagesWithAttachments = messages.filter((message) => {
    console.log(`the message`, message);
    console.log(`message found`);
    let theAttachments = [...message.attachments.values()];
    console.log(`theAttachments`, theAttachments);
    let numOfNumMessagesWAttachments = 0;
    for (let attachment of theAttachments) {
      if (attachment.contentType === "audio/mpeg") {
        addAttachment_(attachment, batch_id);
        setFilesFoundArray(interaction, attachment);
        console.log(`the attachments_`, attachments_);
        numOfNumMessagesWAttachments = theAttachments.length;
        console.log(
          `numOfNumMessagesWAttachments`,
          numOfNumMessagesWAttachments
        );
      }
    }

    if (numOfNumMessagesWAttachments > 0) {
      return true;
    }
  }); // now the values of the messages collection are filtered to only include messages with attachments
  // if there are no messages with attachments, run the funciton again after a 10 second delay with the new before id
  console.log(`messages with attachments`, messagesWithAttachments);
  let numOfNumMessagesWAttachments = Array.from(messagesWithAttachments);
  console.log(`numOfNumMessagesWAttachments`, numOfNumMessagesWAttachments);
  console.log(
    `numOfNumMessagesWAttachments length`,
    numOfNumMessagesWAttachments.length
  );

  if (numOfNumMessagesWAttachments.length === 0) {
    console.log(`messages with attachments found in channel is 0`);
    await loadCooldown(interaction);
    return getMessageAttachments(targetChannel, interaction, batch_id);
  }
  // if there are messages with attachments, loop through the messages and save the attachments to the database
  else {
    let messagesWithAttachments_array = [...messagesWithAttachments.values()];
    console.log(
      `the messages with attachments array`,
      messagesWithAttachments_array
    );
    for (let message of messagesWithAttachments_array) {
      for (let attachment of message.attachments) {
        let attachmentName = attachment[1].name;
        console.log(`the attachment name`, attachmentName);

        // save the message that has the attachment to the database
        await saveMessageBatch(message, batch_id, interaction);
      }
    }
    let messages = await targetChannel.messages.fetch({
      before: b4(interaction),
    });
    if (messages) {
      await loadCooldown(interaction);
      return getMessageAttachments(targetChannel, interaction, batch_id);
    } else {
      return filesFoundArray(interaction);
    }
  }
};

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

async function gatherChannelFiles(interaction) {
  let content;
  await interaction.deferReply({ ephemeral: true });
  await sendLoad1(interaction);
  // create unique batch id
  // // batch_id will be a unique id compiled from the current date and time
  let batch_id = getBatchId();
  const originChannelID = interaction.channel.id;
  const targetChannel = await interaction.guild.channels.fetch(originChannelID);
  const targetChannelID = targetChannel.id;
  const lastMessages = await targetChannel.messages.fetch({ limit: 1 });
  let lastMessage = lastMessages.first();
  let lastMessageID;
  if (lastMessage) {
    lastMessageID = lastMessage.id;
  }
  // create a function that goes through and fetches every message in the channel and only returns the messages that have attachments
  let arrayOfFiles = await getMessageAttachments(
    targetChannel,
    interaction,
    batch_id
  );
  // send the files to the user who ran the command in a neat embed
  // if there are no files, send a message saying "No files found"
  console.log(arrayOfFiles);
  if (arrayOfFiles === undefined) {
    content = "No files found";
    await interaction.editReply({
      embeds: [createEmb.createEmbed({ title: content })],
    });
    return;
  }
  // if there are files, send a message with a list of all the files that were sent and the total number of files sent in a neat embed, the list of files will reside in description and the total number of files sent will be in the title.
  else {
    let totalNum = arrayOfFiles.length;
    let description = fileList(arrayOfFiles);
    let title = `Total Files Saved: ${totalNum}`;
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: title,
          description: description,
          color: scripts.getColor(),
        }),
      ],
    });
    let docs = await scripts_mongoDB.getBatch(batch_id);
    console.log(docs);
    console.log(docs.length);
    let files = docs.map((doc) => {
      return doc.attachments;
    });
    // send files individually HERE
    // for every file in the files array, send it to the user who ran the command
    content = `Still Processing...`;
    description = `Total Files Saved: ${totalNum}`;
    embed = createEmb.createEmbed({
      title: content,
      description: description,
      color: scripts.getSuccessColor(),
    });
    await interaction.editReply({
      embeds: [embed],
      ephemeral: true,
    });
    let allFiles = [];
    for (let file of files) {
      // filter to only audio files
      let fileArray = file;
      console.log(`the file array`, fileArray);

      for (let file of fileArray) {
        if (
          ["mp3", "wav", "ogg", "m4a", "flac"].includes(file.file_extension)
        ) {
          title = `✅ File Archive Complete!`;
          content = `So Far I've Saved \`${
            filesFoundArray(interaction).length
          }\` ${
            filesFoundArray(interaction).length === 1 ? `File` : `Files`
          } from the ${targetChannel.name} channel in the ${
            interaction.guild.name
          } Server\n\nAll the files that we found are being downloaded and processed\n**It takes approx. 1 min per 12 files to complete the dm proccess**\n\n\`${
            Math.round((filesFoundArray(interaction).length / 12) * 100) /
              100 <=
            1
              ? `less than 1 minute`
              : (Math.round((filesFoundArray(interaction).length / 12) * 100) /
                  100)`minutes`
          } estimated\``;
          description = `**Files Saved:**\n${fileList(
            filesFoundArray(interaction)
          )}`;
          console.log(`the content`, content);

          embed = createEmb.createEmbed({
            title: content,
            description: description,
            color: scripts.getSuccessColor(),
          });
          try {
            await interaction.editReply({
              embeds: [embed],
              ephemeral: true,
            });
          } catch (error) {
            console.log(`error editing last reply`, error);
          }
          // add the attachments name to the filesFound array
          // setFilesFoundArray(interaction.id, file);
          // console.log(`updated the files found array`, filesFoundArray(interaction))
          let currentFileName = file.file_name;
          // check to see of any files in allFiles have a file.file_name === currentFileName
          // if they do, add a number to the end of the file name
          // if they don't, add the file to allFiles
          let allFilesNames = [];
          if (allFiles.length > 0) {
            allFilesNames = allFiles.map((file) => {
              return file.file_name;
            });
            console.log(`all files names`, allFilesNames);
          }
          console.log(`current file name`, currentFileName);

          if (!allFilesNames.includes(currentFileName)) {
            console.log(`all files`, allFiles);
            console.log(`the file`, file);
            allFiles.push(file);

            console.log(`the file`, file);

            let url = file.file_url;
            let name = file.file_name;
            let size = file.file_size;

            // console.log(url, name, size)
            console.log(`the file`, file);
            let fileToSend = new AttachmentBuilder(url, {
              name: name,
              description: size,
            });
            // extract the number from the file size string
            let sizeNum = size.split(" ")[0];
            console.log(`the size num`, sizeNum);
            // if the file is under 8 Mb, send it as a file

            // V2
            //  Here all files are sent indiviually, later in the code they are sent in batches of 10 or less so I don't need this here any more
            if (sizeNum < 8) {
              console.log(`SENT INDIVIDUALLY`);
              title = `✅ File Archive Complete!`;
              content = `File: \`${name}\``;
              description = `Size: \`${size}\``;
              console.log(`the content`, content);

              embed = createEmb.createEmbed({
                title: content,
                description: description,
                color: scripts.getColor(),
              });
              try {
                await interaction.user.send({content:`||${name}||`, embeds: [embed], files: [fileToSend] });
                // delay for 3.33 seconds
                await scripts.delay(3333);
              } catch (error) {
                console.log(`Failed to send link for ${name}`, error);
              }
            }
            // if the file is over 8 Mb, send it as a link button
            else {
              console.log(`the url`, url);
              let row = await createActRow.createActionRow({
                components: [
                  await createBtn.createButton({
                    style: "link",
                    label: name,
                    link: url,
                  }),
                ],
              });

              let embed = createEmb.createEmbed({
                title: "File too large to send as a file",
                description: `File Name: \`${name}\`\nFile Size: \`${size}\``,
                color: scripts.getColor(),
              });

              try {
                await interaction.user.send({
                  content:`||${name}||`,
                  embeds: [embed],
                  components: [row],
                });
                // delay for 3.33 seconds
                await scripts.delay(3333);
              } catch (error) {
                console.log(`Failed to send link for ${name}`, error);
              }
            }
            //**/
          }
        }
      }
    }

    console.log(`targetChannel`, targetChannel);

    content = `✅ All files from ${targetChannel.name} have been sent to your DMs!`;

    try {
      await interaction.user.send({
        embeds: [
          createEmb.createEmbed({
            title: content,
            color: scripts.getSuccessColor(),
          }),
        ],
      });
    } catch (error) {
      console.log(
        `____ ----- ____ --- error sending embed to user ____ ----- ____ ---`,
        error
      );
    }
    // edit the original message embed to say "{relevant channel} File Archive Complete!"
    title = `✅ File Archive Complete!`;
    content = `Saved \`${filesFoundArray(interaction).length}\` ${
      filesFoundArray(interaction).length === 1 ? `File` : `Files`
    } from the ${targetChannel.name} channel in the ${
      interaction.guild.name
    } Server\n\nAll the files that we found have been sent to you in dms :wink:`;
    description = `**Files Saved:**\n${fileList(filesFoundArray(interaction))}`;
    console.log(`the content`, content);

    embed = createEmb.createEmbed({
      title: content,
      description: description,
      color: scripts.getSuccessColor(),
    });
    try {
      await interaction.editReply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (error) {
      console.log(`error editing last reply`, error);
    }
    // await scripts.delay(9990);
    // await interaction.deleteReply();
    return;
  }
}