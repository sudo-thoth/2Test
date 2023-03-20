const { Schema, model } = require("mongoose");
// the groupbuy stats schema
const groupbuy = new Schema(
  {
    _id: Schema.Types.ObjectId,
            messageID: String,
            groupBuyID: String,
            amountPaid: Number,
            totalCost: Number,
            timeCreated: Number,
            timeLastUpdate: Number,
            targetChannelID: String,
            roles: [String],
            embed: [Object],
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
      roles: [String],
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
      embeds: [Object],
      reactions: [Object],
      stickers: [Object],
      author: {
        id: String,
        username: String,
        discriminator: String,
        avatar: String,
      },
      reference: {
        messageID: String,
        channelID: String,
        guildID: String,
      },
    },
    
  },
  { collection: "groupbuys" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("groupbuys", groupbuy, "groupbuys");
