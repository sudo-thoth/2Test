const groupbuys = require("../../../MongoDB/db/schemas/schema_groupbuys.js");
const createEmb = require("../create/createEmbed.js");
const createModal = require("../create/createModal.js");
const scripts = require("../scripts/scripts.js");
const createBtn = require("../create/createButton.js");
const createActRow = require("../create/createActionRow.js");


// here I will create function variables to retrieve current groupbuy statistics from the database

// function to retrieve the current number of groupbuys in the database
async function getGroupbuyCount() {
    let count = await groupbuys.countDocuments();
    return count;
}
// function to retrieve all groupbuys created by a specific user
async function getGroupbuysByUser(userID) {
    let groupbuys = await groupbuys.find({ "user.id": userID });
    return groupbuys;
}
// function to retrieve all groupbuys created by a specific user in a specific guild
async function getGroupbuysByUserAndGuild(userID, guildID) {
    let groupbuys = await groupbuys.find({ "user.id": userID, "guild.id": guildID });
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
    await groupbuys.updateOne({ _id: groupbuyID }, { $set: { amountPaid: groupbuy.amountPaid } });
    await refreshUpdate(groupbuyID);
}
// function to get all the current groupbuy stats and then update the message with the new stats
async function updateGroupbuyMessage(groupbuyID) {
    let groupbuy = await groupbuys.findById(groupbuyID);
    // fetch the channel where the message is sent
    let channel = await client.channels.fetch(groupbuy.channel.id);
    // fetch the message where the groupbuy is sent
    let message = await channel.messages.fetch(groupbuy.message.id);

    // get the groupbuy's title
    let title = groupbuy.message.embeds[0].title;
    // get the groupbuy's description
    let description = groupbuy.message.embeds[0].description;
    // get the groupbuy's fields
    let fields = groupbuy.message.embeds[0].fields;
    // get the groupbuy's footer
    let footer = groupbuy.message.embeds[0].footer;
    // get the groupbuy's author
    let author = groupbuy.message.embeds[0].author;
    // get the groupbuy's color


    // update the message with the new stats
try {
        await message.edit({embeds: [createEmb.createEmbed({
            title: title,
            description: description,
            fields: fields,
            color: scripts.getColor(),
        })],
        })
} catch (error) {
    console.log(`error trying to group buy ${title} in ${groupbuy.guild.name} at ${new Date()}`)
    console.log(error)
    
}

}
// function to get the groupbuy's total cost
async function getTotalCost(groupbuyID) {
    let groupbuy = await groupbuys.findById(groupbuyID);
    return groupbuy.totalCost;
}
// function to get the amount left to pay for a specific groupbuy
async function getAmountLeft(groupbuyID) {
    let amountLeft = getTotalCost(groupbuyID) - getAmountPaid(groupbuyID);
    return amountLeft;
}
// function to get the amount of time that has passed since the groupbuy was created
async function getTimePassed(groupbuyID) {
    let groupbuy = await groupbuys.findById(groupbuyID);
let timePassed = Date.now() - groupbuy.timeCreated;
    return timePassed;
}
// function to get the amount of time its been since the last update
async function getTimeSinceLastUpdate(messageID) {
    let groupbuy = await groupbuys.findById(messageID);
    let lastUpdate = groupbuy.timeLastUpdate;
    const pastMoment = moment(lastUpdate);
    const presentMoment = moment();
    let timeSinceLastUpdate = presentMoment.diff(pastMoment);
    var timeElapsedFormatted = moment.duration(timeElapsed).format('ddd hh:mm:ss');
    return timeElapsedFormatted;
}
// function to reset the time since last update
async function refreshUpdate(messageID) {
    let groupbuy = await groupbuys.findOne({messageID: messageID});
    groupbuy.timeLastUpdate = Date.now();
  try {
      await groupbuys.updateOne({ messageID: messageID }, { $set: { timeLastUpdate: groupbuy.timeLastUpdate } });
  } catch (error) {
        console.log(`error trying to refresh update for group buy ${groupbuy.title} in ${groupbuy.guild.name} at ${new Date()}`)
        console.log(error)
        
    
  }
}

