const client = require(`../../index.js`);
const channelsDB = require(`../../../MongoDB/db/schemas/schema_channels.js`);
const scripts = require("../../functions/scripts/scripts.js");

async function saveDeletedMessage(message) {
    // get current channel deleted messages array from db
    let currentChannelData = await client.setupChannel(message.channel.id); 

    
    // get current user deleted messages array from db
    let channelsDelMessages = currentChannelData?.deletedMessages || [];
    

    // if there is already a message within the channelsDelMessages array with the same message id as the deleted message, return
    if (channelsDelMessages.some((obj) => obj.message.messageID === message.id)) {
        return;
    } 
    // figure out who deleted the message
    
    let actionUserId = message.author.id;
    let actionUsername = message.author.username;

    // let messageObj = {
    //   messageAuthor: {
    //             userID: message.author.id,
    //             username: message.author.username,
    //         },
    //         messageID: message.id,
    //         channelID: message.channel.id,
    //         serverID: message.guild.id,
    //         content: message.content,
    //         timestamp: message.createdTimestamp,
    //         createdAt: message.createdAt,
    //         deletedAt: message.deletedAt,
    //         deletedTimestamp: message.deletedTimestamp,
    //         hasEmbed: message.embeds.length > 0,
    //         embeds: [],
    //         attachments: [],
    //     deletedBy: {
    //         userID: actionUserId,
    //         username: actionUsername,
    //     },
    //     loggedAt: `${new Date(Date.now())}`,
    //     loggedTimestamp: Date.now(),
    // }

    let messageObj = {
      messageID: message.id,
        serverID: message.guild.id,
        channelID: message.channel.id,
        serverName: message.guild.name,
        channelName: message.channel.name,
      message: {
          user: {
              userID: message.author.id,
              username: message.author.username,
          },
          messageID: message.id,
          channelID: message.channel.id,
          serverID: message.guild.id,
          content: message.content,
          timestamp: message.createdTimestamp,
          createdAt: `${message.createdAt}`,
          deletedAt: `${message.deletedAt}`,
          deletedTimestamp: message.deletedTimestamp,
          hasEmbed: message.embeds.length > 0,
          embeds: [],
          attachments: [],
      }, 
      deletedBy: {
        userID: actionUserId,
        username: actionUsername
      },
      messageAuthor: {
        userID: message.author.id,
        username: message.author.username
      },
      loggedAt: `${new Date(Date.now())}`,
        loggedTimestamp: Date.now(),
  }
    // construct the embeds and attachments objs and push to arrays

    //embeds
    if(message?.embeds?.length > 0){
      let index = 0;
        for (let embed of message.embeds){
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
        
        messageObj.embeds.push(dbEmbed)

        // extract the fields from the embed
        if(embed?.fields?.length > 0){
          
            for (let field of embed.fields){
                let dbField = {
                    name: field.name,
                    value: field.value,
                    inline: field.inline,
                }
                messageObj.embeds[index].fields.push(dbField)
                index++;
            }
        }
        
        
    }   
}

    // attachments
    if(message?.attachments?.length > 0){
        for (let attachment of message.attachments){
            let dbAttachment = {
                name: attachment.name,
                url: attachment.url,
                size: attachment.size,
                contentType: attachment.contentType,
            }
            messageObj.attachments.push(dbAttachment)
        }
    }


    // push the snipe to the front of the userSnipes array 

    channelsDelMessages.unshift(messageObj);


    try {
        await channelsDB.findOneAndUpdate(
            {
                channelID: message.channel.id,
                serverID: message.guild.id,
            },
            {
                $set: {
                    deletedMessages: channelsDelMessages,
                }
            }
        )
        console.log(`message data saved to db`);
        return true;
    } catch (error) {
        console.log(`an error occurred while trying to save the message data to the database: `, error);
        return false;
    }

  }
    


  client.on('guildAuditLogEntryCreate', async (auditLogEntry, guild) => {
    // Ignore messages from bots
    if (!(auditLogEntry.targetType === "Message" && auditLogEntry.actionType === "Delete" )) {
      return;
    }
console.log(auditLogEntry)
let deletedByID = auditLogEntry?.executor?.id;
let deletedByUsername = auditLogEntry?.executor?.username;
let deletedBy = {
  userID: deletedByID,
  username: deletedByUsername,
}
let channelID = auditLogEntry?.extra?.channel?.id;
let channel = await client.channels.fetch(channelID);
let data;
try {
  await scripts.delay(5000);
  data = await client.setupChannel(channel);
} catch (error) {
  console.log(`an error occurred while trying to get the data from the database: `, error);
}
// if data not found wait 3 seconds and try again and do that until data is found
let msgExists = false;
if(data) {
  
  let deletedMessages = data?.deletedMessages;
  // check if some messageObj.messageID within the deletedMessages array has the same messageID as the auditLogEntry.target.id

  if (deletedMessages.some((obj) => obj.message.messageID === auditLogEntry.target.id)) {
    msgExists = true;
  }
  let count = 0;
while (!msgExists && count < 5){
  count++;
  setTimeout(async () => {
    try {
      data = await client.getChannel(channel);
    } catch (error) {
      console.log(`an error occurred while trying to get the data from the database: `, error);
    }

     deletedMessages = data?.deletedMessages;
  // check if some messageObj.messageID within the deletedMessages array has the same messageID as the auditLogEntry.target.id

  if (deletedMessages.some((obj) => obj.message.messageID === auditLogEntry.target.id)) {
    msgExists = true;
  }
    
  }, 3000);
}
if (count === 5){
  console.log(`message not found in database`);
  return;
}

if (msgExists){
  // update the message in the db and update the deletedBy property

  deletedMessages = data?.deletedMessages;

  let messageObj = deletedMessages.find((obj) => obj.message.messageID === auditLogEntry.target.id);

  // find the index of the messageObj in the deletedMessages array
  let index = deletedMessages.findIndex((obj) => obj.message.messageID === auditLogEntry.target.id);

  messageObj.deletedBy = deletedBy;

  // update the deletedMessages[index] msg obj as the messageObj in the database
  
  deletedMessages[index] = messageObj;

  try {
    await channelsDB.findOneAndUpdate(
        {
            channelID: channel.id,
            serverID: guild.id,
        },
        {
            $set: {
                deletedMessages: deletedMessages,
            }
        }
    )
    console.log(`message data saved to db`);
    return true;
} catch (error) {
    console.log(`an error occurred while trying to save the message data to the database: `, error);
    return false;
}

}
} else {
  console.log(`data not found in database`);
  try {
    return await client?.devs?.LT?.send(`Error saving deleted message: ${message.id}\n Channel: ${message.channel.id}\n Server: ${message.guild.id}\n Author: ${message.author.id}\n Content: ${message.content}\n Timestamp: ${message.createdTimestamp}\nDate: ${message.createdAt}\n`);
} catch (error) {
    return console.log(error)
}
}
  });



client.on('messageDelete', async (message) => {
    // Ignore messages from bots
    if (message.author.bot) {
      return;
    }


  
    let res;
    try {
      res = await saveDeletedMessage(message);
      console.log(`Deleted message saved: ${message.id}`);
    } catch (error) {
      console.error(`Error saving deleted message: ${message.id}`, error);
    }

    if (res){
        console.log(`Saved deleted message: ${message.id}`);
    } else {
        try {
            await client?.devs?.LT?.send(`Error saving deleted message: ${message.id}\n Channel: ${message.channel.id}\n Server: ${message.guild.id}\n Author: ${message.author.id}\n Content: ${message.content}\n Timestamp: ${message.createdTimestamp}\nDate: ${message.createdAt}\n`);
        } catch (error) {
            console.log(error)
        }
    }
  });