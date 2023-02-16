const mongoose = require('mongoose');
const interactionModel = require("../../../MongoDB/db/schemas/schema_interaction.js");




async function saveInteraction(interaction) {
    console.log(`SAVING INTERACTION DATA`)

    if (!interaction) return;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Interaction Properties
    const interactionCommandName = interaction.commandName;
    const interactionCommandOptions = interaction.options;
    const interactionCommandId = interaction.commandId;
    const interactionCommandType = interaction.commandType;
    const interactionCommandDeferred = interaction.deferred;
    const interactionCommandDescription = interaction.commandDescription;
    const interactionCommandReplied = interaction.replied;
    const interactionCommandEphemeral = interaction.ephemeral;
    const interactionCommandOptionsArray = [];
    interactionCommandOptions.forEach((option) => {
      const interactionCommandOptionsObject = {
        name: option.name,
        value: option.value,
        type: option.type,
        default: option.default,
        description: option.description,
        required: option.required,
        choices: option.choices,
        autocomplete: option.autocomplete,
        minValue: option.minValue,
        maxValue: option.maxValue,
        minLength: option.minLength,
        maxLength: option.maxLength,

      }
      if (option.options){
        interactionCommandOptionsObject.options = {
          name: option.options.name,
          value: option.options.value,
          type: option.options.type,
          default: option.options.default,
          description: option.options.description,
          required: option.options.required,
          choices: option.options.choices,
          autocomplete: option.options.autocomplete,
          minValue: option.options.minValue,
          maxValue: option.options.maxValue,
          minLength: option.options.minLength,
          maxLength: option.options.maxLength,          
        }
      }

      if (options.channelTypes){
        interactionCommandOptionsObject.channelTypes = {
          name: option.channelTypes.name,
          value: option.channelTypes.value,
          type: option.channelTypes.type,
          default: option.channelTypes.default,
          description: option.channelTypes.description,
          required: option.channelTypes.required,
          choices: option.channelTypes.choices,
          autocomplete: option.channelTypes.autocomplete,
          minValue: option.channelTypes.minValue,
          maxValue: option.channelTypes.maxValue,
          minLength: option.channelTypes.minLength,
          maxLength: option.channelTypes.maxLength,          
        }
      }
      interactionCommandOptionsArray.push(interactionCommandOptionsObject);
    });

    const interactionId = interaction.id;
    const interactionType = interaction.type;
    const interactionToken = interaction.token;
    const interactionChannelId = interaction.channelId;
    const interactionChannelType = interaction.channel.type;
    const interactionChannelName = interaction.channel.name;
    const interactionChannelURL = interaction.channel.url;
    const interactionUserBot = interaction.user.bot;
    const interactionUserSystem = interaction.user.system;
    const interactionTimestamp = interaction.createdTimestamp;
    const interactionDate = new Date(interactionTimeStamp); // a string  "Day Month Date Hours:Minutes:Seconds GMT Year". For example, "Sun Aug 04 15:30:00 GMT 2019"
    const interactionOptions = interactionCommandOptionsArray;
    const interactionUserId = interaction.user.id;
    const interactionUserAvatar = interaction.user.avatar;
    const interactionUserUsername = interaction.user.username;
    const interactionUserDiscriminator = interaction.user.discriminator;
    const interactionUserTag = interaction.user.tag;
    const interactionGuildId = interaction.guildId;
    const interactionGuildName = interaction.guild.name;
    const interactionGuildIcon = interaction.guild.icon;
    const interactionGuildURL = interaction.guild.url;
    const interactionGuildOwnerUsername = interaction.guild.owner.user.username;
    const interactionGuildOwnerDiscriminator = interaction.guild.owner.user.discriminator;
    const interactionGuildOwnerAvatar = interaction.guild.owner.user.avatar;
    const interactionGuildOwnerID = interaction.guild.owner.user.id;
    const interactionMemberNickname = interaction.member.nickname;
    const interactionMemberRoles = interaction.member.roles.cache;
    const interactionUserDMChannel = interaction.user.dmChannel;
    const interactionUserDMChannelID = interaction.user.dmChannel.id;
    const interactionUserDMChannelType = interaction.user.dmChannel.type;
    const interactionUserDMChannelURL = interaction.user.dmChannel.url;
    const interactionUserDMChannelLastMessageID = interaction.user.dmChannel.lastMessageId;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Message Properties

    const messageId = interaction.message.id;
    const messageType = interaction.message.type;
    const messageChannelId = interaction.message.channelId;
    const messageTimeStamp = interaction.message.createdTimestamp;
    const messageDate = new Date(messageTimeStamp); // a string  "Day Month Date Hours:Minutes:Seconds GMT Year". For example, "Sun Aug 04 15:30:00 GMT 2019"
    const messageContent = interaction.message.content;
    const messageDeletable = interaction.message.deletable;
    const messageEditable = interaction.message.editable;
    const messageEditedAt = interaction.message.editedAt;
    const messageURL = interaction.message.url;
    const messageTimestamp = interaction.message.createdTimestamp;
    const messageAuthorId = interaction.message.author.id;
    const messageAuthorAvatar = interaction.message.author.avatar;
    const messageAuthorUsername = interaction.message.author.username;
    const messageAuthorDiscriminator = interaction.message.author.discriminator;
    const messageAuthorDMChannelId = interaction.message.author.dmChannel.id;
    const messageAuthorDMChannelURL = interaction.message.author.dmChannel.url;
    const messageAuthorDMChannelLastMessageId = interaction.message.author.dmChannel.lastMessageId;
    const messageAuthorflags = interaction.message.author.flags;
    const messageGuildId = interaction.message.guildId;
    const messageGuildName = interaction.message.guild.name;
    const messageGuildIcon = interaction.message.guild.icon;
    const messageGuildURL = interaction.message.guild.url;
    const messageButtons = [];
    const messageSelectMenus = [];
    if (interaction.message.components) {
      const messageComponents = interaction.message.components;
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
if (interaction.message.attachments) {
      const messageAttachmentsCollection = interaction.message.attachments;
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
    if (interaction.message.embeds) {
      const messageEmbedsArray =  interaction.message.embeds;
      for (const messageEmbed of messageEmbedsArray) {
        const embedObj = {
          title: messageEmbed.title,
          description: messageEmbed.description,
          url: messageEmbed.url,
          timestamp: messageEmbed.timestamp,
          color: messageEmbed.color,
          hexColor: messageEmbed.hexColor,
          footer: {
            text: messageEmbed.footer.text,
            iconURL: messageEmbed.footer.iconURL,
            proxyIconURL: messageEmbed.footer.proxyIconURL,
          },
          image: {
            url: messageEmbed.image.url,
            proxyURL: messageEmbed.image.proxyURL,
            height: messageEmbed.image.height,
            width: messageEmbed.image.width,
          },
          thumbnail: {
            url: messageEmbed.thumbnail.url,
            proxyURL: messageEmbed.thumbnail.proxyURL,
            height: messageEmbed.thumbnail.height,
            width: messageEmbed.thumbnail.width,
          },
          video: {
            url: messageEmbed.video.url,
            height: messageEmbed.video.height,
            width: messageEmbed.video.width,
          },
          provider: {
            name: messageEmbed.provider.name,
            url: messageEmbed.provider.url,
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
    if (interaction.message.reactions.cache) {
      const messageReactionsCollection = interaction.message.reactions.cache;
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
    if (interaction.message.components) {
      const messageComponentsArray = interaction.message.components;
      for (const message of messageComponentsArray) {
        messageComponents.push({
          type: message.type,
          components: message.components,
        });
      }
    }
    const messageFlags = [];
    if (interaction.message.flags) {
      const messageFlagsArray = interaction.message.flags;
      for (const messageFlag of messageFlagsArray) {
        messageFlags.push({
          bitfield: messageFlag.bitfield,
          serialize: messageFlag.serialize(),
        });
      }
    }
    const messageStickers = [];
    if (interaction.message.stickers) {
      const messageStickersArray = interaction.message.stickers;
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
      messageID: interaction.message.reference.messageID,
      channelID: interaction.message.reference.channelID,
      guildID: interaction.message.reference.guildID,
    };

    const messageActivity = {
      partyID: interaction.message.activity.partyID,
      type: interaction.message.activity.type,
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // construct the object using the variables that were just defined that will be saved to the database

    const interactionObj = {
        _id: `${new mongoose.Types.ObjectId()}`,
      id: interactionId,
      type: interactionType,
      token: interactionToken,
      options: interactionOptions,
      command: {
        id: interactionCommandId,
        name: interactionCommandName,
        description: interactionCommandDescription,
        type: interactionCommandType,
        options: interactionCommandOptions,
        deferred: interactionCommandDeferred,
        replied: interactionCommandReplied,
        ephemeral: interactionCommandEphemeral,
      },
      channel: {
        id: interactionChannelId,
        type: interactionChannelType,
        name: interactionChannelName,
        url: interactionChannelURL,
      },
      guild: {
        id: interactionGuildId,
        name: interactionGuildName,
        icon: interactionGuildIcon,
        url: interactionGuildURL,
        owner: {
          id: interactionGuildOwnerID,
          username: interactionGuildOwnerUsername,
          discriminator: interactionGuildOwnerDiscriminator,
          avatar: interactionGuildOwnerAvatar,          
        }
      },
      member: {
        nickname: interactionMemberNickname,
        roles: interactionMemberRoles,
      },
      timestamp: interactionTimestamp,
      date: interactionDate,
      user: {
        id: interactionUserId,
        username: interactionUserUsername,
        discriminator: interactionUserDiscriminator,
        avatar: interactionUserAvatar,
        bot: interactionUserBot,
        system: interactionUserSystem,
        dmChannel: {
          channel: interactionUserDMChannel,
          id: interactionUserDMChannelID,
        url: interactionUserDMChannelURL,
        lastMessageId: interactionUserDMChannelLastMessageID,
        type: interactionUserDMChannelType,
      },
        tag: interactionUserTag,
      },
      message: {
        id: messageId,
        type: messageType,
        content: messageContent,
        timestamp: messageTimestamp,
        date: messageDate,
        channelID: messageChannelId,
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
        attachments: messageAttachments,
        embeds: messageEmbeds,
        reactions: messageReactions,
        components: {
            buttons: messageButtons,
            selectMenus: messageSelectMenus,
        },
        reactions: messageReactions,
        stickers: messageStickers,
        author: {
          id: messageAuthorId,
          username: messageAuthorUsername,
          discriminator: messageAuthorDiscriminator,
          avatar: messageAuthorAvatar,
          flags: messageAuthorflags,
          dmChannel: {
            id: messageAuthorDMChannelId,
          url: messageAuthorDMChannelURL,
          lastMessageId: messageAuthorDMChannelLastMessageId,
        }
        },
        flags: messageFlags,
        reference: {
          messageID: messageReference.messageID,
          channelID: messageReference.channelID,
          guildID: messageReference.guildID,
        },
        activity: {
          partyID: messageActivity.partyID,
          type: messageActivity.type,
        },
      },
    };



    console.log(`the collection: ${interactionModel.collection}`, interactionModel.collection.collection)
    console.log(`the id: ${id}`, id)
    try {
        await interactionModel.create(interactionObj);
        console.log(`interaction saved to database`);
    } catch (err) {
        console.log(`the user from the interaction is : ${interactionObj.user.username}\n\nthe channel from the interaction is: ${interactionObj.channel.name}\n\nthe guild from the interaction is: ${interactionObj.guild.name}\n\nthe type of interaction is: ${interactionObj.type}\n\nthe command from the interaction is: ${interactionObj.command.name}\n\nthe message from the interaction is: ${interactionObj.message.content}\n\nthe timestamp from the interaction is: ${interactionObj.timestamp}\nthe date from the interaction is: ${interactionObj.date}`);
        console.log(`\n\nerror saving interaction to database: ${err}`);
    }
    return interactionObj;
}
        













module.exports = saveInteraction;