// function to get the groupbuy's message id
async function getGroupbuyMessageID(groupbuyID) {
    let groupbuy = await groupbuys.findById(groupbuyID);
    return groupbuy.message.id;
}

function getMessageObj(interaction){
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
                const componentActionRowComponentType = componentActionRowComponent.type;
                switch (componentActionRowComponentType) {
                  case "Button":
                    const componentActionRowComponentButton = componentActionRowComponent;
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
                    const componentActionRowComponentSelectMenu = componentActionRowComponent;
                    selectMenus.push({
                      customId: componentActionRowComponentSelectMenu.customId,
                      placeholder: componentActionRowComponentSelectMenu.placeholder,
                      minValues: componentActionRowComponentSelectMenu.minValues,
                      maxValues: componentActionRowComponentSelectMenu.maxValues,
                      disabled: componentActionRowComponentSelectMenu.disabled,
                      type: componentActionRowComponentSelectMenu.type,
                      options: {
                        label: componentActionRowComponentSelectMenu.options.label,
                        value: componentActionRowComponentSelectMenu.options.value,
                        description: componentActionRowComponentSelectMenu.options.description,
                        emoji: componentActionRowComponentSelectMenu.options.emoji,
                        default: componentActionRowComponentSelectMenu.options.default,
                      }
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
                      }
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
      const messageEmbedsArray =  message.embeds;
      for (const messageEmbed of messageEmbedsArray) {
        const embedObj = {
          title: messageEmbed.title,
          description: messageEmbed.description,
          url: messageEmbed.url,
          timestamp: messageEmbed.timestamp,
          color: messageEmbed.color,
          hexColor: messageEmbed.hexColor,
          footer: {
            text: messageEmbed.footer? messageEmbed.footer.text : '',
            iconURL: messageEmbed.footer? messageEmbed.footer.iconURL : '',
            proxyIconURL: messageEmbed.footer? messageEmbed.footer.proxyIconURL : '',
          },
          image: {
            url: messageEmbed.image? messageEmbed.image.url : '',
            proxyURL: messageEmbed.image? messageEmbed.image.proxyURL : '',
            height: messageEmbed.image? messageEmbed.image.height : '',
            width: messageEmbed.image? messageEmbed.image.width : '',
          },
          thumbnail: {
            url: messageEmbed.thumbnail? messageEmbed.thumbnail.url : '',
            proxyURL: messageEmbed.thumbnail? messageEmbed.thumbnail.proxyURL : '',
            height: messageEmbed.thumbnail? messageEmbed.thumbnail.height : '',
            width: messageEmbed.thumbnail? messageEmbed.thumbnail.width : '',
          },
          video: {
            url: messageEmbed.video? messageEmbed.video.url : '',
            height: messageEmbed.video? messageEmbed.video.height : '',
            width: messageEmbed.video? messageEmbed.video.width : '',
          },
          provider: {
            name: messageEmbed.provider? messageEmbed.provider.name : '',
            url: messageEmbed.provider? messageEmbed.provider.url : '',
            iconURL: messageEmbed.provider? messageEmbed.provider.iconURL : '',
            proxyIconURL: messageEmbed.provider? messageEmbed.provider.proxyIconURL : '',
          },
          author: {
            name: messageAuthorUsername,
            icon_url: messageAuthorAvatar,
            discriminator: messageAuthorDiscriminator,
            id: messageAuthorId,
            flags: messageAuthorflags,
            bot: false,
          },
}
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
        const messageReactionUsersArray = [...messageReactionUsersCollection.values()];
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
        }
       }

       console.log(messageObject);
       
       return messageObject;

}









module.exports = {getGroupbuyCount, getGroupbuysByUser, getGroupbuysByUserAndGuild, getGroupbuysByGuild, getAmountPaid, addAmountPaid, updateGroupbuyMessage, getTotalCost, getAmountLeft, getTimePassed, getTimeSinceLastUpdate, refreshUpdate, getGroupbuyMessageID, getMessageObj};