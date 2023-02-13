const { Schema, model } = require("mongoose");

const interaction = new Schema(
  {
    _id: Schema.Types.ObjectId,
    id: { type: String, required: true },
    type: String,
    token: String,
    options: [Object],
    command: {
      id: String,
      name: String,
      description: String,
      type: String,
      options: [Object],
      deferred: Boolean,
      replied: Boolean,
      ephemeral: Boolean,
    },
    channel: {
      id: String,
      type: String,
      name: String,
      url: String,
    },
    guild: {
      id: String,
      name: String,
      icon: String,
      url: String,
      owner: {
        id: String,
        username: String,
        discriminator: String,
        avatar: String,
      },
    },
    member: {
      nickname: String,
      roles: String,
    },
    timestamp: Number,
    date: String,
    user: {
      id: String,
      username: String,
      discriminator: String,
      avatar: String,
      bot: Boolean,
      system: String,
      dmChannel: {
        channel: String,
        id: String,
        url: String,
        lastMessageId: String,
        type: String,
      },
      tag: String,
    },
    message: {
      id: String,
      type: String,
      content: String,
      timestamp: Number,
      date: String,
      channelID: String,
      guild: {
        id: String,
        name: String,
        icon: String,
        url: String,
      },
      deletable: Boolean,
      editable: Boolean,
      editedAt: String,
      url: String,
      attachments: [Object],
      embeds: [Object],
      reactions: [Object],
      components: {
        buttons: [Object],
        selectMenus: [Object],
      },
      reactions: [Object],
      stickers: [Object],
      author: {
        id: String,
        username: String,
        discriminator: String,
        avatar: String,
        flags: String,
        dmChannel: {
          id: String,
          url: String,
          lastMessageId: String,
        },
      },
      flags: [Object],
      reference: {
        messageID: String,
        channelID: String,
        guildID: String,
      },
      activity: {
        partyID: String,
        type: String,
      },
    },
  },
  { collection: "interactions" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("interaction", interaction, "interactions");
